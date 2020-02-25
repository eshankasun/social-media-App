const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
var User = require('./model/User');

dotenv.config();
const verifyToken = async (req, res, next) => {

  const token = req.cookies['token'] || '';

  const decrypt = await jwt.verify(token, process.env.TOKEN_PRIVATE, (err, authorizedData) => {
    console.log(authorizedData)
    if (err) {
      //If error send Forbidden (403)
      console.log('ERROR: Could not connect to the protected route');
      res.sendStatus(403);
    }
    else {
      //If token is successfully verified, we can send the autorized data 
      // res.json({
      //   message: 'Successful log in',
      //   authorizedData
      // });
      User.findOne({ id: User }, 'name email token', (err, docs) => {
        res.render('index.ejs', {
          user: docs,
          message: 'Successful log in',
          authorizedData,

        });
      });
    }
  })
}




module.exports = verifyToken