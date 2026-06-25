const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

// Custom URL validator using validator.isURL()
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

// Validation schema for creating a clothing item
module.exports.validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
      'string.empty': 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      'string.empty': 'The "imageUrl" field must be filled in',
      'string.uri': 'the "imageUrl" field must be a valid url',
    }),
    weather: Joi.string().valid('hot', 'warm', 'cold').required().messages({
      'string.empty': 'The "weather" field must be filled in',
      'any.only': 'The "weather" field must be one of: hot, warm, cold',
    }),
  }),
});

// Validation schema for user login
module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.empty': 'The "email" field must be filled in',
      'string.email': 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'The "password" field must be filled in',
    }),
  }),
});

// Validation schema for creating a user
module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      'string.empty': 'The "avatar" field must be filled in',
      'string.uri': 'the "avatar" field must be a valid url',
    }),
    email: Joi.string().required().email().messages({
      'string.empty': 'The "email" field must be filled in',
      'string.email': 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'The "password" field must be filled in',
    }),
  }),
});

// Validation schema for ID parameters
module.exports.validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24).messages({
      'string.empty': 'The "id" field must be filled in',
      'string.hex': 'The "id" field must be a valid ID',
      'string.length': 'The "id" field must be a valid ID',
    }),
  }),
});

// Validation schema for routes that use `:itemId` param
module.exports.validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().required().hex().length(24).messages({
      'string.empty': 'The "itemId" field must be filled in',
      'string.hex': 'The "itemId" field must be a valid ID',
      'string.length': 'The "itemId" field must be a valid ID',
    }),
  }),
});

module.exports.validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
      'string.empty': 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      'string.empty': 'The "avatar" field must be filled in',
      'string.uri': 'the "avatar" field must be a valid url',
    }),
  }),
});