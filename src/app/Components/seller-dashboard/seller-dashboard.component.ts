import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './seller-dashboard.component.html',
  styleUrl: './seller-dashboard.component.scss'
})
export class SellerDashboardComponent {
  sellerName: string = '';
  statistics: { totalProductsSold: number; totalEarnings: number } = {
    totalProductsSold: 0,
    totalEarnings: 0,
  };

  constructor(private http: HttpClient) {
    const localUserData = localStorage.getItem('localUserData');
    if (localUserData) {
      const parsedData = JSON.parse(localUserData);
      this.sellerName = parsedData.name;
    }
  }

  ngOnInit(): void {
    const sellerId = JSON.parse(localStorage.getItem('localUserData') || '{}').id;
    console.log(sellerId)
    if (sellerId) {
      this.fetchStatistics(sellerId);
    }
  }

  fetchStatistics(sellerId: string): void {
    this.http.get<any>(`http://localhost:5148/api/users/${sellerId}/statistics`).subscribe(
      (response) => {
        this.statistics.totalProductsSold = response.totalProductsSold;
        this.statistics.totalEarnings = response.totalEarnings;
      },
      (error) => {
        console.error('Error fetching statistics:', error);
      }
    );
  }
}
