/* system libraries */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { invoke } from '@tauri-apps/api/tauri';
import { Subject } from 'rxjs';

/* components */
import { FileInputComponent } from '@views/shared/fields/file-input/file-input.component';
import { INotify, WindowNotifyComponent } from '@views/shared/window-notify/window-notify.component';
import { HeaderPageComponent } from '@views/shared/header-page/header-page.component';
import { XmlToJsonComponent } from '@views/xml-to-json/xml-to-json.component';
import { JsonToXlsComponent } from '@views/json-to-xls/json-to-xls.component';

@Component({
  selector: 'app-xml-to-xls',
  standalone: true,
  imports: [CommonModule, HeaderPageComponent, FileInputComponent, WindowNotifyComponent],
  templateUrl: './xml-to-xls.component.html'
})
export class XmlToXlsComponent {
  title: string = '';

  constructor() {}

  dataNotify: Subject<INotify> = new Subject();
  
  typeFile: string = 'xml';
  fileName: string = '';
  dataXml: string = '';
  dataXls: Array<any> = [];
  pathNewFile: string = '';

  ngOnInit(): void {}

  setDataFile(dataFile: any) {
    this.dataXml = dataFile;
  }

  setFileName(event: any) {
    this.fileName = event;
  }

  setData(event: any) {
    try {
      this.dataXml = event.target.value;
    } catch (err: any) {
      console.error(err);
      this.dataNotify.next({ status: 'error', text: err.toString() });
    }
  }

  convertData() {
    if (this.dataXml != '') {
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(this.dataXml, 'text/xml');
      const dataJson = XmlToJsonComponent.prototype.parseData(Array.from(xmlDoc.children[0].children));
      this.dataXls = JsonToXlsComponent.prototype.parseObj(dataJson);
  
      if (this.dataXls.length > 0) {
        this.dataNotify.next({ status: 'success', text: "The data has been successfully converted!" });
      } else {
        this.dataNotify.next({ status: 'error', text: "No data was received from the file!" });
      }
    } else {
      this.dataNotify.next({ status: 'error', text: "There is no data for conversion!" });
    }
  }

  async saveData() {
    if (this.dataXls.length > 0) {
      const nameNewFile = (this.fileName != '') ? /^(.+)\..+$/.exec(this.fileName)![1] : 'xml_to_xls';
      await invoke("write_xls_data_to_file", {"name": nameNewFile, "data": this.dataXls})
      .then((data: any) => {
        this.pathNewFile = data;
        this.dataNotify.next({ status: 'success', text: `The data has been successfully saved to a file "${data}"!` });
      })
      .catch((err: any) => console.error(err));
    } else if (this.dataXls.length == 0) {
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
