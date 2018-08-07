import { Injectable } from '@angular/core';
import { Post } from "../models/Post";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private apiUrl = environment.api_url;

  constructor(
   private http: HttpClient,
   private spinner: NgxSpinnerService
  ) {

  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts`)
  }

  deletePost(id: number): Observable<Object> {
    return this.http.delete<Object>(`${this.apiUrl}/posts/${id}`);
  }

  addPost(post: Post):Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/posts`, post);
  }
}
