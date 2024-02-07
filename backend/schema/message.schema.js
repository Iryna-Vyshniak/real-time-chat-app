import Joi from 'joi';

const messageValidation = Joi.object({
  message: Joi.string()
    .min(1)
    .max(500)
    .required()
    .messages({ 'any.required': 'message must be exists' }),
});

export default messageValidation;
