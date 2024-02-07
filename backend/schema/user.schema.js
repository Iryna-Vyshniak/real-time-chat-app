import Joi from 'joi';

// SIGNUP
export const userSignupSchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .min(3)
    .max(20)
    .required()
    .messages({ 'any.required': 'Full Name is required' }),
  username: Joi.string()
    .trim()
    .required()
    .min(3)
    .max(20)
    .messages({ 'any.required': 'Unique username is required' }),
  password: Joi.string().min(7).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .label('Confirm password')
    .messages({ 'any.only': '{{#label}} does not match password' }),
  gender: Joi.string().valid('male', 'female').required(),
});

// LOGIN
export const userLoginSchema = Joi.object({
  username: Joi.string().required().messages({ 'any.required': 'username is required' }),
  password: Joi.string().min(7).required(),
});
