/* system libraries */
import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-nav',
  standalone: true,
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  imports: [CommonModule, RouterModule],
  templateUrl: './nav.component.html'
})
export class NavComponent implements OnInit {
  title: string = '';

  constructor() {}

  @Input() isShowNav: Subject<boolean> = new Subject();

  showNav: boolean = false;

  ngOnInit(): void {
    this.isShowNav.subscribe((value: boolean) => {
      this.showNav = value;
    });
  }

}
