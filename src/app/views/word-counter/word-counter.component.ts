/* system libraries */
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

/* components */
import { INotify, WindowNotifyComponent } from '@views/shared/window-notify/window-notify.component';
import { FileInputComponent } from '@views/shared/fields/file-input/file-input.component';
import { HeaderPageComponent } from '@views/shared/header-page/header-page.component';

@Component({
  selector: 'app-word-counter',
  standalone: true,
  imports: [CommonModule, HeaderPageComponent, FileInputComponent, WindowNotifyComponent],
  templateUrl: './word-counter.component.html'
})
export class WordCounterComponent implements OnInit {
  title: string = '';

  constructor() {}

  dataNotify: Subject<INotify> = new Subject();

  typeFile: string = 'txt';

  inputText: string = '';
  outputText: string = '';

  ngOnInit(): void {}

  setDataFile(dataFile: any) {
    this.inputText = dataFile;
  }

  setData(event: any) {
    this.inputText = event.target.value;
  }

  calculate() {
    let text = this.inputText;
    let num_chars = text.split('').length;
    let num_words = text.split(' ').length;

    this.outputText = `${num_chars} characters, ${num_words} words`;
  }
}
