import Joi from 'joi';

// Reusable Joi schemas for common objects
const addressSchema = Joi.object({
  street: Joi.string().max(200).trim().allow(''),
  city: Joi.string().max(100).trim().allow(''),
  state: Joi.string().max(100).trim().allow(''),
  pincode: Joi.string()
    .pattern(/^\d{6}$/)
    .allow('')
    .messages({ 'string.pattern.base': 'Pincode must be a 6-digit number' }),
}).messages({
  'object.base': 'Address must be an object',
});

const locationSchema = Joi.object({
  coordinates: Joi.array()
    .items(Joi.number())
    .length(2)
    .messages({ 'array.length': 'Coordinates must contain [longitude, latitude]' }),
}).messages({
  'object.base': 'Location must be an object',
});

const contactSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .allow('')
    .messages({ 'string.pattern.base': 'Phone must be a valid 10-digit number' }),
  email: Joi.string()
    .email()
    .allow('')
    .messages({ 'string.email': 'Email must be a valid email address' }),
}).messages({
  'object.base': 'Contact must be an object',
});

// Schema for validating MongoDB ObjectId
const objectIdSchema = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .required()
  .messages({
    'string.pattern.base': 'Invalid ID format. Must be a 24-character hexadecimal string.',
    'string.empty': 'ID is required.',
  });

const hospitalValidation = {
  createHospital: Joi.object({
    name: Joi.string().max(200).required().trim().messages({
      'string.empty': 'Hospital name is required',
      'string.max': 'Hospital name must be less than 200 characters',
    }),
    address: addressSchema.optional(),
    location: locationSchema.optional(),
    contact: contactSchema.optional(),
  }).unknown(false).messages({
    'object.unknown': 'Unknown field(s) not allowed.',
  }),

  getHospital: Joi.object({
    id: objectIdSchema,
  }),

  updateHospital: Joi.object({
    id: objectIdSchema.required(), // ID is required for update
    name: Joi.string().max(200).trim().optional().messages({
      'string.max': 'Hospital name must be less than 200 characters',
    }),
    address: addressSchema.optional(),
    location: locationSchema.optional(),
    contact: contactSchema.optional(),
  }).min(2).messages({ // min(2) because id is also a field
    'object.min': 'At least one field (excluding ID) must be provided for update',
  }),

  deleteHospital: Joi.object({
    id: objectIdSchema,
  }),
};

export default hospitalValidation;