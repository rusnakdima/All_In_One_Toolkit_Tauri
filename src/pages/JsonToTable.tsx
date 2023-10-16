import React from "react";
import { Link } from "react-router-dom";
import { ChevronBackCircleOutline } from "react-ionicons";

import WindNotify from "./WindNotify";

class JsonToTable extends React.Component {
  childRef: any = React.createRef();
  
  file: any = null;
  dataField: string = "";

  state = {
    blockTable: false,
  };

  alertNotify(color: string, title: string) {
    this.childRef.current.alertNotify(color, title);
  };

  parseArr = (arr: any[]) => {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    let tr = document.createElement('tr');
    Object.keys(arr[0]).forEach((key: string) => {
      let th = document.createElement('th');
      th.innerText = key;
      th.classList.add("styleTD");
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    arr.forEach((elem: any) => {
      let tr = document.createElement('tr');
      Object.values(elem).forEach((value: any) => {
        let td = document.createElement('td');
        td.classList.add("styleTD");
        if(value == null){
          td.innerText = "null";
        } else if(Array.isArray(value) && typeof(value[0]) == "object") {
          td.appendChild(this.parseArr(value));
        } else if(!Array.isArray(value) && typeof(value) == "object"){
          td.appendChild(this.parseObj(value));
        } else {
          td.innerText = value;
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    return table;
  };

  parseObj = (object: {[key: string]: any}) => {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    let tr = document.createElement('tr');
    let th = document.createElement('th');
    th.innerText = "Key";
    th.classList.add("styleTD");
    tr.appendChild(th);
    th = document.createElement('th');
    th.innerText = "Value";
    th.classList.add("styleTD");
    tr.appendChild(th);
    thead.appendChild(tr);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    Object.entries(object).forEach(([key, value]) => {
      let tr = document.createElement('tr');
      let td = document.createElement('td');
      td.innerText = key;
      td.classList.add("styleTD");
      tr.appendChild(td);
      td = document.createElement('td');
      td.classList.add("styleTD");
      if(value == null){
        td.innerText = "null";
      } else if(Array.isArray(value) && typeof(value[0]) == "object") {
        td.appendChild(this.parseArr(value));
      } else if(!Array.isArray(value) && typeof(value) == "object"){
        td.appendChild(this.parseObj(value));
      } else {
        td.innerText = value;
      }
      tr.appendChild(td);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    return table;
  };

  createTableFun = (object: any) => {
    this.setState({
      blockTable: true
    });
    setTimeout(() => {
      const blockTable = document.querySelector('#blockTable') as HTMLDivElement | null;
      if(blockTable != null) {
        blockTable.innerHTML = "";
        blockTable.appendChild(this.parseObj(object));
      }
    }, 50);
  };

  parseDataFileFun = async () => {
    if (this.file != null){
      const fileUrl = URL.createObjectURL(this.file);
      const response = await fetch(fileUrl);
      const text = await response.text();
      if(text != null && text != ''){
        const data: {[key: string]: any} = JSON.parse(text);
        this.createTableFun(data);
      }
    } else {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    }
  };

  parseDataFieldFun = () => {
    if(this.dataField != ''){
      const data = JSON.parse(this.dataField);
      this.createTableFun(data);
    } else {
      this.alertNotify("bg-red-700", "The field is empty! Insert the data!");
    }
  };

  render(){
    return (
      <>
        <div className="flex flex-col gap-y-3">
          <div className="flex flex-row gap-x-2 text-2xl font-bold border-b-2 styleBorderSolid">
            <Link to="/"><ChevronBackCircleOutline cssClasses="styleIonIcon" /></Link>
            <span>Visualization data from JSON to Table</span>
          </div>

          <details className="styleDetails">
            <summary>
              <span className="text-xl font-bold">Select the JSON file with the data</span>
            </summary>
            
            <div className="flex flex-col gap-y-3">
              <input className="styleFileInput" type="file" onChange={(event: any) => {this.file = event.target.files[0]}} accept=".json" />
              <button className="styleBut w-max" onClick={() => {this.parseDataFileFun()}}>Create a table</button>
            </div>
          </details>

          <details className="styleDetails">
            <summary>
              <span className="text-xl font-bold">Insert JSON data</span>
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

export default JsonToTable;