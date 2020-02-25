const jwt = require('jsonwebtoken');
//import jwt from 'jsonwebtoken'; 

const generateToken = (res, id, name, email) => {

    const expiration = process.env.DB_ENV === 'testing' ? 100 : 604800000;
    const token = jwt.sign({ id, name, email }, process.env.TOKEN_PRIVATE, {
        expiresIn: process.env.DB_ENV === 'testing' ? '3s' : '3s',

    });
    // console.log(token)
    return res.cookie('token', token, {
        expires: new Date(Date.now() + expiration),
        secure: false, // set to true if your using https
        httpOnly: true,

    });

};
module.exports = generateToken