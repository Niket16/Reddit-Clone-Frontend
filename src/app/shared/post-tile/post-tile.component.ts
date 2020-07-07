import { Component, OnInit, Input } from '@angular/core';
import { PostService } from '../post.service';
import { PostModel } from '../post-model';
import { faComments} from '@fortawesome/free-solid-svg-icons'


@Component({
  selector: 'app-post-tile',
  templateUrl: './post-tile.component.html',
  styleUrls: ['./post-tile.component.css']
})
export class PostTileComponent implements OnInit {

  posts$: Array<PostModel> = [];
  @Input() data: Array<PostModel>;
  faComments=faComments;

  constructor(private postService: PostService) { 
    this.postService.getAllPosts().subscribe(post => {
      this.posts$ = post;
    })
  }

  ngOnInit(): void {
  }

}
