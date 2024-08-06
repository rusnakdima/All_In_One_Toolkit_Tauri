/* system libraries */
import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/tauri';
import { Subject } from 'rxjs';

/* components */
import { INotify, WindowNotifyComponent } from '@views/shared/window-notify/window-notify.component';

@Component({
  selector: 'app-file-input',
  standalone: true,
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  imports: [CommonModule, WindowNotifyComponent],
  templateUrl: './file-input.component.html'
})
export class FileInputComponent implements OnInit, OnDestroy {
  constructor() {
    listen('tauri://file-drop', event => {
      console.log(event)
    })
  }

  dataNotify: Subject<INotify> = new Subject();

  @Input() typeFile: string = '';
  @Output() dataFile: EventEmitter<string> = new EventEmitter();
  @Output() reciveFileName: EventEmitter<string> = new EventEmitter();

  fileName: string = '';
  filePath: string = '';

  ngOnInit(): void {
    this.getFilePath();
  }

  ngOnDestroy(): void {
    this.typeFile = '';
  }

  async getFilePath() {
    await listen("send_file_path", (event: any) => {
      this.fileName = event.payload['file_path'].split(/[\/\\]/g).pop();
      this.filePath = event.payload['file_path'];
      this.reciveFileName.next(this.fileName);
      this.getDataFile();
    });
  }
  
  async getDataFile() {
    if (this.typeFile == 'xls') {
      await invoke("get_data_by_xls", {filePath: this.filePath})
      .then((data: any) => {
        if (data && data != '') {
          this.dataFile.next(data);
        }
      })
      .catch((err: any) => {
        console.error(err);
        this.dataNotify.next({ status: 'error', text: err });
      });
    } else if (this.typeFile != '') {
      await invoke("get_data_by_path", {filePath: this.filePath})
      .then((data: any) => {
        if (data && data != '') {
          this.dataFile.next(data);
        }
      })
      .catch((err: any) => {
        console.error(err);
        this.dataNotify.next({ status: 'error', text: err });
      });
    }
  }

  async chooseFile() {
    await invoke('get_file_path', { typeFile: this.typeFile })
    .catch((err: any) => {
      console.error(err);
      this.dataNotify.next({ status: 'error', text: err });
    });
  }

  allowDrop(e: any){
    e.preventDefault();
  }

  onDrag(e: any){
    e.preventDefault();
  }

  onDragEnter(e: any){
    e.target.classList.add("!border-orange-500");
  }

  onDragLeave(e: any){
    e.target.classList.remove("!border-orange-500");
  }
  
  onDrop(e: any){
    e.preventDefault();
    e.target.classList.remove("!border-orange-500");

    if (e.dataTransfer.items) {
      ; [...e.dataTransfer.items].forEach((item, i) => {
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file.type == `text/${this.typeFile}`) {
            this.dataNotify.next({ status: 'warning', text: "Drop & Down is temporarily not working!" });
          } else {
            this.dataNotify.next({ status: 'error', text: `The file ${file.name} is not a ${this.typeFile} file!` });
          }
        }
      });
    } else {
      ; [...e.dataTransfer.files].forEach((file, i) => {
        console.log(file)
        if (file.type == `text/${this.typeFile}`) {
          this.dataNotify.next({ status: 'warning', text: "Drop & Down is temporarily not working!" });
        } else {
          this.dataNotify.next({ status: 'error', text: `The file ${file.name} is not a ${this.typeFile} file!` });
        }
      });
    }
  }
}
