const express = require('express');

const { GroupImage } = require('../../db/models');
const { restoreUser, requireAuth2, hostOrCohostOfGroup } = require('../../utils/auth');
const { groupImageExists } = require('../../utils/helper');

const router = express.Router();

// Delete an image for a group
router.delete('/:imageId', restoreUser, requireAuth2, groupImageExists, hostOrCohostOfGroup, async (req, res) => {
    const imageId = req.params.imageId;
    const image = await GroupImage.findByPk(imageId);

    image.destroy();
    return res.status(200).json({
        message: "Successfully deleted"
    })
})

module.exports = router;