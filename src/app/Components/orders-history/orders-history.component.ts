import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-orders-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders-history.component.html',
  styleUrl: './orders-history.component.scss'
})
export class OrdersHistoryComponent {
  orderHistories: any[] = [];
  deliveredOrderHistories: any[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  userId: string;
  ShippedOrders: any[]=[];

  constructor(private http: HttpClient) {
    const localUserData = JSON.parse(localStorage.getItem('localUserData') || '{}');
    this.userId = localUserData.id;
    
  }

  ngOnInit(): void {
    this.fetchOrderHistories();
  }

  fetchOrderHistories(): void {
    this.http.post('http://localhost:5148/api/orderhistory/UpdateOrderHistoriesStatus', null).subscribe(
      (response: any) => {
        console.log('OrderHistory status updated successfully:', response);
      },
      (error: any) => {
        console.error('Error while updating OrderHistory:', error);
      }
    );
    this.isLoading = true;
    this.errorMessage = null;
    console.log(this.userId)
    this.http.get(`http://localhost:5148/api/orderhistory/userId?userId=${this.userId}`)
    .subscribe(
      (response: any) => {
        this.orderHistories = response;
        this.filterDeliveredOrders();
        this.filterShippedOrders();
        this.isLoading = false;
      },
      (error: any) => {
        this.errorMessage = `Failed to fetch order histories for UserId: ${this.userId}`;
        this.isLoading = false;
      }
    );
  }

  filterDeliveredOrders(): void {
    this.deliveredOrderHistories = this.orderHistories.filter(
      (order) => order.status === 'Delivered'
    );
  }
  filterShippedOrders(): void {
    this.ShippedOrders = this.orderHistories.filter(
      (order) => order.status === 'Shipped'
    );
  }
  
}
