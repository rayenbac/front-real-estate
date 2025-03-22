import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service'; // Import PropertyService
import { Property } from '../../../core/models/property.model'; // Import Property model
import Swal from 'sweetalert2';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './property-form.component.html', // Ensure the path is correct
  styleUrls: ['./property-form.component.css']
})
export class PropertyFormComponent implements OnInit {
  propertyForm: FormGroup;
  isEditMode = false;
  propertyId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    public router: Router, // Make router public
    private route: ActivatedRoute
  ) {
    this.propertyForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      type: ['', Validators.required],
      status: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      size: ['', [Validators.required, Validators.min(1)]],
      bedrooms: ['', [Validators.required, Validators.min(0)]],
      bathrooms: ['', [Validators.required, Validators.min(0)]],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', Validators.required],
      amenities: [[]],
      images: [[]],
      owner: ['']
    });
  }

  ngOnInit(): void {
    this.propertyId = this.route.snapshot.paramMap.get('id');
    if (this.propertyId) {
      this.isEditMode = true;
      this.loadPropertyData();
    } else {
      // Set the owner field for new properties (e.g., from the logged-in user)
      const loggedInUserId = 'user123'; // Replace with the actual logged-in user ID
      this.propertyForm.patchValue({ owner: loggedInUserId });
    }
  }

  // Load property data in edit mode
  loadPropertyData(): void {
    if (this.propertyId) {
      this.propertyService.getProperty(this.propertyId).subscribe(
        (property) => {
          this.propertyForm.patchValue(property);
        },
        (error) => {
          console.error('Error loading property:', error);
          this.showErrorAlert('Error loading property data');
        }
      );
    }
  }

  // Handle form submission
  onSubmit(): void {
    if (this.propertyForm.valid) {
      const formData = new FormData();
  
      // Append form fields
      Object.keys(this.propertyForm.value).forEach((key) => {
        if (key !== 'images') {
          formData.append(key, this.propertyForm.value[key]);
        }
      });
  
      // Append images
      const images: File[] = this.propertyForm.get('images')?.value;
      if (images && images.length > 0) {
        images.forEach((file) => {
          formData.append('images', file);
        });
      }
  
      if (this.isEditMode && this.propertyId) {
        // Update property
        this.propertyService.updateProperty(this.propertyId, formData).subscribe(
          () => {
            this.showSuccessAlert('Property updated successfully');
            this.router.navigate(['/admin/properties']);
          },
          (error) => {
            console.error('Error updating property:', error);
            this.showErrorAlert('Error updating property');
          }
        );
      } else {
        // Create new property
        this.propertyService.addProperty(formData).subscribe(
          () => {
            this.showSuccessAlert('Property created successfully');
            this.router.navigate(['/admin/properties']);
          },
          (error) => {
            console.error('Error creating property:', error);
            this.showErrorAlert('Error creating property');
          }
        );
      }
    }
  }
  

  // Handle file input change
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      this.propertyForm.patchValue({ images: files });
    }
  }
  

  // Show success alert
  private showSuccessAlert(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message
    });
  }

  // Show error alert
  private showErrorAlert(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message
    });
  }
}