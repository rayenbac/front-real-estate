import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../../core/services/post.service';
import { Post } from '../../../core/models/post.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {
  postForm: FormGroup;
  isEditMode = false;
  postId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      published: [false],
      likes: [0]
    });
  }

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id');
    if (this.postId) {
      this.isEditMode = true;
      this.loadPostData();
    }
  }

  loadPostData(): void {
    if (this.postId) {
      this.postService.getAPost(this.postId).subscribe(
        (post) => {
          this.postForm.patchValue(post);
        },
        (error) => {
          console.error('Error loading post:', error);
          this.showErrorAlert('Error loading post data');
        }
      );
    }
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      const postData = this.postForm.value;
      
      if (this.isEditMode && this.postId) {
        this.postService.updatePost(this.postId, postData).subscribe(
          () => {
            this.showSuccessAlert('Post updated successfully');
            this.router.navigate(['/back-office/posts']);
          },
          (error) => {
            console.error('Error updating post:', error);
            this.showErrorAlert('Error updating post');
          }
        );
      } else {
        this.postService.addPost(postData).subscribe(
          () => {
            this.showSuccessAlert('Post created successfully');
            this.router.navigate(['/back-office/posts']);
          },
          (error) => {
            console.error('Error creating post:', error);
            this.showErrorAlert('Error creating post');
          }
        );
      }
    } else {
      this.showErrorAlert('Please fill in all required fields');
    }
  }

  private showSuccessAlert(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message
    });
  }

  private showErrorAlert(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message
    });
  }
}
