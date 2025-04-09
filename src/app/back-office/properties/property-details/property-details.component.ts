import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
import { Property, PropertyMedia, PropertyAmenity } from '../../../core/models/property.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css']
})
export class PropertyDetailsComponent implements OnInit {
  property: Property | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const propertyId = this.route.snapshot.paramMap.get('id');
    if (propertyId) {
      this.loadPropertyDetails(propertyId);
    }
  }

  private loadPropertyDetails(propertyId: string): void {
    this.loading = true;
    this.propertyService.getProperty(propertyId).subscribe({
      next: (property) => {
        this.property = property;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading property details';
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load property details'
        });
      }
    });
  }

  getMainImage(): PropertyMedia | undefined {
    return this.property?.media.find(m => m.isPrimary);
  }

  getAdditionalImages(): PropertyMedia[] {
    return this.property?.media.filter(m => !m.isPrimary && m.type === 'image').slice(0, 5) || [];
  }

  groupAmenities(): PropertyAmenity[][] {
    if (!this.property?.amenities) return [];
    const amenities = [...this.property.amenities];
    const groups: PropertyAmenity[][] = [];
    const itemsPerGroup = Math.ceil(amenities.length / 3);
    
    for (let i = 0; i < amenities.length; i += itemsPerGroup) {
      groups.push(amenities.slice(i, i + itemsPerGroup));
    }
    
    return groups;
  }

  onEdit(): void {
    if (this.property?._id) {
      this.router.navigate(['/back-office/properties/edit', this.property._id]);
    }
  }

  onDelete(): void {
    if (!this.property?._id) return;

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.propertyService.deleteProperty(this.property!._id).subscribe({
          next: () => {
            Swal.fire(
              'Deleted!',
              'Property has been deleted successfully.',
              'success'
            );
            this.router.navigate(['/back-office/properties']);
          },
          error: (error) => {
            this.error = 'Error deleting property';
            this.loading = false;
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete property'
            });
          }
        });
      }
    });
  }
}
