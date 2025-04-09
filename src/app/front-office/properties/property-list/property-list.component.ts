import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
import { Property } from '../../../core/models/property.model';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './property-list.component.html',
  styleUrl: './property-list.component.css'
})
export class PropertyListComponent implements OnInit {
  properties: Property[] = [];
  displayedProperties: Property[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  getImageUrl(media: any[]): string {
    if (media && media.length > 0) {
      return 'http://localhost:3000' + media[0].url;
    }
    return 'assets/images/default-property.jpg';
  }
  
  loadProperties(): void {
    this.loading = true;
    this.propertyService.getProperties().subscribe({
      next: (data) => {
        this.properties = data;
        this.displayedProperties = this.properties.slice(0, 3); // Show only first 3 properties
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load properties';
        this.loading = false;
        console.error('Error fetching properties:', error);
      }
    });
  }
}
