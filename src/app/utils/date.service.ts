import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'  // Cela rend le service disponible globalement
})
export class DateService {

  constructor() {}

  // Fonction pour formater la date au format "jj/mm/AAAA hh:mm"
  formatDateToString(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
}
