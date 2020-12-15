import { environment } from './../environments/environment';
import { ErrorInterceptor } from './helpers/error-interceptor.service';
import { JwtInterceptorService } from './helpers/jwt-interceptor.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/shared/page-not-found/page-not-found.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { NavComponent } from './components/layout/nav/nav.component';
import { NotAuthorizedComponent } from './components/shared/not-authorized/not-authorized.component';
import { DriversComponent } from './components/admin/drivers/drivers.component';
import { DriversLiveComponent } from './components/admin/drivers-live/drivers-live.component'; // <============
import { DataTablesModule } from 'angular-datatables';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AgmCoreModule } from '@agm/core';
import { OrderByPipe } from './pipes/order-by.pipe';

declare var google;
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    PageNotFoundComponent,
    NavComponent,
    NotAuthorizedComponent,
    DriversComponent,
    DriversLiveComponent,
    OrderByPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgHttpLoaderModule.forRoot(), // <============ Don't forget to call 'forRoot()'!
    DataTablesModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD0-E85MYatjF8nVIGVOh1l4floOTLMmG0',
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
