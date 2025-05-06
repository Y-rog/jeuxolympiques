import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketResponse } from '../../models/ticket-response.model';
import { TicketService } from '../../services/ticket.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ticket',
  imports: [CommonModule],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent implements OnInit {
  ticket: TicketResponse | null = null;
  constructor(private ticketService: TicketService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const ticketId = Number(this.route.snapshot.paramMap.get('id'));
    if (ticketId) {
      this.ticketService.getTicket(ticketId).subscribe((response) => {
        this.ticket = response;
      });
    }
  }
}
