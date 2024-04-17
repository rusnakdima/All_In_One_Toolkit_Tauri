/* system libraries */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Subject } from 'rxjs';

/* components */
import { INotify, WindowNotifyComponent } from '@views/shared/window-notify/window-notify.component';

@Component({
  selector: 'app-url-enc-dec',
  standalone: true,
  imports: [CommonModule, WindowNotifyComponent],
  templateUrl: './url-enc-dec.component.html'
})
export class UrlEncDecComponent {
  title: string = '';

  constructor() { }

  dataNotify: Subject<INotify> = new Subject();
  
  urlInput: string = '';
  outputText: string = '';

  ngOnInit(): void {}

  setData(event: any) {
    this.urlInput = event.target.value;
  }

  encode() {
    try {
      const encodeUrl = encodeURIComponent(this.urlInput);
      this.outputText = encodeUrl;
    } catch (error: any) {
      console.error(error);
      this.dataNotify.next({ status: 'error', text: error.toString() });
    }
  }
  
  decode() {
    try {
      const decodeUrl = decodeURIComponent(this.urlInput);
      this.outputText = decodeUrl;
    } catch (error: any) {
      console.error(error);
      this.dataNotify.next({ status: 'error', text: error.toString() });
    }
  }
}
