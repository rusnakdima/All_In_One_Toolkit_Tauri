import React from "react";
import { Link } from "react-router-dom";
import { ChevronBackCircleOutline } from "react-ionicons";

import WindNotify from "./WindNotify";

class XmlToTable extends React.Component {
  childRef: any = React.createRef();

  file: any = null;
  dataField: string = "";

  state = {
    blockTable: false,
  };

  alertNotify(color: string, title: string) {
    this.childRef.current.alertNotify(color, title);
  };

  parseData = (xmlNodes: Array<any>) => {
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
    xmlNodes.forEach((elem: any) => {
      let tr = document.createElement('tr');
      let td = document.createElement('td');
      td.innerText = elem.nodeName;
      td.classList.add("styleTD");
      tr.appendChild(td);
      td = document.createElement('td');
      td.classList.add("styleTD");
      if ([...elem.children].length > 0) {
        td.appendChild(this.parseData([...elem.children]));
      } else {
        td.innerText = elem.textContent;
      }
      tr.appendChild(td);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    return table;
  }
  
  createTableFun = (dataXML: any) => {
    this.setState({
      blockTable: true
    });
    setTimeout(() => {
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(dataXML, 'text/xml');
      const blockTable = document.querySelector('#blockTable') as HTMLDivElement | null;
      if(blockTable != null) {
        blockTable.innerHTML = "";
        blockTable.appendChild(this.parseData([...xmlDoc.children]));
      }
    }, 50);
  };

  parseDataFileFun = async () => {
    if (this.file != null){
      const fileUrl = URL.createObjectURL(this.file);
      const response = await fetch(fileUrl);
      const text = await response.text();
      if(text != null && text != ''){
        const dataXml = text;
        this.createTableFun(dataXml);
      } else {
        this.alertNotify("bg-red-700", "The file is empty!");
      }
    } else {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    }
  };

  parseDataFieldFun = () => {
    if(this.dataField != ''){
      const dataXml = this.dataField;
      this.createTableFun(dataXml);
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
            <span>Visualization data from XML to Table</span>
          </div>

          <details className="styleDetails">
            <summary>
              <span className="text-xl font-bold">Select the XML file with the data</span>
            </summary>
            
            <div className="flex flex-col gap-y-3">
              <input className="styleFileInput" type="file" onChange={(event: any) => {this.file = event.target.files[0]}} accept=".xml" />
              <button className="styleBut w-max" onClick={() => {this.parseDataFileFun()}}>Create a table</button>
            </div>
          </details>

          <details className="styleDetails">
            <summary>
              <span className="text-xl font-bold">Insert XML data</span>
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

export default XmlToTable;