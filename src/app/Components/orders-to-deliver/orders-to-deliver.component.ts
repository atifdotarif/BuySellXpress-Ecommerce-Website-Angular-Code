import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders-to-deliver',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './orders-to-deliver.component.html',
  styleUrl: './orders-to-deliver.component.scss'
})
export class OrdersToDeliverComponent {

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

    console.log(this.sellerId)
    this.http.get<any[]>(`http://localhost:5148/api/orderitems/all-order-items-with-seller`, {
      params: {
          sellerId: this.sellerId?.toString() || '',
          status: 'Not Delivered'
      }
  }).subscribe(response => {
      console.log(response);
      this.orders = response;
  }, error => {
      console.error('Error fetching orders:', error);
  });
  
  }

  markAsDelivered(itemid: string, orderid: string, productid: string, orderedquantity: number, itemPrice: number, status: string) {
    const confirmation = confirm('Are you sure you want to mark this item as delivered?');
    if (confirmation) {
      const updatedOrderItem = {
        itemId: itemid,
        orderId: orderid,
        productId: productid,
        itemPrice: itemPrice, 
        orderedQuantity: orderedquantity,
        status: 'Delivered'
      };
      console.log('itemPrice',itemPrice);
      
  
      this.http.put(`http://localhost:5148/api/orderitems/${itemid}`, updatedOrderItem)
        .subscribe(() => {
          // Remove the item from the orders list after successful update
          this.orders = this.orders.filter(order => order.itemId !== itemid);
          console.log('Order item marked as delivered:', updatedOrderItem);
        }, error => {
          console.error('Error updating order status:', error);
        });
    }
  }
  
  
}
