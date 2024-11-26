import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items: any[] = [];

  constructor() {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      this.items = JSON.parse(savedCart);
    }
  }

  addToCart(product: any): void {
    console.log('Adding product:', product);

    const existingProduct = this.items.find((item) => item.productId === product.productId);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }

    this.saveCartToLocalStorage();
    console.log('Cart after addition:', this.items);
  }

  private saveCartToLocalStorage(): void {
    localStorage.setItem('cartItems', JSON.stringify(this.items));
  }

  getItems(): any[] {
    return this.items;
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  removeFromCart(productId: string): void {
    this.items = this.items.filter((item) => item.productId !== productId);
    this.saveCartToLocalStorage();
  }

  updateQuantity(productId: string, quantity: number): void {
    const product = this.items.find((item) => item.productId === productId);
    if (product) {
      product.quantity = Math.max(1, quantity); // Ensure quantity is at least 1
      this.saveCartToLocalStorage();
    }
  }

  clearCart(): void {
    this.items = [];
    localStorage.removeItem('cartItems');
  }
}
