const express = require('express');
const jwt = require('jsonwebtoken');

const { Group, Member, Image, User, Venue } = require('../../db/models');

const router = express.Router();

// Get deails of a Group from an id
router.get('/:groupId/details', async (req, res) => {
    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId, {
        include: [
            {
                model: Image,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName'],
                through: {
                    model: Member,
                    where: { status: 'organizer' }
                }
            },
            {
                model: Venue,
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            }
        ]
    });
    // console.log(group);

    if (!group) {
        return res.json({
            message: "Group couldn't be found"
        })
    }

    const groupJson = group.toJSON();
    groupJson.GroupImages = groupJson.Images;
    delete groupJson.Images;
    groupJson.Organizer = groupJson.Users[0];
    delete groupJson.Users;
    groupJson.organizerId = groupJson.Organizer.id;
    // console.log('organizerId:', groupJson.organizerId);

    res.status(200);
    res.json(groupJson);
})

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

// Create a new group
router.post('/', async (req, res) => {
    const { name, about, type, private, city, state } = req.body;

    return res.json({});
})

module.exports = router;