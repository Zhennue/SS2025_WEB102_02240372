const express = require('express');
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUSer
} = required('../controllers/userController.js');

const router = express.Router();

router.route('/').get(getUser).post(createUser);

router.route('/').get(getUser).post(createUser).delete(deleteUSer);

module.exports = router;