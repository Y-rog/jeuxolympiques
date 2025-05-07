import { Component, OnInit } from '@angular/core';
import { TicketResponse } from '../../models/ticket-response.model';
import { TicketService } from '../../services/ticket.service';
import { CommonModule } from '@angular/common';
import { TicketComponent } from '../../shared/ticket/ticket.component';
import printJS from 'print-js';

@Component({
  selector: 'app-tickets-page',
  standalone: true,
  imports: [CommonModule, TicketComponent],
  templateUrl: './tickets-page.component.html',
  styleUrl: './tickets-page.component.css'
})
export class TicketsPageComponent implements OnInit {
  tickets: TicketResponse[] = [];

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.ticketService.getTickets().subscribe({
      next: (tickets: TicketResponse[]) => {
        this.tickets = tickets;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des tickets', error);
      }
    });
  }

}

