/* system libraries */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { invoke } from '@tauri-apps/api/tauri';
import { Subject } from 'rxjs';

/* components */
import { FileInputComponent } from '@views/shared/fields/file-input/file-input.component';
import { INotify, WindowNotifyComponent } from '@views/shared/window-notify/window-notify.component';

@Component({
  selector: 'app-json-to-xml',
  standalone: true,
  imports: [CommonModule, FileInputComponent, WindowNotifyComponent],
  templateUrl: './json-to-xml.component.html'
})
export class JsonToXmlComponent {
  title: string = '';

  constructor() {}

  dataNotify: Subject<INotify> = new Subject();
  
  typeFile: string = 'json';
  fileName: string = '';
  dataJson: {[key: string]: any} = {};
  dataXml: string = '';
  pathNewFile: string = '';

  ngOnInit(): void {}

  setDataFile(dataFile: any) {
    this.dataJson = JSON.parse(dataFile);
  }

  setFileName(event: any) {
    this.fileName = event;
  }

  setData(event: any) {
    try {
      this.dataJson = JSON.parse(event.target.value);
    } catch (err: any) {
      console.error(err);
      this.dataNotify.next({ status: 'error', text: err.toString() });
    }
  }

  parseData(obj: {[key: string]: any}, stroke: string = '') {
    let tempElement = '';
    Object.entries(obj).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        tempElement += `${this.parseData(value, key)}`;
      } else if (typeof value == 'object') {
        key = (isNaN(+key)) ? key : stroke;
        key = key.replace(/[\" \"]/gi,"");
        tempElement += `<${key}>${this.parseData(value, key)}</${key}>`;
      } else {
        key = key.replace(/[\" \"]/gi,"");
        tempElement += `<${key}>${value}</${key}>`;
      }
    });
    return tempElement;
  }

  convertData() {
    if (Object.keys(this.dataJson).length > 0) {
      this.dataXml = `<xml>${this.parseData(this.dataJson)}</xml>`;
      if (this.dataXml != '') {
        this.dataNotify.next({ status: 'success', text: "The data has been successfully converted!" });
      } else {
        this.dataNotify.next({ status: 'error', text: "No data was received from the file!" });
      }
    } else {
      this.dataNotify.next({ status: 'error', text: "There is no data for conversion!" });
    }
  }

  async saveData() {
    if (this.dataXml != '') {
      const nameNewFile = (this.fileName != '') ? /^(.+)\..+$/.exec(this.fileName)![1] : 'json_to_xml';
      await invoke("write_data_to_file", {"name": nameNewFile, "data": this.dataXml, "ext": "xml"})
      .then((data: any) => {
        this.pathNewFile = data;
        this.dataNotify.next({ status: 'success', text: `The data has been successfully saved to a file "${data}"!` });
      })
      .catch((err: any) => console.error(err));
    } else if (this.dataXml == '') {
      this.dataNotify.next({ status: 'error', text: "No data was received from the file!" });
    }
  }

  async openFile() {
    if (this.pathNewFile != '') {
      await invoke("open_file_in_app", {"path": this.pathNewFile})
      .then(() => {
        this.dataNotify.next({ status: 'warning', text: "Wait a bit until the program starts to read this file format!" });
      })
      .catch((err: any) => console.error(err));
    } else {
      this.dataNotify.next({ status: 'error', text: "You didn't save the file to open it!" });
    }
  }
}
