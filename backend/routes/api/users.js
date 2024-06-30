// backend/routes/api/users.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('../../db/models');
const { setTokenCookie, restoreUser } = require('../../utils/auth');


const router = express.Router();

// login
router.post('/login', async (req, res, next) => {
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

// sign up
router.post('/', async (req, res) => {
    const { firstName, lastName, email, username, password } = req.body;
    console.log(firstName);

    const user = await User.create({
        firstName,
        lastName,
        email,
        username,
        password,
        hashedPassword: bcrypt.hashSync(password)
    });

    user.save();

    return res.json({
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username
        }
    });
})

module.exports = router;