import { Component, OnInit, Input } from '@angular/core';
import { PostService } from '../post.service';
import { PostModel } from '../post-model';
import { faComments} from '@fortawesome/free-solid-svg-icons'
import { Router } from '@angular/router';


@Component({
  selector: 'app-post-tile',
  templateUrl: './post-tile.component.html',
  styleUrls: ['./post-tile.component.css']
})
export class PostTileComponent implements OnInit {

  posts$: Array<PostModel> = [];
  @Input() posts: PostModel[];
  faComments=faComments;
  interval: any;
  
  

  constructor(private postService: PostService,private router: Router) { 
    // this.postService.getAllPosts().subscribe(post => {
    //   this.posts$ = post;
    // })
  }

  ngOnInit(): void {
    // this.interval = setInterval(() => { 
    //   this.postService.getAllPosts().subscribe(post => {
    //     this.posts$ = post;
    //   }) 
    // }, 5000);
    console.log(this.posts);
  }

  goToPost(id: number): void {
    this.router.navigateByUrl('/view-post/' + id);
  }

}
