import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { NgForm } from "@angular/forms";
import { Post } from "../../models/Post";
import { PostsService } from "../../services/posts.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-new-post-form',
  templateUrl: './add-new-post-form.component.html',
  styleUrls: ['./add-new-post-form.component.css']
})
export class AddNewPostFormComponent implements OnInit {
  @Output() onAddNewPost: EventEmitter<Post> = new EventEmitter();
  @Output() onChangePost: EventEmitter<Post> = new EventEmitter();
  formData: Post = {
    title: '',
    body: '',
    userId: 1
  };

  @ViewChild('form') form: NgForm;

  constructor(
    public postService: PostsService,
    public spinner: NgxSpinnerService,
    public toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.postService.editTaskEvent.subscribe((post: Post) => {
      this.formData = post;
    });
  }

  onAddPost(form) {

    if (form.invalid) return;

    const newPost: Post = {
      title: this.formData.title,
      body: this.formData.body,
      userId: this.formData.userId
    };

    this.spinner.show();
    this.postService.addPost(newPost).subscribe((data: Post) => {
      if (data.id) {
        this.onAddNewPost.emit(data);
        form.resetForm();
      }
    });
  }

  onEditPost(form) {
    if (form.invalid) return;
    this.spinner.show();
    this.postService.editPost(this.formData).subscribe((data: Post) => {
      this.onChangePost.emit(data);
      this.postService.emitEditEvent({title: '', body: '', userId: 1});
      form.resetForm();
    }, error => {
      this.toastr.error(error.message, 'Error');
    });
  }

  onCancel() {
    this.postService.emitEditEvent({title: '', body: '', userId: 1});
  }
}
