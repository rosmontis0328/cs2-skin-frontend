import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { AppComponent } from "./app/app.component";
import { routes } from "./app/app.routes";
import { JwtInterceptor } from "./app/interceptors/jwt.interceptor";

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
}).catch((err) => console.error(err));
