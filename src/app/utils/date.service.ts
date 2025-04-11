import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'  // Cela rend le service disponible globalement
})
export class DateService {

  constructor() {}

  // Fonction pour formater la date au format "yyyy-MM-ddThh:mm" pour datetime-local
  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // Fonction pour formater la date au format "jj/mm/AAAA hh:mm"
  formatDateToString(date: Date | string): string {
    // Si la date est une chaîne, on la convertit en objet Date
    if (typeof date === 'string') {
      date = new Date(date);
    }

    // Vérification pour s'assurer que l'objet est une instance de Date
    if (date instanceof Date && !isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } else {
      throw new Error("Invalid date provided");
    }
  }

  // Fonction pour convertir une chaîne de caractères en objet Date
  convertToDate(dateString: string): Date {
    // Conversion en objet Date si la chaîne est valide
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date;
    } else {
      throw new Error("Invalid date string");
    }
  }
}

