import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet,Router, RouterLinkActive } from '@angular/router';
import { MyConstants } from '../../Constant/constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterLink,RouterOutlet,RouterLinkActive,CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit{
  menus:any = [];
  filteredMenus:any[]=[];
  role:string='';
  router = inject(Router);
  User = {
    name:'',
    email:'',
    password:'',
    address:'',
    role:'',
    image:''
  };
  constructor(){
    
  }
  ngOnInit(): void {
   
    this.menus=MyConstants.menus;
    const userData=localStorage.getItem('localUserData');
    if(userData!=null){
      const parseObj=JSON.parse(userData);
      this.User=JSON.parse(userData);

      this.role=parseObj.role;
    }
    // this.menus.forEach((element:any) => {
    //   const isRolePresent = element.roles.find((role:any)=>role==this.role);
    //   if(isRolePresent  ){
    //     this.filteredMenus.push(element);
    //   }
    // });
    // this.router.navigateByUrl(this.filteredMenus[0].path);
    this.menus.forEach((element:any) => {
      const isRolePresent = element.roles.includes(this.role)
      if(isRolePresent){
        this.filteredMenus.push(element);
      }
    });
    // this.router.navigateByUrl(this.filteredMenus[0].path);
    
  }
  Logout(){
    localStorage.clear();
    this.router.navigateByUrl('login');
  }
}
