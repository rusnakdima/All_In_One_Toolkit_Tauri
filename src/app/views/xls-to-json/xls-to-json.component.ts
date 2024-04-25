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
  selector: 'app-xls-to-json',
  standalone: true,
  imports: [CommonModule, HeaderPageComponent, FileInputComponent, WindowNotifyComponent],
  templateUrl: './xls-to-json.component.html'
})
export class XlsToJsonComponent {
  title: string = '';

  constructor() {}

  dataNotify: Subject<INotify> = new Subject();
  
  typeFile: string = 'xls';
  fileName: string = '';
  dataXls: Array<any> = [];
  dataJson: {[key: string]: any} | null = null;
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
    this.dataJson = {"root": {"array": []}};
    let strokeF = dataArr[0];
    dataArr.splice(0, 1);
    dataArr.forEach((row: any) => {
      let tempObj: {[key: string]: any} = {};
      row.forEach((cell: any, index: number) => {
        const key: string = (strokeF[index]) ? strokeF[index].replace(/[\" \"]/gi,"") : `column${index}`;
        tempObj[key] = cell;
      });
      this.dataJson!["root"]["array"].push(tempObj);
    });
  }

  convertData() {
    if (this.dataXls.length > 0) {
      this.parseData(this.dataXls);
  
      if (this.dataJson && Object.keys(this.dataJson).length > 0) {
        this.dataNotify.next({ status: 'success', text: "The data has been successfully converted!" });
      } else {
        this.dataNotify.next({ status: 'error', text: "No data was received from the file!" });
      }
    } else {
      this.dataNotify.next({ status: 'error', text: "There is no data for conversion!" });
    }
  }

  async saveData() {
    if (this.dataJson) {
      const nameNewFile = (this.fileName != '') ? /^(.+)\..+$/.exec(this.fileName)![1] : 'xls_to_json';
      await invoke("write_data_to_file", {"name": nameNewFile, "data": JSON.stringify(this.dataJson), "ext": "json"})
      .then((data: any) => {
        this.pathNewFile = data;
        this.dataNotify.next({ status: 'success', text: `The data has been successfully saved to a file "${data}"!` });
      })
      .catch((err: any) => console.error(err));
    } else if (this.dataJson == null) {
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
