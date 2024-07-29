const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User, Group, Membership, GroupImage, Sequelize, Venue, Event, Attendance, EventImage } = require('../../db/models');
const { userLoggedIn, restoreUser, requireAuth, requireAuth2, requireProperAuth} = require('../../utils/auth');
const { getUserFromToken, groupExists, venueExists, userExists } = require('../../utils/helper');
const { validateGroup, validateVenue, validateEvent } = require('../../utils/validation');

const router = express.Router();

// Delete a membership to a group specified by id
router.delete('/:groupId/membership/:memberId', restoreUser, requireAuth2, groupExists, userExists, async (req, res) => {
    const user = getUserFromToken(req);

    const groupId = +req.params.groupId;
    const group = await Group.findByPk(groupId);

    const memberId = +req.params.memberId;
    const membershipToDelete = await Membership.findOne(
        { where: { userId: memberId } }
    );
    if (!membershipToDelete) {
        res.status(404);
        return res.json({
            message: "Membership does not exist for this User"
        });
    }

    if (group.organizerId !== user.id && memberId !== user.id) {
        return requireProperAuth(res);
    }

    res.status(200);
    await membershipToDelete.destroy();
    res.json({
        message: "Successfully deleted membership from group"
    });
})

// Create a new venue for a group specified by its id
router.post('/:groupId/venues', restoreUser, requireAuth2, validateVenue, groupExists, async (req, res) => {
    const user = getUserFromToken(req);

    const groupId = req.params.groupId;
    const coHost = await Membership.findOne({
        where: {userId: user.id, groupId, status: 'co-host'}
    });
    const group = await Group.findByPk(groupId);
    if (group.dataValues.organizerId !== user.id && !coHost) {
        return requireProperAuth(res);
    }

    const { address, city, state, lat, lng } = req.body;
    let newVenue = await group.createVenue({
        address, city, state, lat, lng
    });
    newVenue = newVenue.toJSON();
    delete newVenue.updatedAt;
    delete newVenue.createdAt;
    res.status(200);
    res.json(newVenue);
})

// Get all venues for a group specified by its id
router.get('/:groupId/venues', restoreUser, requireAuth2, groupExists, async (req, res) => {
    const user = getUserFromToken(req);

    const groupId = req.params.groupId;
    const coHost = await Membership.findOne({
        where: {userId: user.id, groupId, status: 'co-host'}
    });
    const group = await Group.findByPk(groupId);
    if (group.dataValues.organizerId !== user.id && !coHost) {
        return requireProperAuth(res);
    }

    const venues = await group.getVenues();
    res.status(200);
    res.json({Venues: venues})
})

// Change the status of a membership for a group specified by its id
router.put('/:groupId/membership', restoreUser, requireAuth2, groupExists, userExists, async (req, res) => {
    const user = getUserFromToken(req);

    const { memberId, status } = req.body;

    const membershipToUpdate = await Membership.findOne(
        { where: { userId: memberId } }
    );
    if (!membershipToUpdate) {
        res.status(404);
        return res.json({
            message: "Membership between the user and the group does not exist"
        });
    }

    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId);
    if (status === 'pending') {
        res.status(400);
        return res.json({
            message: "Bad Request",
            errors: {
                status: "Cannot change a membership to pending"
            }
        })
    }
    else if (status === 'member') {
        const coHost = await Membership.findOne({
            where: {userId: user.id, groupId, status: 'co-host'}
        });
        if (group.dataValues.organizerId !== user.id && !coHost) {
            return requireProperAuth(res);
        }
    }
    else if (status === 'co-host') {
        if (group.dataValues.organizerId !== user.id) {
            return requireProperAuth(res);
        }
    }

    if (status === 'member' || status === 'co-host') {
        membershipToUpdate.set({
            status
        });
        await membershipToUpdate.save();
    }
    res.status(200);
    const payload = {
        id: membershipToUpdate.dataValues.id,
        userId: membershipToUpdate.dataValues.userId,
        groupId: membershipToUpdate.dataValues.groupId,
        status: membershipToUpdate.dataValues.status
    };
    return res.json(payload);
})

// Request a membership for a group specified by its id
router.post('/:groupId/membership', restoreUser, requireAuth2, groupExists, async (req, res) => {
    const user = getUserFromToken(req);

    const groupId = req.params.groupId;
    const sameMember = await Membership.findOne({
        where: {
            userId: user.id,
            groupId
        }
    });
    if (sameMember) {
        res.status(400);
        const status = sameMember.dataValues.status;
        if (status === 'pending') {
            return res.json({
                message: "Membership has already been requested"
            })
        }
        else {
            return res.json({
                message: "User is already a member of the group"
            })
        }
    }

    res.status(200);
    const group = await Group.findByPk(groupId);
    const newMember = await group.addMember(user.id, { through: { status:'pending' } });
    const payload = {
        memberId: newMember[0].dataValues.userId,
        status: newMember[0].dataValues.status
    };
    return res.json(payload);
})

// Get all members of a group specified by its id
router.get('/:groupId/members', groupExists, async (req, res) => {
    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId);

    let user;
    let isOrganizer = false;
    let isCoHost = false;
    if (userLoggedIn(req)) {
        user = getUserFromToken(req);
        if (user.id === group.dataValues.organizerId) {
            isOrganizer = true;
        }
        const sameCoHost = await Membership.findOne({
            groupId, userId: user.id, status: 'co-host'
        });
        if (sameCoHost) {
            isCoHost = true;
        }
    }


    let memberCriteria = {
        attributes: ['id', 'firstName', 'lastName'],
        joinTableAttributes: ['status']
    };
    if (!isOrganizer && !isCoHost) {
        memberCriteria.where = 
        {
            '$Membership.status$': {
                [Op.notIn]: ['pending']
            }
        }
    }
    const members = await group.getMembers(memberCriteria);

    res.status(200);
    res.json({ Members: members });
})

// Add an image to a group specified by its id
router.post('/:groupId/images', restoreUser, requireAuth2, groupExists, async (req, res) => {
    const user = getUserFromToken(req);

    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId);
    if (group.dataValues.organizerId !== user.id) {
        return requireProperAuth(res);
    }

    const { url, preview } = req.body;
    let newImage = await group.createGroupImage({ url, preview });
    newImage = newImage.toJSON();
    delete newImage.groupId;
    delete newImage.updatedAt;
    delete newImage.createdAt;
    res.status(200);
    res.json(newImage);
})

// Create an event for a group specified by its id
router.post('/:groupId/events', restoreUser, requireAuth2, validateEvent, groupExists, venueExists, async (req, res) => {
    // Identify current user
    const user = getUserFromToken(req);

    // Identify group
    const groupId = +req.params.groupId;
    const group = await Group.findByPk(groupId);

    // Verify if the current user is the organizer or co-host of the specified group
    const coHost = await Membership.findOne({
        where: {userId: user.id, groupId, status: 'co-host'}
    });
    if (group.dataValues.organizerId !== user.id && !coHost) {
        return requireProperAuth(res);
    }

    // Get the req.body
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    // Verify the venue's existence
    const venue = await Venue.findByPk(venueId);

    // Create an event
    const newEvent = await Event.create({
        venueId, groupId, name, type, capacity, price, description, startDate, endDate
    });

    // Current user becomes the host of the event
    await Attendance.create({
        eventId: newEvent.dataValues.id,
        userId: user.id,
        status: 'host'
    });

    // Create and respond with the proper JSON for the new event
    const newEventJson = newEvent.toJSON();
    delete newEventJson.createdAt;
    delete newEventJson.updatedAt;
    res.status(200);
    res.json(newEventJson);
})

// Get all groups joined or organized by the current user
router.get('/current', restoreUser, requireAuth2, async (req, res) => {
    // Finding user
    const user = getUserFromToken(req);
    const findUser = await User.findByPk(user.id);

    // Getting the groups that the current user is part of
    const groups = await findUser.getJoinedGroup({
        include: [
            {
                model: GroupImage,
                required: false,
                where: { preview: true },
                attributes: []
            }
        ],
    });

    // Aggregate using JavaScript
    for (const group of groups) {
        // Counting member in each group
        const numMembers = await group.countMembers();
        group.dataValues.numMembers = numMembers;

        // Getting the group's preview image
        const previewImage = await GroupImage.findOne({
            where: {
                groupId: group.dataValues.id,
                preview: true,
            }
        })
        group.dataValues.previewImage = previewImage.dataValues.url;

        // Deleting unneeded membership details
        delete group.dataValues.Membership;
    }

    return res.json({Groups: groups});
})

// Get all events of a group specified by its id
router.get('/:groupId/events', groupExists, async (req, res) => {
    const groupId = req.params.groupId;

    // Verify the specified group's existence
    const group = await Group.findByPk(groupId);

    // Find all events related to the specified group
    const events = await Event.findAll({
        where: { groupId },
        include: [
            {
                model: User,
                as: 'Attendee',
                attributes: []
            },
            {
                model: Venue,
                attributes: ['id', 'city', 'state']
            },
            {
                model: EventImage,
                where: {preview: true},
                attributes: [],
            },
            {
                model: Group,
                attributes: ['id', 'name', 'city', 'state']
            }
        ],
        attributes: {
            include: [[Sequelize.fn("COUNT", Sequelize.col("Attendee.id")), "numAttending"],     
                      [Sequelize.fn("", Sequelize.col("EventImages.url")), "previewImage"]]
        },
        group: [
            'Event.id',
        ]
    });
    res.status(200);
    return res.json({Events: events});
})

// Edit a group
router.put('/:groupId', restoreUser, requireAuth2, validateGroup, groupExists, async (req, res) => {
    const user = await getUserFromToken(req);

    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId);
    if (group.dataValues.organizerId !== user.id) {
        return requireProperAuth(res);
    }

    const { name, about, type, private, city, state } = req.body;
    await group.set({
        name, about, type, private, city, state
    });
    await group.save();
    res.status(200);
    res.json(group);
})

// Get details from a group specified by its id
router.get('/:groupId', groupExists, async (req, res) => {
    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId, {
        include: [
            {
                model: GroupImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: Venue,
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            }
        ]
    })

    const members = await group.getMembers();
    const numMembers = members.length;
    group.dataValues.numMembers = numMembers;

    let organizer = await User.findByPk(group.organizerId, {
        attributes: ['id', 'firstName', 'lastName']
    });
    organizer = organizer.toJSON();
    group.dataValues.Organizer = organizer;
    res.status(200);
    res.json(group);
})

// Delete the group specified by its id
router.delete('/:groupId', restoreUser, requireAuth2, groupExists, async (req, res) => {
    const user = await getUserFromToken(req);

    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId);
    if (group.dataValues.organizerId !== user.id) {
        return requireProperAuth(res);
    }

    await group.destroy();
    res.status(200);
    res.json({
        message: "Successfully deleted"
    });
})

// Create a group
router.post('/', restoreUser, requireAuth2, validateGroup, async (req, res) => {
    res.status(201);

    // User creates Group
    const user = getUserFromToken(req);
    console.log(user);
    const { name, about, type, private, city, state } = req.body;
    const newGroup = await Group.create({
        name, about, type, private, city, state,
        organizerId: user.id
    });

    // User becomes the host of its created Group
    await Membership.create({
        userId: user.id,
        groupId: newGroup.dataValues.id,
        status: 'host'
    });
    
    res.json(newGroup);
})

// Get all groups
router.get('/', async (req, res) => {
    const groups = await Group.findAll(
        {
            attributes: [
                'id',
                'organizerId',
                'name',
                'about',
                'type',
                'private',
                'city',
                'state',
                'createdAt',
                'updatedAt',
            ]
        }
    );

    // Iterating through each group
    for (const group of groups) {
        // Count the number of members in group
        const numMembers = await group.countMembers();
        group.dataValues.numMembers = numMembers;

        // Get the group's preview image 
        const previewImage = await group.getGroupImages({
            where: { preview: true }
        });
        if (previewImage.length > 0) {
            group.dataValues.previewImage = previewImage[0].dataValues.url;
        }
        else {
            group.dataValues.previewImage = null;
        }
    }

    res.json({Groups: groups});
})

module.exports = router;