const express = require('express');
const jwt = require('jsonwebtoken');

const { Group, Member, Image, User } = require('../../db/models');

const router = express.Router();

// Get all groups joined or organized by current user
router.get('/currentUser', async (req, res) => {
    const { token } = req.cookies;
    // console.log(token);

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decodedToken);

    const userId = decodedToken.data.id;
    // console.log(userId);
    
    const groups = await Group.findAll({
        where: {
            '$Users.id$': userId
        },
        include: [
            {
                model: User,
                through: { 
                    model: Member,
                    where: { status: 'organizer' },
                    attributes: []
                },
                attributes: ['id']
            },
            {
                model: Image,
                where: {
                    preview: true
                },
                attributes: ['url']
            }
        ]
    });
    // console.log(groups);

    const payload = groups.map(group => {
        const groupJson = group.toJSON();
        const organizerId = groupJson.Users[0].id;
        const previewImage = groupJson.Images[0].url;

        delete groupJson.Users;
        delete groupJson.Images;

        return {
            ...groupJson,
            organizerId,
            previewImage
        };
    })

    res.status(200);
    res.json({
        Groups: payload
    });
})

// Get all group
router.get('/', async (_req, res) => {
    const groups = await Group.findAll({
        include: [
            {
                model: User,
                through: { 
                    model: Member,
                    where: { status: 'organizer' },
                    attributes: []
                },
                attributes: ['id']
            },
            {
                model: Image,
                where: {
                    preview: true
                },
                attributes: ['url']
            }
        ]
    });

    const payload = groups.map(group => {
        const groupJson = group.toJSON();
        const organizerId = groupJson.Users[0].id;
        const previewImage = groupJson.Images[0].url;

        delete groupJson.Users;
        delete groupJson.Images;

        return {
            ...groupJson,
            organizerId,
            previewImage
        };
    })

    res.status(200);
    res.json({
        Groups: payload
    });
});

module.exports = router;