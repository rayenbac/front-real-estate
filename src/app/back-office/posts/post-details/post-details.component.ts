import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../../core/models/post.model';
import { PostService } from '../../../core/services/post.service';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css'
})
export class PostDetailsComponent implements OnInit {
  post: Post | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.loadPost(postId);
    }
  }

  loadPost(id: string): void {
    this.loading = true;
    this.postService.getAPost(id).subscribe({
      next: (post) => {
        this.post = post;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading post details';
        this.loading = false;
      }
    });
  }

  onEdit(): void {
    if (this.post?._id) {
      this.router.navigate(['/back-office/posts/edit', this.post._id]);
    }
  }

  onDelete(): void {
    if (this.post?._id && confirm('Are you sure you want to delete this post?')) {
      this.loading = true;
      this.postService.deletePost(this.post._id).subscribe({
        next: () => {
          this.router.navigate(['/back-office/posts']);
        },
        error: (error) => {
          this.error = 'Error deleting post';
          this.loading = false;
        }
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/back-office/posts']);
  }
}
