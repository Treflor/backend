var express = require('express');
var router = express.Router();

const userController = require('../../controllers/user');
const { validateBody, schemas } = require('../../helpers/validators');

router.route('/info').get(userController.currentUser);

router.route('/all').get(userController.allUsers);

router.route('/edit').post(validateBody(schemas.updateUserSchema), userController.editUser);

module.exports = router;