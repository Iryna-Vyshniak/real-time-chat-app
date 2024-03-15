import Joi from 'joi';

const messageValidation = Joi.object({
  text: Joi.string().max(500).allow('').optional(),
  img: Joi.string().uri().allow(null).optional(),
  audio: Joi.string().allow(null).optional(),
  quote: Joi.boolean(),
  quotedId: Joi.string().allow('').optional(),
});

export default messageValidation;
