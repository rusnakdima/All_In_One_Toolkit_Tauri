/* system libraries */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

/* components */
import { HeaderPageComponent } from '@views/shared/header-page/header-page.component';

@Component({
  selector: 'app-key-code',
  standalone: true,
  imports: [CommonModule, HeaderPageComponent],
  templateUrl: './key-code.component.html'
})
export class KeyCodeComponent {
  constructor() {}

  keyCode: number = 0;
  key: string = '';
  code: string = '';
  isShow: boolean = false; 

  ngOnInit(): void {
    document.addEventListener("keydown", (event: any) => {
      this.isShow = true;
      this.keyCode = event.keyCode || event.which;
      this.key = event.key;
      this.code = event.code;
    });
  }
}
