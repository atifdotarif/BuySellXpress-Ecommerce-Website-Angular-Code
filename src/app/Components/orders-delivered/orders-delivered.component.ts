import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-orders-delivered',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders-delivered.component.html',
  styleUrl: './orders-delivered.component.scss'
})
export class OrdersDeliveredComponent {
  
  orders: any[] = [];
  sellerId: number;
  hoveredOrder: any = 'False';
  deliveryAddress = <any> {
    Street:'' ,
    City:'',
    State:'',
    ZipCode:'',
    PhoneNumber:'',
  };
  showAddress(order:string) {
    this.hoveredOrder='True'
    console.log(order)
    this.http.get<any>(`http://localhost:5148/api/orders/${order}`)
    .subscribe((data) =>{
      this.http.get<any>(`http://localhost:5148/api/addresses/${data.addressId}`).subscribe({
        next: (response) => {
          console.log(response);
          this.deliveryAddress=response;
        },
        error: (err) => {
          console.error('Error fetching address:', err);
        }
      });
    }
  );
    
  }

  hideAddress() {
    this.hoveredOrder = 'False';
  }
  constructor(private http: HttpClient) {
    const localUserData = JSON.parse(localStorage.getItem('localUserData') || '{}');
    this.sellerId = localUserData.id;
  }

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.http.get<any[]>(`http://localhost:5148/api/orderitems/all-order-items-with-seller`, {
      params: {
          sellerId: this.sellerId?.toString() || '',
          status: 'Delivered'
      }
  }).subscribe(response => {
      console.log(response);
      this.orders = response;
  }, error => {
      console.error('Error fetching orders:', error);
  });
}

  markAsDelivered(itemId: string,orderId: string,productId: string,orderedQuantity: number,ItemPrice:Float32Array,status: string) {
    const confirmation = confirm('Are you sure you want to mark this item as delivered?');
    if (confirmation) {
      const updatedOrderItem = {
        itemId: itemId,
        orderId: orderId,
        productId: productId,
        itemPrice: ItemPrice,
        orderedQuantity: orderedQuantity,
        status: 'Delivered'
      };
  
      this.http.put(`http://localhost:5148/api/orderitems/${itemId}`, updatedOrderItem)
        .subscribe(() => {
          this.orders = this.orders.filter(order => order.itemId !== itemId);
        }, error => {
          console.error('Error updating order status:', error);
        });
    }
  }
}
