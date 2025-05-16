import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Offer } from '../models/offer.model';
import { OffersService } from '../services/offers.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import Chart, { ChartConfiguration, ChartType } from 'chart.js/auto';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule, MatSlideToggleModule, MatCardModule, MatButton],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})

export class AdminComponent implements OnInit {
  chart?: Chart;
  chartCategory?: Chart;
  offersDataSource = new MatTableDataSource<Offer>();
  displayedColumns: string[] = [
    'offerCategoryTitle','eventTitle', 'eventLocation', 'eventDateTime','price', 'salesCount'
  ];

  sortValue: string = 'salesCount';
  sortOptions: string[] = ['eventDateTime', 'eventLocation', 'eventTitle', 'offerCategoryTitle', 'salesCount'];

  totalSales: number = 0;
  totalOffers: number = 0;
  totalPlaces: number = 0;
  lasrtUpdated: Date = new Date();
  lastUpdatedString: string = this.lasrtUpdated.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  data: { message: string } = { message: 'Default message' };

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private offersService: OffersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.offersService.getStatsSalesOfferForAdmin().subscribe((offers: Offer[]) => {
      offers.forEach(offer => {
        if (offer.active === undefined || offer.active === null) {
          offer.active = false;
        }
      });
      this.offersDataSource.data = offers;
      this.offersDataSource.sort = this.sort;
      if (this.paginator) {
        this.offersDataSource.paginator = this.paginator;
      }
      this.applySort();

      this.totalOffers = offers.length;
      this.totalSales = offers.reduce((sum, offer) => sum + ((offer.price ?? 0) * (offer.salesCount ?? 0)), 0);
      this.totalPlaces = offers.reduce((sum, offer) => sum + (offer.offerCategoryPlacesPerOffer ?? 0), 0);


      // Préparation du graphique : top 10 des offres les plus vendues
      const topOffers = offers
        .sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0))
        .slice(0, 10);

      const labels = topOffers.map(o => o.eventTitle + ' - ' + o.offerCategoryTitle);
      const data = topOffers.map(o => o.salesCount ?? 0);

      this.renderChart(labels, data);

      this.renderCategoryPieChart();
    });
  }

  // Méthode pour appliquer le tri en fonction du choix du select
  onSortChange(): void {
    this.applySort(); // Appliquer le tri après sélection du critère
  }
  
  // Appliquer le tri basé sur la valeur de sortValue
  private applySort(): void {
    const sortHeader = this.sortValue;
  
    // Vérifier le critère de tri et appliquer le bon ordre
    this.offersDataSource.sortingDataAccessor = (data: Offer, header: string) => {
      switch (header) {
        case 'eventDateTime':
          return new Date(data.eventDateTime); 
        case 'eventLocation':
          return data.eventLocation;
        case 'eventTitle':
          return data.eventTitle;
        case 'price':
          return data.price;
        case 'active':
          return data.active ? 1 : 0; 
        case 'offerCategoryTitle':
          return data.offerCategoryTitle; 
        case 'salesCount':
          return data.salesCount;
        default:
          return (data as any)[header];
      }
    };
  
    // Réinitialiser le tri
    this.sort.active = sortHeader;
    this.sort.direction = 'desc'; // Par défaut, tri décroissant
  
    // Appliquer le tri
    this.offersDataSource.sort = this.sort;
  }

  // Graphique avec Chart.js 
  private renderChart(labels: string[], data: number[]): void {
    const canvas = document.getElementById('salesChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Ventes par offre',
            data,
            backgroundColor: '#1795D0'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Top 10 des offres les plus vendues'
          }
        }
      }
    });
  }

  // (Facultatif) Si tu veux utiliser ChartConfiguration de Chart.js
  barChartLabels: string[] = [];
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Ventes par offre',
        backgroundColor: '#42A5F5'
      }
    ]
  };
  barChartType: ChartType = 'bar';

  private renderCategoryPieChart(): void {
    const canvas = document.getElementById('categoryChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.chartCategory) {
      this.chartCategory.destroy();
    }

    // Grouper les offres par catégorie
    const categoryCounts: { [key: string]: number } = {};
    this.offersDataSource.data.forEach(offer => {
      const category = offer.offerCategoryTitle || 'Inconnue';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    // Trier les catégories par nombre décroissant
    const sortedCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1]);

    // Séparer top 5 et autres
    const topCategories = sortedCategories.slice(0, 5);
    const othersCategories = sortedCategories.slice(5);

    const labels = topCategories.map(([category]) => category);
    const data = topCategories.map(([, count]) => count);

    if (othersCategories.length > 0) {
      const othersTotal = othersCategories.reduce((sum, [, count]) => sum + count, 0);
      labels.push('Autres');
      data.push(othersTotal);
    }

    // Palette de couleurs (max 11)
    const colors = [
      '#1795D0', '#F2ABCB', '#DBC57B', '#4CAF50', '#9575CD'
    ];

    this.chartCategory = new Chart(canvas, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors.slice(0, labels.length)
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Répartition des ventes des catégories d’offres (Top 5)'
          },
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value} offre(s)`;
              }
            }
          }
        }
      }
    });
  }

  refreshStats(): void {
    this.lasrtUpdated = new Date();
    this.lastUpdatedString = this.lasrtUpdated.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    this.ngOnInit(); 
  }

}

