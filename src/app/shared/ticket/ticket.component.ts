import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketResponse } from '../../models/ticket-response.model';
import { MatButtonModule } from '@angular/material/button';
import { NgxPrintModule } from 'ngx-print';

@Component({
  selector: 'app-ticket',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent {
  @Input() ticket!: TicketResponse;

}

