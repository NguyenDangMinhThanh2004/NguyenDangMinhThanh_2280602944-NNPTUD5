var express = require('express');
var router = express.Router();
let Role = require('../schemas/role');
let User = require('../schemas/user');

// GET all roles
router.get('/', async function(req, res, next) {
    try {
        let roles = await Role.find({ isDeleted: false });
        res.status(200).send({
            success: true,
            data: roles
        });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

// GET role by ID
router.get('/:id', async function(req, res, next) {
    try {
        let role = await Role.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) {
            return res.status(404).send({ success: false, message: "Role not found" });
        }
        res.status(200).send({
            success: true,
            data: role
        });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

// CREATE role
router.post('/', async function(req, res, next) {
    try {
        let newRole = new Role({
            name: req.body.name,
            description: req.body.description
        });
        await newRole.save();
        res.status(201).send({
            success: true,
            data: newRole
        });
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
});

// UPDATE role
router.put('/:id', async function(req, res, next) {
    try {
        let updatedRole = await Role.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { name: req.body.name, description: req.body.description },
            { new: true }
        );
        if (!updatedRole) {
            return res.status(404).send({ success: false, message: "Role not found" });
        }
        res.status(200).send({
            success: true,
            data: updatedRole
        });
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
});

// DELETE (soft) role
router.delete('/:id', async function(req, res, next) {
    try {
        let deletedRole = await Role.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (!deletedRole) {
            return res.status(404).send({ success: false, message: "Role not found" });
        }
        res.status(200).send({
            success: true,
            message: "Role deleted successfully"
        });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

// GET users by role ID
router.get('/:id/users', async function(req, res, next) {
    try {
        let role = await Role.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) {
            return res.status(404).send({ success: false, message: "Role not found" });
        }
        let users = await User.find({ role: req.params.id, isDeleted: false }).populate("role");
        res.status(200).send({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

module.exports = router;
