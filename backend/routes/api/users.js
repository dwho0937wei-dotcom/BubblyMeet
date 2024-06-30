// backend/routes/api/users.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('../../db/models');
const { setTokenCookie, restoreUser } = require('../../utils/auth');


const router = express.Router();

// get the currently login user
router.get('/', async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.json({ user: null });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = decodedToken.data;
    return res.json({ user });
});

// login
router.post('/', async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        return res.json({
            message: "Bad Request",
            errors: {
                email: "Email is required",
                password: "Password is required"
            }
        })
    }

    const user = await User.findOne({
        where: {
            email
        }
    });

    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        res.status(401);
        return res.json({
            message: "Invalid credentials"
        })
    }

    const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username
    };

    await setTokenCookie(res, safeUser);

    res.status(200);
    return res.json({
        user: safeUser
    });
});

// sign up
// router.post()

module.exports = router;