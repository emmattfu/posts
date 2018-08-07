import { Injectable } from '@angular/core';
import { Comment } from "../models/Comment";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private apiUrl = environment.api_url;

  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) { }

  getComments(id): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/posts/${id}/comments`);
  }
}
