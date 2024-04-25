/* system libraries */
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, withViewTransitions } from '@angular/router';

@Component({
  selector: 'app-custom-router-outlet',
  standalone: true,
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  imports: [CommonModule, RouterOutlet],
  templateUrl: './custom-router-outlet.component.html'
})
export class CustomRouterOutletComponent implements OnInit {
  constructor(
    private router: Router
  ) {}

  [key: string]: any;
  numWind: number = 1;
  endPosDivider: number = 0;
  leftPosDivider: number = 0;
  leftPosDivider2: number = 0;

  heightLine: number = 0;
  widthFirstView: number = 0;
  widthSecondView: number = 0;
  widthThirdView: number = 0;

  moveElem: string = '';

  ngOnInit(): void {
    this.router.navigateByUrl('/dashboard(second:dashboard//third:dashboard)');
    setInterval(() => {
      this.endPosDivider = document.body.clientWidth -70;
      if (this.leftPosDivider == 0) {
        this.leftPosDivider = document.body.clientWidth -70;
      }
      if (this.leftPosDivider2 == 0) {
        this.leftPosDivider2 = document.body.clientWidth -70;
      }
    });
  }

  modifyLayout(down: boolean, elem: string) {
    if (down) {
      this.moveElem = elem;
    } else {
      this.moveElem = '';
    }
  }
  
  moveDivider(event: any) {
    if (document.body.clientWidth < event.pageX) {
      this[this.moveElem] = 0;
      if (this.moveElem == 'leftPosDivider2') {
        this.widthThirdView = 0;
        this.numWind = 2;
      } else if (this.moveElem == 'leftPosDivider') {
        this.widthSecondView = 0;
        this.widthFirstView = 0;
        this.numWind = 1;
      }
      this.moveElem = '';
      return;
    }

    if (this.moveElem == 'leftPosDivider') {
      if (this.leftPosDivider <= 300) {
        this.leftPosDivider = 301;
        this.widthFirstView = this.leftPosDivider +16;
        this.moveElem = '';
      }
      if (this.widthSecondView <= 300 && this.numWind == 3) {
        this.leftPosDivider = this.leftPosDivider2 - 320;
        this.widthSecondView = this.leftPosDivider2 - this.leftPosDivider;
        this.moveElem = '';
      }
    } else if (this.moveElem == 'leftPosDivider2') {
      if (this.widthSecondView <= 300) {
        this.widthSecondView = 301;
        this.leftPosDivider2 = this.widthSecondView + this.leftPosDivider +16;
        this.moveElem = '';
      }
    }

    if (this.moveElem != '') {
      this[this.moveElem] = event.pageX -24;
      this.widthFirstView = this.leftPosDivider +16;
      this.widthSecondView = this.leftPosDivider2 - this.widthFirstView;
      this.widthThirdView = document.body.clientWidth - (this.leftPosDivider2 +36);
      if (this.widthThirdView > 200 && this.widthSecondView > 200) {
        this.numWind = 3;
      } else if (this.widthSecondView > 200) {
        this.numWind = 2;
        if (this.endPosDivider - this.leftPosDivider2 < 300) {
          this.leftPosDivider2 = this.endPosDivider;
          this.widthSecondView = this.leftPosDivider2 - this.widthFirstView;
        }
      } else {
        this.numWind = 1;
        if (this.endPosDivider - this.leftPosDivider < 300) {
          this.leftPosDivider = this.endPosDivider;
          this.widthFirstView = 0;
        }
      }
    }
  }
}
