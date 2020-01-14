var express = require('express');
var router = express.Router();

const guidesController = require('../../controllers/guides');
const { validateBody, schemas } = require('../../helpers/validators');


router.route('/').get(guidesController.getAllGuides);

router.route('/').post(validateBody(schemas.createGuideSchema), guidesController.createGuide);

router.route('/:guideId').get(guidesController.getGuide);


module.exports = router;