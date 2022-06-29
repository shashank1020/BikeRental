import * as Joi from '@hapi/joi';
import { UserRole } from '../../user/entity/user.entity';
import {
  BikeModalTypes,
  ColorTypes,
  LocationTypes,
} from '../constants/constants';
import { BadRequestException } from '@nestjs/common';
import * as moment from 'moment';

export const SignupUserSchema: Joi.Schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const AddUserSchema: Joi.Schema = SignupUserSchema.append({
  role: Joi.string()
    .required()
    .valid(...Object.values(UserRole)),
  addRoleByManager: Joi.boolean().required(),
});
export const UpdateUserSchema: Joi.Schema = Joi.object({
  email: Joi.string().email().required(),
  role: Joi.string()
    .required()
    .valid(...Object.values(UserRole)),
});

export const BikeSchema: Joi.Schema = Joi.object({
  model: Joi.string()
    .required()
    .valid(...BikeModalTypes),
  color: Joi.string()
    .required()
    .valid(...ColorTypes),
  location: Joi.string()
    .required()
    .valid(...LocationTypes),
  isAvailable: Joi.boolean().required(),
});

export const SearchBikesSchema: Joi.Schema = Joi.object({
  page: Joi.number().min(1),
  location: Joi.string()
    .required()
    .valid(...LocationTypes),
  fromDate: Joi.date().iso().required(),
  toDate: Joi.date().iso().min(Joi.ref('fromDate')).required(),
});

export const RatingSchema: Joi.Schema = Joi.object({
  id: Joi.number().min(1).required(),
  rate: Joi.number().min(1).required(),
});

export const ReservationSchema: Joi.Schema = Joi.object({
  bikeId: Joi.number().min(1).required(),
  fromDate: Joi.date().iso().required(),
  toDate: Joi.date().iso().min(Joi.ref('fromDate')).required(),
});

export const DateTimeValidation = ({ fromDate, toDate }) => {
  if (!toDate || !fromDate) throw new BadRequestException('Dates are required');
  fromDate = moment(fromDate).format();
  toDate = moment(toDate).format();
  if (fromDate >= toDate)
    throw new BadRequestException("'FromDate' can't be more than 'ToDate'");
  if (toDate < moment().format())
    throw new BadRequestException("Can't search bike for past date");
  return { fromDate, toDate };
};
