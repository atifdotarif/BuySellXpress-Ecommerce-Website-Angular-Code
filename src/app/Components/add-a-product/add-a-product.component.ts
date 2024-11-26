import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductServiceService } from '../../Services/product-service.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-a-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-a-product.component.html',
  styleUrl: './add-a-product.component.scss'
})
export class AddAProductComponent {
  categories: string[] = ['Motorcycles', 'Electric Appliances', 'Tech']; // List of unique categories
  product: any = {
    sellerId: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    image: '',
    discount: 0
  }
  imageUrl: string | ArrayBuffer | null = null;

  constructor(private productService: ProductServiceService) { }

  http = inject(HttpClient);

  onSubmit() {
    const userData = localStorage.getItem('localUserData');
    if (userData != null) {
      const parseObj = JSON.parse(userData);
      this.product.sellerId = parseObj.id;
    }
  
    // Check if image URL is properly set
    if (this.imageUrl) {
      this.product.image = this.imageUrl as string;  // Ensure the base64 string is sent
    }
  
    const newProduct = {
      sellerId: this.product.sellerId,
      name: this.product.name,
      description: this.product.description,
      price: this.product.price,
      stock: this.product.stock,
      category: this.product.category,
      imageData: this.product.image,  // Make sure image is correctly assigned
      discount: this.product.discount
    };
    console.log(newProduct)
  
    this.http.post('http://localhost:5148/api/products', newProduct).subscribe(
      (response: any) => {
        console.log('Product added successfully', response);
        alert('Product added successfully.');
        // Reset form after successful submission
        
      },
      (error) => {
        console.error('Error adding product', error);
      }
    );
    this.product = {
      sellerId: '',
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      image: '',
      discount: 0
    };
    this.imageUrl = null;
  }
  

  // Function to handle image selection
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files[0]) {
      const file: File = input.files[0];
      const reader = new FileReader();
  
      // Once the file is read, set the image URL to the result
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          this.imageUrl = result as string;  // Ensure this is assigned correctly
          console.log('Image URL:', this.imageUrl);  // Debugging
        }
      };
  
      reader.readAsDataURL(file);  // Read the image as a Data URL
    }
  }
  
}
