import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import ReservationService from '../service/reservation.service';
import { JwtAuthGuard } from '../../user/jwt-auth.guard';
import { JoiValidationPipe } from '../../lib/helper/validation.pipe';
import {
  DateTimeValidation,
  RatingSchema,
  ReservationSchema,
} from '../../lib/helper/validations';

@Controller('reservation')
export default class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  getReservations(@Query() { page = '1', bikeId, userId }, @Request() req) {
    return this.reservationService.getSearchedReservation(
      { page, bikeId, userId },
      req.user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiValidationPipe(ReservationSchema))
  @Post('book')
  async addReservation(@Body() body, @Request() req) {
    DateTimeValidation(body);
    return await this.reservationService.addReservation(body, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id/cancel')
  cancelReservation(@Param('id') reservationId: string, @Request() req: any) {
    return this.reservationService.cancelReservation(reservationId, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiValidationPipe(RatingSchema))
  @Post('/rate')
  addRating(@Body() body, @Request() req: any) {
    return this.reservationService.addRating(body, req.user);
  }
}
