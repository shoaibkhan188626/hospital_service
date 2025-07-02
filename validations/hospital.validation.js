import Joi from 'joi';

const hospitalValidation = {
  createHospital: Joi.object({
    name: Joi.string().max(200).required().trim().messages({
      'string.empty': 'Hospital name is required',
      'string.max': 'Hospital name must be less than 200 characters',
    }),
    address: Joi.object({
      street: Joi.string().max(200).trim().allow(''),
      city: Joi.string().max(100).trim().allow(''),
      state: Joi.string().max(100).trim().allow(''),
      pincode: Joi.string()
        .pattern(/^\d{6}$/)
        .allow('')
        .messages({ 'string.pattern.base': 'Pincode must be 6 digits' }),
    }).optional(),
    location: Joi.object({
      coordinates: Joi.array()
        .items(Joi.number())
        .length(2)
        .optional()
        .messages({ 'array.length': 'Coordinates must contain [longitude, latitude]' }),
    }).optional(),
    contact: Joi.object({
      phone: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .allow('')
        .messages({ 'string.pattern.base': 'Phone must be a valid 10-digit number' }),
      email: Joi.string()
        .email()
        .allow('')
        .messages({ 'string.email': 'Email must be valid' }),
    }).optional(),
  }).unknown(true),

  updateHospital: Joi.object({
    name: Joi.string().max(200).trim().messages({
      'string.max': 'Hospital name must be less than 200 characters',
    }),
    address: Joi.object({
      street: Joi.string().max(200).trim().allow(''),
      city: Joi.string().max(100).trim().allow(''),
      state: Joi.string().max(100).trim().allow(''),
      pincode: Joi.string()
        .pattern(/^\d{6}$/)
        .allow('')
        .messages({ 'string.pattern.base': 'Pincode must be 6 digits' }),
    }).optional(),
    location: Joi.object({
      coordinates: Joi.array()
        .items(Joi.number())
        .length(2)
        .optional()
        .messages({ 'array.length': 'Coordinates must contain [longitude, latitude]' }),
    }).optional(),
    contact: Joi.object({
      phone: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .allow('')
        .messages({ 'string.pattern.base': 'Phone must be a valid 10-digit number' }),
      email: Joi.string()
        .email()
        .allow('')
        .messages({ 'string.email': 'Email must be valid' }),
    }).optional(),
  }).min(1).messages({ 'object.min': 'At least one field must be provided for update' }),
};

export default hospitalValidation;