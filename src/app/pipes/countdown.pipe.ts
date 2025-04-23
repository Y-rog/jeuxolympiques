import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countdown',
  standalone: true,
})
export class CountdownPipe implements PipeTransform {
  transform(milliseconds: number): string {
    if (!milliseconds || milliseconds <= 0) return '00:00';

    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');

    return `${minutes}:${seconds}`;
  }
}
