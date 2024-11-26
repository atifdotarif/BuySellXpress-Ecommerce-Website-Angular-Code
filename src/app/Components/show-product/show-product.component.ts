import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../Services/cart.service';
import { FormsModule } from '@angular/forms';
import { delay } from 'rxjs';

@Component({
  selector: 'app-show-product',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './show-product.component.html',
  styleUrl: './show-product.component.scss',
})
export class ShowProductComponent implements OnInit {
viewPreviousItems() {
throw new Error('Method not implemented.');
}
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: string[] = [];
  selectedCategory: string = '';
  reviews: any[] = [];
  newReview: { comments: string; stars: number } = { comments: '', stars: 0 };
  visibleReviews: { [key: string]: boolean } = {}; // Track review visibility for products
  isLoading: boolean = false; // Loading state


  productOwner: any = {
    id: null,
    email: '',
    password: '',
    city: '',
    phoneNumber: null,
  };
  curr_product: Product = {
    id: '',
    sellerId: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    image: '',
    discount: 0,
  };
  sellerNames: { [key: string]: string } = {};
  buyerId: string;
  constructor(private http: HttpClient, private cartService: CartService) {
    const localUserData = JSON.parse(localStorage.getItem('localUserData') || '{}');
    this.buyerId = localUserData.id;
  }

  ngOnInit(): void {
    this.isLoading = true; 
    this.http.get<any[]>('http://localhost:5148/api/products').pipe(delay(500)).subscribe(
      (response: any[]) => {
        this.products = response;
        this.filteredProducts = response;
        this.categories = [
          ...new Set(response.map((product) => product.category)),
        ];
        this.isLoading = false; 
      },
      (error) => {
        console.error('Error fetching products:', error);
        alert('Error fetching products. Please try again.');
        this.isLoading = false; 
      }
    );
  }
  filterByCategory(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const category = selectElement.value;
    this.selectedCategory = category;
    if (category) {
      this.filteredProducts = this.products.filter(
        (product) => product.category === category
      );
    } else {
      this.filteredProducts = this.products;
    }
  }
  // addtoCart(product: any): void {
  //   this.curr_product = product;
  //   this.cartService.addToCart(product);
  // }
  addtoCart(product: any): void {
    this.curr_product = product;
    this.cartService.addToCart(product);
    this.loadReviews(product.productId);
  }
  

  loadReviews(productId: string): void {
    this.isLoading = true; 
    this.http.get<any[]>(`http://localhost:5148/api/reviews?productId=${productId}`).subscribe(
      (response) => {
        this.reviews = response;
        this.isLoading = false; 
      },
      (error) => {
        console.error('Error fetching reviews:', error);
        this.isLoading = false; 
      }
    );
  }

  submitReview(productId: string): void {
    console.log(productId)
    if (!this.newReview.stars || !this.newReview.comments.trim()) {
      alert('Please provide a rating and comments.');
      return;
    }
    const review = {
      productId,
      userId: this.buyerId,
      comments: this.newReview.comments,
      stars: this.newReview.stars,
    };
    console.log(this.filteredProducts)
    this.http.post('http://localhost:5148/api/reviews', review).subscribe(
      () => {
        alert('Review submitted successfully!');
        this.newReview = { comments: '', stars: 0 };
        this.loadReviews(productId);
      },
      (error) => {
        console.error('Error submitting review:', error);
        alert('Failed to submit review. Please try again.');
      }
    );
  }
  toggleReviewVisibility(productId: string): void {
    this.visibleReviews[productId] = !this.visibleReviews[productId];
    if (this.visibleReviews[productId]) {
      this.loadReviews(productId); // Load reviews when the section becomes visible
    }
  }
  
  
}
export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  discount: number;
}
