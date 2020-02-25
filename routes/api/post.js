/** @format */

const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const Post = require('../../model/Post');
const Profile = require('../../model/Profile');
const User = require('../../model/User');

//@route POST api/posts
// @desc Create a post
//@access private
router.post(
  '/',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route GET api/posts
// @desc  get all posts
//@access private

router.get(
  '/',

  auth,
  async (req, res) => {
    try {
      const posts = await Post.find().sort({ date: -1 });
      res.json(posts);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route GET api/posts/:id
// @desc  get  post by ID
//@access private

router.get(
  '/:id',

  auth,
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }
      res.json(post);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Post not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);

//@route DELETE api/post/:id
// @desc  delete  post by id
//@access private

router.delete(
  '/:id',

  auth,
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }

      //check user
      if (post.user.toString() !== req.user.id) {
        res.status(401).json({ msg: 'User not authorized' });
      }
      await post.remove();

      res.json({ msg: 'Post Removed' });
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Post not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);

//@route PUT api/post/like/:id
// @desc  like apost
//@access private

router.put(
  '/like/:id',

  auth,
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      // check if post has already been liked by user

      if (
        post.likes.filter(like => like.user.toString() === req.user.id).length >
        0
      ) {
        return res.status(400).json({ msg: 'Post already liked' });
      }
      post.likes.unshift({ user: req.user.id });

      await post.save(res.json(post.likes));
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route PUT api/post/unlike/:id
// @desc  like apost
//@access private

router.put(
  '/unlike/:id',

  auth,
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      // check if post has already been liked by user

      if (
        post.likes.filter(like => like.user.toString() === req.user.id)
          .length === 0
      ) {
        return res.status(400).json({ msg: 'Post has not yet been liked' });
      }
      // get remove index
      const removeIndex = post.likes
        .map(like => like.user.toString())
        .indexOf(req.user.id);

      post.likes.splice(removeIndex, 1);

      await post.save();
      res.json(post.likes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route POST api/post/comment/:id
// @desc Cromment on a post
//@access private
router.post(
  '/comment/:id',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };
      post.comments.unshift(newComment);
      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route DELETE api/post/comment/:id/:comment_id
// @desc delete comment
//@access private

router.delete(
  '/comment/:id/:comment_id',

  auth,
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      //pul out comment
      const comment = post.comments.find(
        comment => comment.id === req.params.comment_id
      );

      // make sure comments exist
      if (!comment) {
        return res.status(404).json({ msg: 'Comment does not exist' });
      }
      //check user
      if (comment.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
      // get remove index
      const removeIndex = post.comments
        .map(comment => comment.user.toString())
        .indexOf(req.user.id);

      post.comments.splice(removeIndex, 1);

      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);
module.exports = router;
