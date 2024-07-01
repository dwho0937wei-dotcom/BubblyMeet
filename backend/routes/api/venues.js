const express = require('express');

const { Venue, Group } = require('../../db/models');

const router = express.Router();

const groupNotFound = {
    message: "Group couldn't be found"
};

// Get all venues for a group specified by its id
router.get('/:groupId', async (req, res) => {
    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId);
    if (!group) {
        res.status(404);
        return res.json(groupNotFound);
    }

    const venues = await Venue.findAll({
        where: { groupId },
        attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
    });
    res.status(200);
    return res.json({
        Venues: venues
    });
})

module.exports = router;