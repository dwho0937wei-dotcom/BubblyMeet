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
})

// login
router.post('/', async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        where: {
            email
        }
    });

    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = { credential: 'The provided email was invalid.' };
        return next(err);
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
})

module.exports = router;