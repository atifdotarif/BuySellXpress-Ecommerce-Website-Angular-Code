import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-pending-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending-orders.component.html',
  styleUrl: './pending-orders.component.scss'
})
export class PendingOrdersComponent {
  pendingOrders: OrderItem[] = [];
  buyerId: string = '';

  constructor(private http: HttpClient) {
    const localUserData = JSON.parse(localStorage.getItem('localUserData') || '{}');
    this.buyerId = localUserData.id;
  }

  ngOnInit() {
    this.getPendingOrders();
  }

  getPendingOrders() {
    this.http.get<OrderItem[]>(`http://localhost:5148/api/orderitems/order-items-with-buyers`, {
      params: {
          buyerId: this.buyerId?.toString() || '',
          status: 'Not Delivered'
      }
    }).subscribe({
        next: (orders) => {
          this.pendingOrders = orders;
          console.log(this.buyerId)
        },
        error: (error) => {
          console.error('Error fetching pending orders:', error);
          this.pendingOrders = [];
        }
      });
  }
}
export interface OrderItem {
  itemId: string;
  orderId: string;
  productId: string;
  itemPrice: number;
  orderedQuantity: number;
  status: string;
  buyerId: string;
  productName: string;

}

