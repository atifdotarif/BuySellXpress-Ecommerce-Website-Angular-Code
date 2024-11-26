import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent {
  product: any = null;
  categories: string[] = ['Motorcycles', 'Electric Appliances', 'Tech']; // Example categories

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }
  }

  loadProduct(productId: string): void {
    this.http.get<any>(`http://localhost:5148/api/products/${productId}`).subscribe(
      (response) => {
        this.product = {
          productId: response.productId,
          sellerId: response.sellerId,
          name: response.productName, 
          description: response.description,
          price: response.price,
          stock: response.stock,
          category: response.category,
          imageData: response.image,
          discount: response.discount,
        };
      },
      (error) => {
        console.error('Error loading product:', error);
        alert('Error loading product details. Please try again.');
      }
    );
  }
  

  // Submit the updated product details
  onSubmit(): void {
    if (!this.product) {
      return;
    }
  
    const updatedProduct = {
      sellerId: this.product.sellerId,
      name: this.product.name, 
      description: this.product.description,
      price: this.product.price,
      stock: this.product.stock,
      category: this.product.category,
      imageData: this.product.imageData,
      discount: this.product.discount,
    };
  
    this.http.put(`http://localhost:5148/api/products/${this.product.productId}`, updatedProduct).subscribe(
      () => {
        alert('Product updated successfully.');
        this.router.navigate(['/my-products']);
      },
      (error) => {
        console.error('Error updating product:', error);
        alert('Error updating product. Please try again.');
      }
    );
  }
  
}
