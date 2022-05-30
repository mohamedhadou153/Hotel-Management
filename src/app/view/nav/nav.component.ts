import { Component, OnInit , Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  @Input()
  title: string[] = [];
  constructor( private route: ActivatedRoute,) { }

  ngOnInit(): void {
  }

}
