import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-products.component.html',
  styleUrl: './my-products.component.scss'
})
export class MyProductsComponent implements OnInit{
    products: any[] = [];
  
    constructor(private http: HttpClient, private router: Router) { }
  
    ngOnInit(): void {
      this.loadSellerProducts();
    }
  
    // Fetch the seller's products from the API
    loadSellerProducts(): void {
      const userData=localStorage.getItem('localUserData');
      if(userData!=null){
        const parseObj=JSON.parse(userData);
        this.http.get<any[]>('http://localhost:5148/api/products').subscribe(
          (response: any[]) => {
            this.products = [];
            for (let item of response) {
              if(item.sellerId===parseObj.id){
                  this.products=this.products.concat(item);
              }
            }
            },
            (error) => {
              console.error('Error fetching seller products:', error);
              alert('Error fetching seller products. Please try again.');
            }
          );
          }
          
      }
    
    
    // Navigate to the product details page
    viewDetails(productId: string): void {
      this.router.navigate(['/product-details', productId]);
    }
  
    // Navigate to the edit product page
    editProduct(productId: string): void {
      this.router.navigate(['/edit-product', productId]);
    }
  
    // Delete a product
    deleteProduct(productId: string): void {
      if (confirm('Are you sure you want to delete this product?')) {
        this.http.delete(`http://localhost:5148/api/products/${productId}`).subscribe(
          () => {
            alert('Product deleted successfully.');
            this.loadSellerProducts(); // Reload the list after deletion
          },
          (error) => {
            console.error('Error deleting product:', error);
            alert('Error deleting product. Please try again.');
          }
        );
      }
    }

    
  }
