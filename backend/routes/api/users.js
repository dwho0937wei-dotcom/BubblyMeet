// backend/routes/api/users.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { User } = require('../../db/models');


const router = express.Router();

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

    return res.json({
        user: safeUser
    });
})

module.exports = router;