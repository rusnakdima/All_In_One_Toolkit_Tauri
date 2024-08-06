/* system libraries */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {Md5} from 'ts-md5';
import { Subject } from 'rxjs';

/* components */
import { HeaderPageComponent } from '@views/shared/header-page/header-page.component';
import { INotify, WindowNotifyComponent } from '@views/shared/window-notify/window-notify.component';

@Component({
  selector: 'app-md5-enc-dec',
  standalone: true,
  imports: [CommonModule, HeaderPageComponent, WindowNotifyComponent],
  templateUrl: './md5-enc-dec.component.html'
})
export class Md5EncDecComponent {
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
      const encodeData = Md5.hashStr(this.baseInput);
      this.outputText = encodeData;
    } catch (error: any) {
      console.error(error);
      this.dataNotify.next({ status: 'error', text: error.toString() });
    }
  }

  // decode() {
  //   try {
  //     const decodeData = (this.baseInput);
  //     this.outputText = decodeData;
  //   } catch (error: any) {
  //     console.error(error);
  //     this.dataNotify.next({ status: 'error', text: error.toString() });
  //   }
  // }
}
