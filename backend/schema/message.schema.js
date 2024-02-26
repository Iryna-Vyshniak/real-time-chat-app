import Joi from 'joi';

const messageValidation = Joi.object({
  message: Joi.string().max(500).allow('').optional(),
  img: Joi.string().uri().allow(null).optional(),
});

export default messageValidation;
