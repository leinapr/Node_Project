import { Component } from '@angular/core';
import { MainPageComponent } from './main-page/main-page.component'; // Import MainPageComponent

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true, // This marks the component as standalone
  imports: [MainPageComponent], // Add MainPageComponent to imports
})
export class AppComponent { }
