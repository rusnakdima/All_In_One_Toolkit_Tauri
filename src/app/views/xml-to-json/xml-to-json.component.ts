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
  selector: 'app-xml-to-json',
  standalone: true,
  imports: [CommonModule, HeaderPageComponent, FileInputComponent, WindowNotifyComponent],
  templateUrl: './xml-to-json.component.html'
})
export class XmlToJsonComponent {
  title: string = '';

  constructor() {}

  dataNotify: Subject<INotify> = new Subject();
  
  typeFile: string = 'xml';
  fileName: string = '';
  dataXml: string = '';
  dataJson: {[key: string]: any} | null = null;
  pathNewFile: string = '';

  ngOnInit(): void {}

  setDataFile(dataFile: any) {
    this.dataXml = dataFile;
  }

  setFileName(event: any) {
    this.fileName = event;
  }

  setData(event: any) {
    this.dataXml = event.target.value;
  }

  public parseData(xmlNodes: Array<any>) {
    let tempObj: {[key: string]: any} = {};
    xmlNodes.forEach((elem: any) => {
      if ([...elem.children].length > 0) {
        let rez = this.parseData([...elem.children]);
        if (tempObj[elem.nodeName] != undefined) {
          ; (tempObj[elem.nodeName].length == undefined) ? tempObj[elem.nodeName] = [tempObj[elem.nodeName], rez] : tempObj[elem.nodeName].push(rez);
        } else tempObj[elem.nodeName] = rez;
      } else tempObj[elem.nodeName] = elem.textContent;
    });
    return tempObj;
  }

  convertData() {
    if (this.dataXml != '') {
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(this.dataXml, 'text/xml');
      this.dataJson = this.parseData(Array.from(xmlDoc.children[0].children));
  
      if (this.dataJson && Object.keys(this.dataJson).length > 0) {
        this.dataNotify.next({ status: "success", text: "The data has been successfully converted!"});
      } else {
        this.dataNotify.next({ status: "error", text: "No data was received from the file!"});
      }
    } else {
      this.dataNotify.next({ status: 'error', text: "There is no data for conversion!" });
    }
  }

  async saveData() {
    if (this.dataJson) {
      const nameNewFile = (this.fileName != '') ? /^(.+)\..+$/.exec(this.fileName)![1] : 'xml_to_json';
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
