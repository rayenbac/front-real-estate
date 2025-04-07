import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // ✅ Import this
import { Router } from '@angular/router';
import { PostService } from '../../../core/services/post.service';
import { Post } from '../../../core/models/post.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  standalone: true,
  imports: [CommonModule]  // ✅ Add CommonModule here
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private postService: PostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    this.postService.getPosts().subscribe({
      next: (posts: Post[]) => {
        console.log('Loaded posts:', posts);  // Debugging output
        this.posts = posts;
        this.loading = false;
      },
      error: () => {
        this.showErrorAlert('Error loading posts');
        this.loading = false;
      }
    });
  }

  onDelete(postId: string): void {
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
        this.postService.deletePost(postId).subscribe({
          next: () => {
            this.posts = this.posts.filter(post => post._id !== postId);
            Swal.fire(
              'Deleted!',
              'Post has been deleted successfully.',
              'success'
            );
          },
          error: () => {
            this.showErrorAlert('Failed to delete post');
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

  onAddPost(): void {
    this.router.navigate(['/admin/posts/add']);
  }

  onEditPost(postId: string): void {
    this.router.navigate(['/admin/posts/edit', postId]);
  }

  onViewDetails(postId: string): void {
    this.router.navigate(['/admin/posts', postId]);
  }
}
