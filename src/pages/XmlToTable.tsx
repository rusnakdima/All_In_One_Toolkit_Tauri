import React from "react";
import { Link } from "react-router-dom";
import { ChevronBackCircleOutline } from "react-ionicons";

import WindNotify from "./WindNotify";

interface TableData {
  thead: string[];
  tbody: (string | TableData)[][];
}

interface TableProps {
  data: TableData;
}

const RecursiveTable: React.FC<TableProps> = ({ data }) => {
  return (
    <table className="border styleBorderSolid">
      <thead>
        <tr>
          {data.thead.map((header, index) => (
            <th className='styleTD' key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.tbody.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {
              row.map((cellData, cellIndex) => (
                <td className='styleTD' key={cellIndex}>
                  {typeof cellData === 'string' ? (
                    cellData
                  ) : (
                    <RecursiveTable data={cellData} />
                  )}
                </td>
              ))
            }
          </tr>
        ))}
      </tbody>
    </table>
  );
};

class XmlToTable extends React.Component<{numWind: number, onChangeData: any}> {
  constructor(props: any) {
    super(props);
  }

  childRef: any = React.createRef();

  file: any = null;
  dataField: string = "";

  state = {
    blockTable: false,
    dataTable: {thead: [], tbody: []},
  }

  changeNumWind(numWind: number) {
    this.props.onChangeData(Number(numWind));
  }

  alertNotify(color: string, title: string) {
    this.childRef.current.alertNotify(color, title);
  }

  parseData(xmlNodes: Array<any>) {
    let table: TableData = {thead: ["Key", "Value"], tbody: []};
    xmlNodes.forEach((elem: any) => {
      let tempRow: (string | TableData)[] = [];
      tempRow.push(elem.nodeName);
      if ([...elem.children].length > 0) {
        tempRow.push(this.parseData([...elem.children]));
      } else {
        tempRow.push(elem.textContent.toString());
      }
      table.tbody.push(tempRow);
    });
    return table;
  }
  
  createTableFun(dataXML: any) {
    this.setState({
      blockTable: true
    });
    setTimeout(() => {
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(dataXML, 'text/xml');
      this.setState({
        dataTable: this.parseData([...xmlDoc.children])
      });
    }, 50);
  }

  async parseDataFileFun() {
    if (this.file != null) {
      const fileUrl = URL.createObjectURL(this.file);
      const response = await fetch(fileUrl);
      const text = await response.text();
      if (text != null && text != '') {
        const dataXml = text;
        this.createTableFun(dataXml);
      } else {
        this.alertNotify("bg-red-700", "The file is empty!");
      }
    } else {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    }
  }

  parseDataFieldFun() {
    if (this.dataField != '') {
      const dataXml = this.dataField;
      this.createTableFun(dataXml);
    } else {
      this.alertNotify("bg-red-700", "The field is empty! Insert the data!");
    }
  }

  render() {
    return (
      <>
        <div className={`flex flex-col gap-y-5 ${(this.props.numWind > 2) ? 'w-full lg:w-1/3' : (this.props.numWind > 1) ? 'w-full lg:w-1/2' : 'w-full'}`}>
          <div className="flex flex-row justify-between items-center border-b-2 styleBorderSolid pb-2">
            <div className="flex flex-row gap-x-2 text-2xl font-bold">
              <Link to="/"><ChevronBackCircleOutline cssClasses="styleIonIcon" /></Link>
              <span>Visualization data from XML to Table</span>
            </div>
            <select className="styleSelect !w-min" onChange={(event: any) => {this.changeNumWind(event.target.value)}} value={this.props.numWind}>
              <option value={1}>1 window</option>
              <option value={2}>2 windows</option>
              <option value={3}>3 windows</option>
            </select>
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

          {this.state.blockTable && <div className="flex flex-col">
            <RecursiveTable data={this.state.dataTable} />
          </div>}
        </div>

        <WindNotify ref={this.childRef} />
      </>
    );
  };
};

export default XmlToTable;