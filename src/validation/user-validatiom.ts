import Joi from "joi";

const registerUserValidation = Joi.object({
    first_name: Joi.string().max(100).required(),
    full_name: Joi.string().max(100).required(),
    email: Joi.string().max(100).required().email(), //
    password: Joi.string()
        .max(100)
        .required()
        .custom((value, helpers) => {
            if (value.length < 8) {
                return helpers.error("string.custom", {
                    message: "password must be at least 8 characters",
                });
            }
            return value;
        }),
});

const loginUserValidation = Joi.object({
    email: Joi.string().max(100).required(),
    password: Joi.string().max(100).required(),
});

const getUserValidation = Joi.string().max(100).required();

const updateUserValidation = Joi.object({
    email: Joi.string().max(100).required().email(), //
    first_name: Joi.string().max(100).optional(),
    full_name: Joi.string().max(100).optional(),
    password: Joi.string()
        .max(100)
        .optional()
        .custom((value, helpers) => {
            if (value.length < 8) {
                return helpers.error("string.custom", {
                    message: "password must be at least 8 characters",
                });
            }
            return value;
        }),
});

export {
    registerUserValidation,
    loginUserValidation,
    getUserValidation,
    updateUserValidation,
};
