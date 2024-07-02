// backend/routes/api/users.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('../../db/models');
const { setTokenCookie, restoreUser, userLoggedIn } = require('../../utils/auth');

const router = express.Router();

const getUserFromToken = function (req) {
    const { token } = req.cookies;
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = decodeToken.data;
    return user;
} 

// Get the current user
router.get('/', async (req, res) => {
    res.status(200);
    if (!userLoggedIn(req)) {
        return res.json({
            user: null
        })
    }

    const user = getUserFromToken(req);
    return res.json(user);
})

module.exports = router;