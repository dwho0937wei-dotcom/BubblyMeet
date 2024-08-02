const express = require('express');

const { EventImage } = require('../../db/models');
const { restoreUser, requireAuth2, hostOrCohostOfGroup } = require('../../utils/auth');
const { eventImageExists } = require('../../utils/helper');

const router = express.Router();

// Delete an image for an event
router.delete('/:imageId', restoreUser, requireAuth2, eventImageExists, hostOrCohostOfGroup, async (req, res) => {
    const imageId = req.params.imageId;
    const image = await EventImage.findByPk(imageId);
    image.destroy();
    return res.status(200).json({
        message: "Successfully deleted"
    });
})

module.exports = router;