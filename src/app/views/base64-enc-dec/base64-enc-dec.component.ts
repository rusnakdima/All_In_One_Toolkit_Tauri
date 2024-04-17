/* syste, libraries */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Subject } from 'rxjs';

/* components */
import { INotify, WindowNotifyComponent } from '@views/shared/window-notify/window-notify.component';

@Component({
  selector: 'app-base64-enc-dec',
  standalone: true,
  imports: [CommonModule, WindowNotifyComponent],
  templateUrl: './base64-enc-dec.component.html'
})
export class Base64EncDecComponent {
  title: string = '';

  constructor() {}

  dataNotify: Subject<INotify> = new Subject();

  baseInput: string = '';
  outputText: string = '';

  ngOnInit(): void {}

  setData(event: any) {
    this.baseInput = event.target.value;
  }

  encode() {
    try {
      const encodeData = btoa(this.baseInput);
      this.outputText = encodeData;
    } catch (error: any) {
      console.error(error);
      this.dataNotify.next({ status: 'error', text: error.toString() });
    }
  }
  
  decode() {
    try {
      const decodeData = atob(this.baseInput);
      this.outputText = decodeData;
    } catch (error: any) {
      console.error(error);
      this.dataNotify.next({ status: 'error', text: error.toString() });
    }
  }
}
