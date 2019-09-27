const Joi = require('joi');

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema);
            if (result.error) {
                return res.status(400).json(result.error);
            }

            if (!req.value) { req.value = {}; }
            req.value['body'] = result.value;
            next();
        }
    },

    schemas: {
        authSignUpSchema: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            password2: Joi.string().required(),
            family_name: Joi.string().required(),
            given_name: Joi.string().required(),
            photo: Joi.string(),
        }),
        authSignInSchema: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        })
    }
}