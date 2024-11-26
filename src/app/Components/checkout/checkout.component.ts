import { Component } from '@angular/core';
import { CartService } from '../../Services/cart.service';
import { HttpClient } from '@angular/common/http'; // For API calls
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent {
  cartItems: any[] = [];
  totalPrice: number = 0;
  orderSuccess: boolean = false;
  userId: string = '';
  addressId: string = '';
  checkoutData = {
    contactNumber: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'cod',
  };
  orderId: any;

  constructor(private cartService: CartService, private http: HttpClient) {
    const userData = localStorage.getItem('localUserData');
    if (userData != null) {
      const parseObj = JSON.parse(userData);
      this.userId = parseObj.id;
      console.log(this.userId);
    }
  }

  ngOnInit(): void {
    this.cartItems = this.cartService.getItems();
    this.totalPrice = this.cartService.getTotalPrice();
    console.log(this.totalPrice)
  }
  onSubmit(): void {
    if (this.cartItems.length > 0) {
      const deliveryAddress = {
        Street: this.checkoutData.street,
        City: this.checkoutData.city,
        State: this.checkoutData.state,
        ZipCode: this.checkoutData.zipCode,
        PhoneNumber: this.checkoutData.contactNumber,
        UserId: this.userId,
      };
  
      this.http.post('http://localhost:5148/api/addresses', deliveryAddress).subscribe(
        (response: any) => {
          this.addressId = response.addressId;
          console.log('Address created with ID:', this.addressId);
  
          const orderPayload = {
            UserId: this.userId,
            AddressId: this.addressId,
            TotalPrice: this.totalPrice,
          };
  
          this.http.post('http://localhost:5148/api/orders', orderPayload).subscribe(
            (response: any) => {
              this.orderId = response.orderId;
              console.log('Order created with ID:', this.orderId);
  
              this.cartItems.forEach((item) => {
                const orderItemPayload = {
                  OrderId: this.orderId,
                  ProductId: item.productId,
                  ItemPrice: item.price,
                  OrderedQuantity: item.quantity,
                  Status: 'Not Delivered',
                };
  
                this.http.post('http://localhost:5148/api/orderitems', orderItemPayload).subscribe(
                  () => {
                    console.log('Order item added successfully.');
  
                    const stockUpdatePayload = {
                      ProductId: item.productId,
                      QuantityToSubtract: item.quantity,
                    };
                      console.log(stockUpdatePayload)
                    this.http
                      .put('http://localhost:5148/api/products/subtract-stock', stockUpdatePayload)
                      .subscribe(
                        () => {
                          console.log(`Stock updated for Product ID: ${item.productId}`);
                        },
                        (stockError) => {
                          console.error('Error updating stock:', stockError);
                        }
                      );
                  },
                  (orderItemError) => {
                    console.error('Error in adding order item:', orderItemError);
                  }
                );
              });
  
              const orderHistory = {
                Status: 'Shipped',
                UserId: this.userId,
                OrderId: this.orderId,
              };
  
              this.http.post('http://localhost:5148/api/orderhistory', orderHistory).subscribe(
                () => {
                  console.log('Order history saved successfully.');
                },
                (historyError) => {
                  console.error('Error in saving order history:', historyError);
                }
              );
  
              this.cartService.clearCart();
              this.orderSuccess = true;
              this.checkoutData = {
                contactNumber: '',
                street: '',
                city: '',
                state: '',
                zipCode: '',
                paymentMethod: 'cod',
              };
              this.totalPrice = 0;
              console.log('Order placed successfully');
            },
            (error) => {
              console.error('Error placing order:', error);
              alert('Error placing order');
            }
          );
        },
        (error) => {
          console.error('Error creating address:', error);
          alert('Fill all the entries');
        }
      );
    } else {
      alert('Your cart is empty.');
    }
  }
  
}
