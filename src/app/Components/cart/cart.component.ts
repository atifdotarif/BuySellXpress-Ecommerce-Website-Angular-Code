import { Component, Inject } from '@angular/core';
import { CartService } from '../../Services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

  cartItems: any[] = [];
  totalPrice: number = 0; 

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartItems = this.cartService.getItems();
    this.calculateTotal();
  }

  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
    this.calculateTotal();
  }

  removeFromCart(productId: string): void {
    console.log('Removing product:', productId);
    this.cartService.removeFromCart(productId);
    this.cartItems = this.cartService.getItems();
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalPrice = this.cartService.getTotalPrice();
  }
  router= Inject(Router);
  checkout(): void {
    alert('Proceeding to checkout...');
    
    // this.cartService.clearCart();
  }
}
