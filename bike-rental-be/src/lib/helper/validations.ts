import * as Joi from '@hapi/joi';
import { userRole } from '../../user/entity/user.entity';
import {
  BikeModalTypes,
  ColorTypes,
  LocationTypes,
} from '../constants/constants';

export const CreateBikeSchema: Joi.Schema = Joi.object().keys({
  modal: Joi.string()
    .required()
    .valid(...BikeModalTypes),
  color: Joi.string()
    .required()
    .valid(...ColorTypes),
  location: Joi.string()
    .required()
    .valid(...LocationTypes),
  isAvailable: Joi.boolean().required(),
  avgRating: Joi.number().required().min(1),
});

export const BikesByLocationSchema: Joi.Schema = Joi.object().keys({
  location: Joi.string()
    .required()
    .valid(...LocationTypes),
});

export const UpdateUserSchema: Joi.Schema = Joi.object().keys({
  email: Joi.string().email().required(),
  role: Joi.string()
    .required()
    .valid(...Object.values(userRole)),
});

export const RatingSchema: Joi.Schema = Joi.object().keys({
  id: Joi.number().min(1).required(),
  rate: Joi.number().min(1).max(5).required(),
});
