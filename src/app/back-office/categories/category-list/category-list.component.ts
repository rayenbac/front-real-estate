import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  loading = false;
  error: string | null = null;
  searchTerm = '';
  sortBy = 'name';
  sortOrder = 'asc';

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
        this.loading = false;
      },
      error: () => {
        this.showErrorAlert('Error loading categories');
        this.loading = false;
      }
    });
  }

  onDelete(categoryId: string): void {
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
        this.categoryService.deleteCategory(categoryId).subscribe({
          next: () => {
            this.categories = this.categories.filter(category => category._id !== categoryId);
            Swal.fire(
              'Deleted!',
              'Category has been deleted successfully.',
              'success'
            );
          },
          error: () => {
            this.showErrorAlert('Failed to delete category');
          }
        });
      }
    });
  }

  private showErrorAlert(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message
    });
  }

  onCreate(): void {
    this.router.navigate(['/admin/categories/add']);
  }

  onEdit(categoryId: string): void {
    this.router.navigate(['/admin/categories/edit', categoryId]);
  }

  onView(categoryId: string): void {
    this.router.navigate(['/admin/categories', categoryId]);
  }
}
