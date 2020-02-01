var express = require('express');
var router = express.Router();
var passport = require('passport');

const imagesController = require('../../controllers/images');
const passportJWT = passport.authenticate('jwt', { session: false });

// const { validateBody, schemas } = require('../../helpers/validators');

// router.route('/edit').post(passportJWT, validateBody(schemas.updateUserSchema), userController.editUser);
router.route('/').post(passportJWT, imagesController.insertImages);
router.route('/').get(imagesController.getAllPublishedImages);
router.route('/unpublished').get(passportJWT, imagesController.getAllUnpublishedImages);
router.route('/all').get(passportJWT, imagesController.getAllImages);
router.route('/publish/:galleryId').post(passportJWT, imagesController.publishImages);
router.route('/:galleryId').get(imagesController.getGallery);
router.route('/:galleryId').delete(passportJWT, imagesController.deleteGallery);

module.exports = router;