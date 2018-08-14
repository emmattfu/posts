import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Post } from "../../models/Post";
import { Comment } from "../../models/Comment";
import {PostsService} from "../../services/posts.service";
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { CommentsService } from "../../services/comments.service";

@Component({
  selector: 'app-one-post',
  templateUrl: './one-post.component.html',
  styleUrls: ['./one-post.component.css']
})
export class OnePostComponent implements OnInit {
  @Input('post') onePost: Post;
  @Input('comment') comment: Comment;
  @Output() deletePost: EventEmitter<number> = new EventEmitter();
  @Output() editPost: EventEmitter<Post> = new EventEmitter();
  @Output() getPostComments: EventEmitter<number> = new EventEmitter();
  editPostId: number;
  comments: Comment[];
  constructor(
    public postService: PostsService,
    public toastr: ToastrService,
    public spinner: NgxSpinnerService,
    public commentsService: CommentsService
  ) { }

  ngOnInit() {
    this.postService.editTaskEvent.subscribe((post: Post) => {
      if (post.id === this.onePost.id) {
        this.editPostId = post.id;
      } else {
        this.editPostId = 0;
      }
    });
  }

  onDelete(id: number) {
    this.deletePost.emit(id);
  }

  onEdit(post) {
    const updatedPost = {
      title: this.onePost.title,
      body: this.onePost.body,
      userId: this.onePost.userId,
      id: this.onePost.id
    };

    this.editPost.emit(updatedPost);
  }

  onCancel() {
    this.editPost.emit({title: '', body: '', userId: 1});
  }

  getComments(id:number) {
    if (id > 100) {
      this.comments = [
        {
          postId: 101,
          id: 101,
          name: 'n/a',
          email: 'n/a',
          body: 'n/a'
        }
      ];
      this.onePost.isShow = !this.onePost.isShow;
    } else {
      this.spinner.show();
      this.commentsService.getComments(id).subscribe( (data: Comment[]) => {
        this.comments = data;
        this.onePost.isShow = !this.onePost.isShow;
        this.spinner.hide();
      }, error => {
        this.toastr.error(error.message, 'Error');
      })
    }
  }
}
