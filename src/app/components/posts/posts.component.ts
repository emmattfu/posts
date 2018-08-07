import { Component, OnInit, ViewChild } from '@angular/core';
import { PostsService } from "../../services/posts.service";
import { Post } from "../../models/Post"
import { Comment } from "../../models/Comment";
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { NgForm } from "@angular/forms";
import { CommentsService } from "../../services/comments.service";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  post: Post = {
    userId: 1,
    title: '',
    body: ''
  };

  posts: Post[];
  comments: Comment[];
  isAdmin = true;
  // isShow = false;

  @ViewChild('form') form: NgForm;

  constructor(
   public postService: PostsService,
   public toastr: ToastrService,
   public spinner: NgxSpinnerService,
   public commentsService: CommentsService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.postService.getPosts().subscribe((posts: Post[]) => {
      this.posts = posts;
      this.spinner.hide();
    }, error => {
      this.toastr.error(error.message, 'Error');
    } );
  }

  onDelete(id: number) {
    if (id > 100) {
      this.posts = this.posts.filter(post => post.id != id);
    } else {
      this.spinner.show();
      this.postService.deletePost(id).subscribe((data: Object) => {
        this.spinner.show();
        this.posts = this.posts.filter(post => post.id != id);

        this.toastr.success('Post deleted!', 'Success');
        this.spinner.hide();
      }, error => {
        this.toastr.error(error.message, 'Error');
      });
    }
  }

  onSubmit(form) {
    if (form.invalid) return;

    const newPost = {
      title: this.post.title,
      body: this.post.body,
      userId: 1
    };
    this.spinner.show();
    this.postService.addPost(newPost).subscribe((data: Post) => {
      this.posts.unshift(data);

      this.spinner.hide();
      this.toastr.success('Post added!', 'Success');

      this.form.resetForm();
    }, error => {
      this.toastr.error(error.message, 'Error');
    })
  }

  showComments(id: number) {
    if (id > 100) {
        this.posts.forEach((post: Post) => {
          if (post.id === id) {
            this.comments = [
              {
                postId: 101,
                id: 101,
                name: 'n/a',
                email: 'n/a',
                body: 'n/a'
              }
            ];
            post.isShow = !post.isShow;
          }
        })
    } else {
      this.spinner.show();
      this.commentsService.getComments(id).subscribe( (data: Comment[]) => {
        this.posts.forEach((post: Post) => {
          if (post.id === id) {
            this.comments = data;
            post.isShow = !post.isShow;
            this.spinner.hide();
          }
        })
      }, error => {
        this.toastr.error(error.message, 'Error');
      })
    }
  }
}
