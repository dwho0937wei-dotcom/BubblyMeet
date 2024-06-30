const express = require('express');

const { Group, Member, Image, User } = require('../../db/models');

const router = express.Router();

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