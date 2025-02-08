import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthName',
})
export class MonthNamePipe implements PipeTransform {
  private months: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  transform(monthNumber: number): string {
    return this.months[monthNumber - 1] || 'Desconocido';
  }
}
