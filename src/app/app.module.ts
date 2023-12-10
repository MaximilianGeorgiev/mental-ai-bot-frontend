import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { ToastService, AngularToastifyModule } from 'angular-toastify'; 
import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AngularToastifyModule],
  providers: [ToastService],
  bootstrap: [AppComponent],
})
export class AppModule {}
