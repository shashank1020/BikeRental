import * as Joi from '@hapi/joi';
import { UserRole } from '../../auth/entity/user.entity';
import {
  BikeModalTypes,
  ColorTypes,
  LocationTypes,
} from '../constants/constants';
import { BadRequestException } from '@nestjs/common';
import * as moment from 'moment';

export const SignupUserSchema: Joi.Schema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const UpdateUserSchema: Joi.Schema = Joi.object({
  email: Joi.string().email().required(),
  role: Joi.string()
    .required()
    .valid(...Object.values(UserRole)),
});

export const BikeSchema: Joi.Schema = Joi.object({
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
});

export const BikesByLocationSchema: Joi.Schema = Joi.object({
  location: Joi.string()
    .required()
    .valid(...LocationTypes),
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

export const DateTimeValidation = (from, to) => {
  if (!to || !from) throw new BadRequestException('Dates are required');
  from = moment(from).format();
  to = moment(to).format();
  if (from >= to)
    throw new BadRequestException("'FromDate' can't be more than 'ToDate'");
  if (to < moment().format())
    throw new BadRequestException("Can't book bike for past date");
};
