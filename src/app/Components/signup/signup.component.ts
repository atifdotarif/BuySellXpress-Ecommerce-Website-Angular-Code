import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  obj: any = {
    id: null,
    email: '',
    name:'',
    password: '',
    adress: '',
    role:'',
  };
  http = inject(HttpClient);
  router = inject(Router);
  imageUrl: string | ArrayBuffer | null= null;  // Holds the selected image

  ngOnInit(): void {
    // localStorage.removeItem('newUserName');

  }
  empty:boolean=false;
  
  SignUp() {
    const newUser = {
      name:this.obj.name,
      email: this.obj.email,
      password: this.obj.password,
      address:this.obj.address,
      role:this.obj.role,
      image:this.imageUrl
    };
    this.http.post('http://localhost:5148/api/users', newUser).subscribe(
      (response: any) => {
        // Handle the response from the server (e.g., success message)
        alert('Signup Successful');
      
        localStorage.setItem('status','success');
        this.router.navigateByUrl('login'); // Redirect to login page after signup
      },
      (error) => {
        console.error('Error during signup:', error);
        alert('An error occurred during signup. Please try again later.');
      }
    );
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
            this.imageUrl = result;  // Now it's safely assigned
          }
        };
    
        reader.readAsDataURL(file);  // Read the image as a Data URL
      }
    }    
}
