import * as Joi from 'joi';
import { userRole } from '../../auth/entities/user.entity';
import { LocationTypes } from '../constants/constants';

export function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(3).max(255).required(),
    role: Joi.string().valid(...Object.values(userRole)),
  });

  return schema.validate(user);
}

export function validateLocation(location) {
  const schema = Joi.object({
    location: Joi.string()
      .valid(...LocationTypes)
      .required(),
  });

  return schema.validate(location);
}

export const getBikesByLocation: Joi.Schema = Joi.object().keys({
  location: Joi.string()
    .required()
    .valid(...LocationTypes),
});

export const createUserSchema: Joi.Schema = Joi.object().keys({
  name: Joi.string().required(),
  age: Joi.number().min(0).max(150).required(),
});
