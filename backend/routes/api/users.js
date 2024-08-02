const express = require('express');
const bcrypt = require('bcryptjs');

const { User } = require('../../db/models');
const { setTokenCookie } = require('../../utils/auth');
const { validateSignUp } = require('../../utils/validation');

const router = express.Router();

// Sign up the user
router.post('/', validateSignUp, async (req, res) => {
    const { firstName, lastName, email, username, password } = req.body;

    // Does email already exists?
    const dupEmail = await User.findOne({
        where: {
            email
        }
    });
    if (dupEmail) {
        res.status(500);
        return res.json({
            message: "User already exists",
            errors: {
                email: "User with that email already exists"
            }
        })
    }

    // Does user already exists?
    const dupUser = await User.findOne({
        where: {
            username
        }
    });
    if (dupUser) {
        res.status(500);
        return res.json({
            message: "User already exists",
            errors: {
                username: "User with that username already exists"
            }
        });
    }

    // Creating new user
    const user = await User.create({
        firstName,
        lastName,
        email,
        username,
        hashedPassword: bcrypt.hashSync(password)
    });
    user.save();

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