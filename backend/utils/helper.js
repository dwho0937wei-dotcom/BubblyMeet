// backend/utils/helper.js
const jwt = require('jsonwebtoken');

// Getting Current User From Token
const getUserFromToken = function (req) {
    const { token } = req.cookies;
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = decodeToken.data;
    return user;
} 

module.exports = {
    getUserFromToken
}