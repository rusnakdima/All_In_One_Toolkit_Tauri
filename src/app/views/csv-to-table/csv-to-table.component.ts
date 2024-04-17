/* system libraries */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Subject } from 'rxjs';

/* components */
import { INotify, WindowNotifyComponent } from '@views/shared/window-notify/window-notify.component';
import { FileInputComponent } from '@views/shared/fields/file-input/file-input.component';

@Component({
  selector: 'app-csv-to-table',
  standalone: true,
  imports: [CommonModule, FileInputComponent, WindowNotifyComponent],
  templateUrl: './csv-to-table.component.html'
})
export class CsvToTableComponent {
  title: string = '';

  constructor() {}

  dataNotify: Subject<INotify> = new Subject();
  
  typeFile: string = 'csv';
  arrCSV: Array<any> = [];
  
  dataTable: Array<any> = [];
  blockTable: boolean = false;

  ngOnInit(): void {}

  setDataFile(dataFile: any) {
    this.arrCSV = dataFile.split("\r\n").map((line: any) => line.split(","));
  }

  setData(event: any) {
    if (event.target.value != '' ) {
      this.arrCSV = event.target.value.split("\n").map((line: any) => line.split(","));
    }
  }

  createTable() {
    this.blockTable = true;
    if (this.arrCSV[this.arrCSV.length -1][0] === "") {
      this.arrCSV.pop();
    }
    this.dataTable = this.arrCSV;
  }
}
