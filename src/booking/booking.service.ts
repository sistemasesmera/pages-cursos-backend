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

  // Servicio para marcar una fecha como reservada
  reserveDate(date: string) {
    const data = this.getDataFromFile();
    // Buscar la fecha en el array
    const dateToReserve = data.dates.find(
      (d: { date: string; available: boolean }) => d.date === date,
    );
    if (!dateToReserve) {
      throw new Error('Fecha no encontrada');
    }
    // Marcar la fecha como no disponible
    dateToReserve.available = false;
    // Guardar los cambios en el archivo JSON
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
    return { message: `Fecha ${date} reservada con éxito` };
  }
}
