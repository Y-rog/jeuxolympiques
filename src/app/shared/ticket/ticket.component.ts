import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketResponse } from '../../models/ticket-response.model';
import { MatButtonModule } from '@angular/material/button';
import printJS from 'print-js';

@Component({
  selector: 'app-ticket',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent {
  @Input() ticket!: TicketResponse;

  printTicket(): void {
    const ticketElement = document.querySelector('.ticket-card') as HTMLElement;
    
    if (!ticketElement) return;

    // Utilisation de PrintJS pour imprimer le ticket
    printJS({
      printable: ticketElement,
      type: 'html',
      targetStyles: ['*'],
      style: `
        .ticket-card {
          margin: 10px!important;
        }
      `
    });
  }
}

