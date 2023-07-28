import React from "react";

import { CloseCircleOutline } from "react-ionicons"

class CsvToTable extends React.Component {
  file: any = null;
  dataField: string = "";

  state = {
    windNotify: false,
    blockTable: false,
    notText: ""
  };

  alertNotify(color: string, title: string) {
    this.setState({
      windNotify: true
    })
    setTimeout(() => {
      let notify = document.querySelector("#windNotify") as HTMLDivElement | null;
      if (notify != null) notify.classList.add(color);
      this.setState({
        notText: title
      })
      
      let timeNotify = document.querySelector("#timeNotify") as HTMLDivElement | null;
      if (timeNotify != null) {
        if(timeNotify.style.width != '') if(+timeNotify.style.width.split('').slice(0, -1).join('') > 0) return;
        let width = 100;
        timeNotify.style.width = `${width}%`;
    
        const interval = setInterval(() => {
          width -= 0.3;
          if (width < 0) {
            width = 0;
            clearInterval(interval);
            this.setState({
              windNotify: false
            })
          }
          if (timeNotify != null) timeNotify.style.width = `${width}%`;
        }, 10);
      }
    }, 10);
  };

  createTableFun = (data: any) => {
    this.setState({
      blockTable: true
    });
    setTimeout(() => {
      const blockTable = document.querySelector('#blockTable') as HTMLDivElement | null;
      const table = document.createElement("table") as HTMLTableElement | null;
      if(blockTable != null && table != null) {
        blockTable.innerHTML = "";
        for(let elem of data){
          let tr = document.createElement("tr");
          for(let elem1 of elem){
            let td = document.createElement("td");
            td.innerHTML = String(elem1);
            td.classList.add("styleTD");
            tr.appendChild(td);
          }
          table.appendChild(tr);
        }
        blockTable.appendChild(table);
      }
    }, 50);
  };

  parseDataFileFun = async () => {
    if(this.file != null){
      const fileUrl = URL.createObjectURL(this.file);
      const response = await fetch(fileUrl);
      const text = await response.text();
      const lines = text.split("\r\n");
      const data: any[] = lines.map((line: any) => line.split(","));
      this.createTableFun(data);
    } else {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    }
  };

  parseDataFieldFun = () => {
    if(this.dataField != ''){
      const lines = this.dataField.split("\n");
      const data = lines.map((line: any) => line.split(","));
      this.createTableFun(data);
    } else {
      this.alertNotify("bg-red-700", "The field is empty! Insert the data!");
    }
  };

  render(){
    return (
      <>
        <div className="flex flex-col gap-y-3">
          <span className="text-2xl font-bold border-b-2 styleBorderSolid">Visualization data from CSV to Table</span>

          <details>
            <summary>
              <span className="text-xl font-bold">Select the CSV file with the data</span>
            </summary>
            
            <div className="flex flex-col gap-y-3">
              <input className="styleFileInput" type="file" onChange={(event: any) => {this.file = event.target.files[0]}} accept=".csv" />
              <button className="styleBut w-max" onClick={() => {this.parseDataFileFun()}}>Create a table</button>
            </div>
          </details>

          <details>
            <summary>
              <span className="text-xl font-bold">Insert CSV data</span>
            </summary>

            <div className="flex flex-col gap-y-3">
              <textarea className="styleTextarea" onChange={(event: any) => {this.dataField = event.target.value}} rows={7}></textarea>
              <button className="styleBut w-max" onClick={() => {this.parseDataFieldFun()}}>Create a table</button>
            </div>
          </details>

          {this.state.blockTable && <div className="flex flex-col" id="blockTable"></div>}
        </div>

        {this.state.windNotify && <div id="windNotify" className="styleWindNotify">
          <div className="flex flex-row p-3">
            <div className="flex flex-col">
              <span className="text-4xl">Notification</span>
              <span>{this.state.notText}</span>
            </div>
            <button onClick={() => {this.setState({windNotify: false})}}>
              <CloseCircleOutline cssClasses={"!text-white !w-10 !h-10"} />
            </button>
          </div>
          <div className="flex flex-col mb-1 bg-white w-full h-1" id="timeNotify"></div>
        </div>}
      </>
    );
  };
};

export default CsvToTable;