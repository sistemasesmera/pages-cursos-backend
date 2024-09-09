import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BookingService {
  // Ruta al archivo dates.json
  private filePath = path.join(__dirname, '..', '..', 'data', 'dates.json');

  // Leer el archivo JSON
  private getDataFromFile() {
    const data = fs.readFileSync(this.filePath, 'utf-8');
    return JSON.parse(data);
  }

  // Obtener todas las fechas con su estado de disponibilidad
  getAllDates() {
    const data = this.getDataFromFile();
    return data.dates;
  }
}
