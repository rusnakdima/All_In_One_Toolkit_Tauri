/* system libraries */
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

/* components */
import { HeaderComponent } from '@views/shared/header/header.component'; 
import { NavComponent } from '@views/shared/nav/nav.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, NavComponent],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title: string = '';

  constructor() {}

  @Input() isShowNav: Subject<boolean> = new Subject();

  ngOnInit(): void {
    const theme = (localStorage.getItem('theme') != null) ? localStorage.getItem('theme')! : '';
    document.querySelector('html')!.setAttribute("class", theme);
  }

  showNav(show: boolean): void {
    this.isShowNav.next(show);
  }
}
