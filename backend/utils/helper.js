// backend/utils/helper.js
const jwt = require('jsonwebtoken');

// Getting Current User From Token
const getUserFromToken = function (req) {
    const { token } = req.cookies;
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = decodeToken.data;
    return user;
} 

// Validate if group exist
const groupExists = async function (req, res, next) {
    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId);
    if (!group) {
        res.status(404);
        return res.json({
            message: "Group couldn't be found"
        })
    }

    return next();
}

module.exports = {
    getUserFromToken,
    groupExists
}