import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  obj: any = {
    id: null,
    email: '',
    password: '',
    city: '',
    phoneNumber: null,
  };
  http=inject(HttpClient);
  constructor(){
  this.http.get('http://localhost:5148/api/users').subscribe((users: any) => {
    const userData=localStorage.getItem('localUserData');
    if(userData!=null){
      const parseObj=JSON.parse(userData);
      this.obj.email=parseObj.email;
      this.obj.email=parseObj.city;
      this.obj.email=parseObj.phoneNumber;
    }
    // this.obj.email=users.ema;
    // this.obj.city=users.city;
    // this.obj.phoneNumber=users.phoneNumber;
  }, error=> {
    console.error('Error fetching users:', error);
    alert('An error occurred while logging in. Please try again later.');
  });
  }
}
