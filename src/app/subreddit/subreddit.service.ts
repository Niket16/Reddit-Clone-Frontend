import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubredditModel } from './subreddit-model';
import { text } from '@fortawesome/fontawesome-svg-core';

@Injectable({
  providedIn: 'root'
})
export class SubredditService {

  constructor(private http: HttpClient) { }

  getAllSubreddits(): Observable<Array<SubredditModel>> {
    return this.http.get<Array<SubredditModel>>('http://https://redditcloneapp.herokuapp.com/api/subreddit');
  }

  createSubreddit(subredditModel: SubredditModel): Observable<any> {
    return this.http.post('http://https://redditcloneapp.herokuapp.com/api/subreddit',subredditModel, {responseType : 'text'});
  }
}
