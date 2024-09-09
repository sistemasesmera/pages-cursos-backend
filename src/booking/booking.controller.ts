import { Controller, Get } from '@nestjs/common';
import { BookingService } from './booking.service';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // Ruta para obtener todas las fechas
  @Get('dates')
  getAllDates() {
    return this.bookingService.getAllDates();
  }
}
