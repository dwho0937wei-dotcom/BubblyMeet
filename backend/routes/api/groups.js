const express = require('express');

const { Group } = require('../../db/models');

const router = express.Router();

router.get('/', async (_req, res) => {
    const groups = await Group.findAll();
    res.status(200);
    res.json({
        Groups: groups
    });
});

