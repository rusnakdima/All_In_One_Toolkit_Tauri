/* system libraries */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { invoke } from '@tauri-apps/api/tauri';
import { Subject } from 'rxjs';

/* components */
import { FileInputComponent } from '@views/shared/fields/file-input/file-input.component';
import { INotify, WindowNotifyComponent } from '@views/shared/window-notify/window-notify.component';

@Component({
  selector: 'app-json-to-xls',
  standalone: true,
  imports: [CommonModule, FileInputComponent, WindowNotifyComponent],
  templateUrl: './json-to-xls.component.html'
})
export class JsonToXlsComponent {
  title: string = '';

  constructor() {}

  dataNotify: Subject<INotify> = new Subject();
  
  typeFile: string = 'json';
  fileName: string = '';
  dataJson: {[key: string]: any} = {};
  dataXls: Array<any> = [];
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

  parseArr(arr: Array<any>, startPos: number = 0) {
    let table: Array<Array<string>> = [];
    let tempHead: Array<string> = [];
    tempHead.push(...Array(startPos).fill(""));
    arr.forEach((elem: any) => {
      Object.keys(elem).forEach((key: string) => {
        if (!tempHead.includes(key)) {
          if (Array.isArray(elem[key])) {
            tempHead.push(...[key, ...Array(elem[key].length).fill('')]);
          } else if (typeof elem[key] === "object" && !Array.isArray(elem[key])) {
            tempHead.push(...[key, '']);
          } else {
            tempHead.push(key);
          }
        }
      });
    });
    table.push(tempHead);

    arr.forEach((elem: any) => {
      let tempRow: Array<string> = [];
      tempRow.push(...Array(startPos).fill(''));
      tempHead.forEach((key: string) => {
        if (elem[key] !== undefined && elem[key] !== null) {
          tempRow.push(elem[key].toString());
        }
      });
      table.push(tempRow);
      // tempHead.forEach((key: string, index: number) => {
      //   const value = elem[key];
      //   if (value != undefined && value != null && Array.isArray(value) && typeof(value[0]) == "object") {
      //     // tempRow.push(this.parseArr(value));
      //     this.parseObj(elem, startPos + index).forEach((row: Array<string>, iRow: number) => {
      //       console.log('58 line: ', row)
      //       if (iRow == 0) {
      //         tempRow.push(...row.slice(startPos + index));
      //         table.push(tempRow);
      //       } else {
      //         table.push(row);
      //       }
      //     });
      //   } else if (value != undefined && value != null && !Array.isArray(value) && typeof(value) == "object") {
      //     console.log(startPos, index)
      //     this.parseObj(value, /* startPos + */ index).forEach((row: Array<string>, iRow: number) => {
      //       console.log('68 line: ', row)
      //       if (iRow == 0) {
      //         tempRow.push(...row.slice(/* startPos + */ index));
      //         table.push(tempRow);
      //       } else {
      //         table.push(row);
      //       }
      //     });
      //   } else if (value != undefined && value != null) {
      //     tempRow.push(value.toString());
      //   }
      // });
      // if (Object.values(elem).findIndex((value: any) => typeof value === "object" || Array.isArray(value)) == -1) {
      //   table.push(tempRow);
      // }
    });
    return table;
  }

  parseObj(obj: {[key: string]: any}, startPos: number = 0) {
    let table: Array<Array<string>> = [];
    let tempHead: Array<string> = [];
    tempHead.push(...[...Array(startPos).fill(''), 'Key', 'Value']);
    table.push(tempHead);
    Object.entries(obj).forEach(([key, value]) => {
      let tempRow: Array<string> = [];
      tempRow.push(...[...Array(startPos).fill(''), key]);
      if (value == null) {
        tempRow.push("null");
        table.push(tempRow);
      } else if (Array.isArray(value) && typeof(value[0]) == "object") {
        this.parseArr(value, startPos + 1).forEach((row: Array<string>, iRow: number) => {
          if (iRow == 0) {
            tempRow.push(...row.slice(startPos + 1));
            table.push(tempRow);
          } else {
            table.push(row);
          }
        });
      } else if (!Array.isArray(value) && typeof(value) == "object") {
        this.parseObj(value, startPos + 1).forEach((row: Array<string>, iRow: number) => {
          if (iRow == 0) {
            tempRow.push(...row.slice(startPos + 1));
            table.push(tempRow);
          } else {
            table.push(row);
          }
        });
      } else {
        tempRow.push(value.toString());
        table.push(tempRow);
      }
    });
    return table;
  }

  convertData() {
    if (Object.keys(this.dataJson).length > 0) {
      // this.dataXls = this.parseObj(this.dataJson);
  
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
      const nameNewFile = (this.fileName != '') ? /^(.+)\..+$/.exec(this.fileName)![1] : 'json_to_xls';
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
