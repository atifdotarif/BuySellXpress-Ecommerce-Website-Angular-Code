import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {
  private apiUrl = 'http://localhost:5148/api/products';

  constructor(private http: HttpClient) { }

  addProduct(product: any){
    return this.http.post(this.apiUrl, product);
  }
}