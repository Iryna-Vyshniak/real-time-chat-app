import Joi from 'joi';

const messageValidation = Joi.object({
  text: Joi.string().max(500).allow('').optional(),
  img: Joi.string().uri().allow(null).optional(),
  audio: Joi.string().allow(null).optional(),
});

export default messageValidation;
