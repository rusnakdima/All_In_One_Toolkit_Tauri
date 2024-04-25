/* system libraries */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { invoke } from '@tauri-apps/api/tauri';
import { Subject } from 'rxjs';

/* components */
import { FileInputComponent } from '@views/shared/fields/file-input/file-input.component';
import { INotify, WindowNotifyComponent } from '@views/shared/window-notify/window-notify.component';
import { HeaderPageComponent } from '@views/shared/header-page/header-page.component';

@Component({
  selector: 'app-xls-to-xml',
  standalone: true,
  imports: [CommonModule, HeaderPageComponent, FileInputComponent, WindowNotifyComponent],
  templateUrl: './xls-to-xml.component.html'
})
export class XlsToXmlComponent {
  title: string = '';

  constructor() {}

  dataNotify: Subject<INotify> = new Subject();
  
  typeFile: string = 'xls';
  fileName: string = '';
  dataXls: Array<any> = [];
  dataXml: string = '';
  pathNewFile: string = '';

  setDataFile(dataFile: any) {
    this.dataXls = JSON.parse(dataFile);
  }

  setFileName(event: any) {
    this.fileName = event;
  }

  setData(event: any) {
    if (event.target.value != '') {
      this.dataXls = event.target.value.split("\n").map((elem: string) => elem.split("\t"));
    } else {
      this.dataNotify.next({ status: "error", text: "The field is empty! Insert the data!"});
    }
  }

  parseData(dataArr: Array<any>) {
    let tempXml = "";
    let strokeF = dataArr[0];
    dataArr.splice(0, 1);
    dataArr.forEach((row: any) => {
      tempXml += `<array>`;
      row.forEach((cell: any, index: number) => {
        const key: string = (strokeF[index]) ? strokeF[index].replace(/[\" \"]/gi,"") : `column${index}`;
        tempXml += `<${key}>${cell}</${key}>`;
      });
      tempXml += `</array>`;
    });
    return tempXml;
  }

  convertData() {
    if (this.dataXls.length > 0) {
      this.dataXml = `<root>${this.parseData(this.dataXls)}</root>`;
  
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
      const nameNewFile = (this.fileName != '') ? /^(.+)\..+$/.exec(this.fileName)![1] : 'xls_to_xml';
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
