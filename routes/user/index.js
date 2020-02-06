var express = require('express');
var router = express.Router();

const userController = require('../../controllers/user');
const { validateBody, schemas } = require('../../helpers/validators');

router.route('/').get(userController.currentUser);

router.route('/all').get(userController.allUsers);

router.route('/unauthorized').get(userController.unauthorizedUsers);

router.route('/authorized').get(userController.authorizedUsers);

router.route('/journeys').get(userController.userJourneys);

router.route('/authorize/:userId').post(userController.authorizeUser);

router.route('/edit').post(validateBody(schemas.updateUserSchema), userController.editUser);

module.exports = router;