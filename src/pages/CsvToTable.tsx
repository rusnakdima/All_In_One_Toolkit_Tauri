import React from "react";

import WindNotify from "./WindNotify";

class CsvToTable extends React.Component {
  childRef: any = React.createRef();

  file: any = null;
  dataField: string = "";

  state = {
    blockTable: false,
  };

  alertNotify(color: string, title: string) {
    this.childRef.current.alertNotify(color, title);
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
      const data: any[] = text.split("\r\n").map((line: any) => line.split(","));
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

          <details className="styleDetails">
            <summary>
              <span className="text-xl font-bold">Select the CSV file with the data</span>
            </summary>
            
            <div className="flex flex-col gap-y-3">
              <input className="styleFileInput" type="file" onChange={(event: any) => {this.file = event.target.files[0]}} accept=".csv" />
              <button className="styleBut w-max" onClick={() => {this.parseDataFileFun()}}>Create a table</button>
            </div>
          </details>

          <details className="styleDetails">
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

        <WindNotify ref={this.childRef} />
      </>
    );
  };
};

export default CsvToTable;