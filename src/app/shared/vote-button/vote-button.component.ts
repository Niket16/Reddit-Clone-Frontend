import { Component, OnInit, Input } from '@angular/core';
import { PostModel } from '../post-model';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { VotePayload } from './vote-payload';
import { VoteService } from '../vote.service';
import { AuthService } from 'src/app/auth/shared/auth.service';
import { PostService } from '../post.service';
import { ToastrService } from 'ngx-toastr';
import { VoteType } from './vote-type';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-vote-button',
  templateUrl: './vote-button.component.html',
  styleUrls: ['./vote-button.component.css']
})
export class VoteButtonComponent implements OnInit {

  @Input() post : PostModel;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  votePayload: VotePayload;
  upvoteColor: string;
  downvoteColor: string;
  isLoggedIn: boolean;

  constructor(private voteService: VoteService,private authService: AuthService,private postService: PostService, private toastr: ToastrService) { 
    this.votePayload = {
      voteType: undefined,
      postId: undefined
    }
    this.authService.loggedIn.subscribe((data: boolean) => this.isLoggedIn = data);
  
  }
  ngOnInit(): void {
    // this.updateVoteDetails();
  }

  upvotePost() {
    this.votePayload.voteType = VoteType.UPVOTE;
    this.vote();
    this.downvoteColor = '';
  }
  
  downvotePost() {
    this.votePayload.voteType = VoteType.DOWNVOTE;
    this.vote();
    this.upvoteColor = '';
  }

  private vote() {
    this.votePayload.postId = this.post.id;
    this.voteService.vote(this.votePayload).subscribe(() => {
      this.updateVoteDetails();
    }, error => {
      console.log(error)
      // this.toastr.error(error.error.message);
      this.toastr.error("Error")
      throwError(error);
    });
  }

  private updateVoteDetails() {
    this.postService.getPost(this.post.id).subscribe(post => {
      this.post = post;
    });
  }

 

}
