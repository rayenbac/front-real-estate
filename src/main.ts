import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Import provideHttpClient

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes),
    provideHttpClient(), provideAnimationsAsync()]
}).catch(err => console.error(err));
