import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WeatherComponent } from './weather/weather/weather.component';
import { HomeComponent } from './home/home.component';
import { ContacusComponent } from './contacus/contacus.component';
import { ProfleComponent } from './profle/profle.component';
import { AboutComponent } from './about/about.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { OrdersComponent } from './orders/orders.component';
import { AdminComponent } from './admin/admin.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ToastComponent } from './toast/toast.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { StarsPipe } from './stars.pipe';
import { ReturnExchangeOrderComponent } from './return-exchange-order/return-exchange-order.component';

@NgModule({
  declarations: [
    AppComponent,
    WeatherComponent,
    HomeComponent,
    ContacusComponent,
    ProfleComponent,
    AboutComponent,
    ProductsComponent,
    ProductDetailComponent,
    CartComponent,
    CheckoutComponent,
    LoginComponent,
    RegisterComponent,
    OrdersComponent,
    AdminComponent,
    NavbarComponent,
    FooterComponent,
    ToastComponent,
    WishlistComponent,
    NotFoundComponent,
    StarsPipe,
    ReturnExchangeOrderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
