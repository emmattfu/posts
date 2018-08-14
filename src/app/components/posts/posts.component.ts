import { Component, OnInit, ViewChild } from '@angular/core';
import { PostsService } from "../../services/posts.service";
import { Post } from "../../models/Post"
import { Comment } from "../../models/Comment";
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  posts: Post[];
  comments: Comment[];
  isAdmin = true;

  @ViewChild('form') form: NgForm;

  constructor(
   public postService: PostsService,
   public toastr: ToastrService,
   public spinner: NgxSpinnerService,
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
      this.toastr.success('Post deleted!', 'Success');
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

  onSubmit(post: Post) {
    this.posts.unshift(post);
    this.toastr.success('Post added!', 'Success');
    this.spinner.hide();
  }

  onEdit(post: Post) {
    this.postService.emitEditEvent(post);
  }

  onChange(post: Post) {
    for (let i = 0; i < this.posts.length; i++) {
      if (this.posts[i].id === post.id) {
        this.posts[i] = post;
        this.spinner.hide();
        this.toastr.success('Post edited!', 'Success');
      }
    }
  }
}
