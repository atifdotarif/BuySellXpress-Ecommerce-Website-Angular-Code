import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        redirectTo: '/login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        loadComponent: ()=> import('../app/Components/login/login.component').then(m=>m.LoginComponent)
    },
    {
        path: 'signup',
        loadComponent: ()=> import('../app/Components/signup/signup.component').then(m=>m.SignupComponent)
    },
    {
        path:'',
        loadComponent: ()=> import('../app/Components/layout/layout.component').then(m=>m.LayoutComponent),
        children:[
            {
                path:'profile',
                loadComponent: ()=> import('../app/Components/profile/profile.component').then(m=>m.ProfileComponent)
            },//buyer,seller
            {
                path:'add-a-product',
                loadComponent: ()=> import('../app/Components/add-a-product/add-a-product.component').then(m=>m.AddAProductComponent)
            },//seller
            {
                path:'products',
                loadComponent:()=>import('../app/Components/show-product/show-product.component').then(m=>m.ShowProductComponent)
            },//buyer,seller
            {
                path:'cart',
                loadComponent:()=>import('../app/Components/cart/cart.component').then(m=>m.CartComponent)
            },//buyer,seller
            {
                path:'my-products',
                loadComponent:()=>import('../app/Components/my-products/my-products.component').then(m=>m.MyProductsComponent )
            },//seller
            {
                path:'checkout',
                loadComponent:()=>import('../app/Components/checkout/checkout.component').then(m=>m.CheckoutComponent )
            },//buyer
            {
                path:'orders',
                loadComponent:()=>import('../app/Components/orders-to-deliver/orders-to-deliver.component').then(m=>m.OrdersToDeliverComponent)
            },//seller
            {
                path:'pending-orders',
                loadComponent:()=>import('../app/Components/pending-orders/pending-orders.component').then(m=>m.PendingOrdersComponent)
            },//buyer
            {
                path:'orders-delivered',
                loadComponent:()=>import('../app/Components/orders-delivered/orders-delivered.component').then(m=>m.OrdersDeliveredComponent)
            },//buyer
            {
                path:'orders-history',
                loadComponent:()=>import('../app/Components/orders-history/orders-history.component').then(m=>m.OrdersHistoryComponent)
            },//buyer
            {
                path:'edit-product/:id',
                loadComponent:()=>import('../app/Components/edit-product/edit-product.component').then(m=>m.EditProductComponent)
            },
            {
                path:'seller-dashboard',
                loadComponent:()=>import('../app/Components/seller-dashboard/seller-dashboard.component').then(m=>m.SellerDashboardComponent)
            }
        ]
    }
];
