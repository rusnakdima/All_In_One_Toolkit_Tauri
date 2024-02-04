import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Link } from "react-router-dom";
import { listen } from "@tauri-apps/api/event";

import { ChevronBackCircleOutline } from "react-ionicons";

import WindNotify from "./WindNotify";

class XlsToJson extends React.Component<{numWind: number, onChangeData: any}> {
  constructor(props: any) {
    super(props);
  }

  childRef: any = React.createRef();

  dataArr: Array<any> = [];
  dataField: string = "";
  dataJson: {[key: string]: any} = {};
  
  state = {
    fileName: '',
    pathNewFile: ""
  }

  componentDidMount(): void {
    this.getDataFileXls();
  }

  changeNumWind(numWind: number) {
    this.props.onChangeData(Number(numWind));
  }

  alertNotify(color: string, title: string) {
    this.childRef.current.alertNotify(color, title);
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
      this.dataJson["root"]["array"].push(tempObj);
    });
  }

  convertDataFun(dataArr: Array<any>) {
    this.parseData(dataArr);

    if (Object.keys(this.dataJson).length > 0) {
      this.alertNotify("bg-green-700", "The data has been successfully converted!");
    } else {
      this.alertNotify("bg-red-700", "No data was received from the file!");
    }
  }

  async getDataFileXls() {
    await listen('data_xls', (event: any) => {
      this.setState({
        fileName: event.payload['file_path'].split(/[\/\\]/g).pop()
      })
      this.dataArr = JSON.parse(event.payload['data_xls']);
      this.alertNotify("bg-green-700", 'The data from the file has been successfully received!');
    });
  }

  async openXlsFileFun(e: any) {
    e.preventDefault();
    await invoke("open_xls")
    .then(() => {})
    .catch((err: any) => {
      console.error(err);
      this.alertNotify("bg-red-700", 'The file cannot be read!');
    });
  }

  async parseDataFileFun() {
    if (this.state.fileName != '' && this.dataArr.length > 0) {
      this.convertDataFun(this.dataArr);
    } else {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    }
  }

  parseDataFieldFun() {
    if(this.dataField != '') {
      const dataArr = this.dataField.split("\n").map((elem) => elem.split("\t"));
      this.convertDataFun(dataArr);
    } else {
      this.alertNotify("bg-red-700", "The field is empty! Insert the data!");
    }
  }

  async saveDataFileFun() {
    if(this.state.fileName != '' || Object.keys(this.dataJson).length > 0) {
      const nameNewFile = (this.state.fileName != '') ? /^(.+)\..+$/.exec(this.state.fileName)![1] : 'xls_to_json';
      await invoke("xls_to_json", {"name": nameNewFile, "data": JSON.stringify(this.dataJson)})
      .then((data: any) => {
        this.setState({
          pathNewFile: data
        });
        this.alertNotify("bg-green-700", `The data has been successfully saved to a file "${data}"!`);
      })
      .catch((err: any) => console.error(err));
    } else if(this.state.fileName == '') {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    } else if (Object.keys(this.dataJson).length == 0) {
      this.alertNotify("bg-red-700", "No data was received from the file!");
    }
  }

  async openFileFun() {
    if (this.state.pathNewFile != '') {
      await invoke("open_file", {"path": this.state.pathNewFile})
      .then(() => {
        this.alertNotify("bg-green-700", "Wait a bit until the program starts to read this file format!");
      })
      .catch((err: any) => console.error(err));
    } else {
      this.alertNotify("bg-red-700", "You didn't save the file to open it!");
    }
  }

  render() {
    return (
      <>
        <div className={`flex flex-col gap-y-5 ${(this.props.numWind > 2) ? 'w-full lg:w-1/3' : (this.props.numWind > 1) ? 'w-full lg:w-1/2' : 'w-full'}`}>
          <div className="flex flex-row justify-between items-center border-b-2 styleBorderSolid pb-2">
            <div className="flex flex-row gap-x-2 text-2xl font-bold">
              <Link to="/"><ChevronBackCircleOutline cssClasses="styleIonIcon" /></Link>
              <span>Converter XLS to JSON</span>
            </div>
            <select className="styleSelect !w-min" onChange={(event: any) => {this.changeNumWind(event.target.value)}} value={this.props.numWind}>
              <option value={1}>1 window</option>
              <option value={2}>2 windows</option>
              <option value={3}>3 windows</option>
            </select>
          </div>

          <details className="styleDetails">
            <summary>
              <span className="text-xl font-bold">Select a tabular document with data</span>
            </summary>

            <div className="flex flex-col gap-y-3">
              <div className="flex flex-row gap-x-2 items-center">
                <button className="styleBut w-max" onClick={(e: any) => {this.openXlsFileFun(e)}}>Choose file</button>
                {this.state.fileName != '' &&
                  <span className="text-xl">{this.state.fileName}</span>
                }
                {this.state.fileName == '' &&
                  <span className="text-xl">No file chosen</span>
                }
              </div>
              <button className="styleBut w-max" onClick={() => {this.parseDataFileFun()}}>Convert a data</button>
            </div>
          </details>

          <details className="styleDetails">
            <summary>
              <span className="text-xl font-bold">Insert data from a table (copy a table from any source)</span>
            </summary>

            <div className="flex flex-col gap-y-3">
              <textarea className="styleTextarea" name="field" onChange={(event: any) => {this.dataField = event.target.value}} rows={7}></textarea>
              <button className="styleBut w-max" onClick={() => {this.parseDataFieldFun()}}>Convert a data</button>
            </div>
          </details>
          
          <div className="flex flex-row gap-x-3">
            <button className="styleBut" onClick={() => {this.saveDataFileFun()}}>Save a data</button>
          </div>

          {this.state.pathNewFile != '' && <div className="flex flex-row gap-x-3">
            <button className="styleBut" onClick={() => {this.openFileFun()}}>Open the last saved file</button>
          </div>}
        </div>

        <WindNotify ref={this.childRef} />
      </>
    );
  };
};

export default XlsToJson;