/* system libraries */
import { CommonModule, Location } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  constructor() {}

  @Output() isShowNav: EventEmitter<boolean> = new EventEmitter();

  themeVal: string = '';

  ngOnInit(): void {
    this.themeVal = (localStorage.getItem('theme') != null) ? localStorage.getItem('theme')! : '';
  }

  showNav() {
    this.isShowNav.next(true);
  }

  setTheme(theme: string) {
    document.querySelector('html')!.setAttribute("class", theme);
    localStorage.setItem('theme', theme);
    this.themeVal = theme;
  }
}
