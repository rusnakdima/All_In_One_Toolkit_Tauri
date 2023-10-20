import React from "react";
import { Link } from "react-router-dom";
import { ChevronBackCircleOutline } from "react-ionicons";

import WindNotify from "./WindNotify";

class CsvToTable extends React.Component<{numWind: number, onChangeData: any}> {
  constructor(props: any){
    super(props);
  }

  childRef: any = React.createRef();

  file: any = null;
  dataField: string = "";

  state = {
    blockTable: false,
    dataTable: [],
  };

  changeNumWind = (numWind: number) => {
    this.props.onChangeData(Number(numWind));
  }

  alertNotify(color: string, title: string) {
    this.childRef.current.alertNotify(color, title);
  };

  createTableFun = (data: any) => {
    this.setState({
      blockTable: true
    });
    setTimeout(() => {
      data.splice(-1, 1);
      let tempBody: Array<any[]> = [];
      data.forEach((row: any) => {
        let tempRow: Array<any> = [];
        row.forEach((cell: any) => {
          tempRow.push(cell);
        });
        tempBody.push(tempRow);
      });
      this.setState({
        dataTable: tempBody,
      })
    }, 50);
  };

  parseDataFileFun = async () => {
    if(this.file != null){
      const fileUrl = URL.createObjectURL(this.file);
      const response = await fetch(fileUrl);
      const text = await response.text();
      if (text != null && text != '') {
        const data: any[] = text.split("\r\n").map((line: any) => line.split(","));
        this.createTableFun(data);
      } else {
        this.alertNotify("bg-red-700", "The file is empty!");
      }
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
        <div className={`flex flex-col gap-y-5 ${(this.props.numWind > 2) ? 'w-1/3' : (this.props.numWind > 1) ? 'w-1/2' : 'w-full'}`}>
          <div className="flex flex-row justify-between items-center border-b-2 styleBorderSolid pb-2">
            <div className="flex flex-row gap-x-2 text-2xl font-bold">
              <Link to="/"><ChevronBackCircleOutline cssClasses="styleIonIcon" /></Link>
              <span>Visualization data from CSV to Table</span>
            </div>
            <select className="styleSelect !w-min" onChange={(event: any) => {this.changeNumWind(event.target.value)}} value={this.props.numWind}>
              <option value={1}>1 window</option>
              <option value={2}>2 windows</option>
              <option value={3}>3 windows</option>
            </select>
          </div>

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

          {this.state.blockTable && <div className="flex flex-col">
          <table className="border styleBorderSolid">
            {this.state.dataTable.map((row: any, index: number) => {
                return <tr key={index}>
                  {row.map((cell: any, index1: number) => {
                    return <td className='styleTD' key={index1}>{cell}</td>
                  })}
                </tr>
              })}
          </table>
          </div>}
        </div>

        <WindNotify ref={this.childRef} />
      </>
    );
  };
};

export default CsvToTable;