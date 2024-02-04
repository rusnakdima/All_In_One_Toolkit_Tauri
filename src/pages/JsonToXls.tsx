import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Link } from "react-router-dom";
import { ChevronBackCircleOutline } from "react-ionicons";

import WindNotify from "./WindNotify";

class JsonToXls extends React.Component<{numWind: number, onChangeData: any}> {
  constructor(props: any) {
    super(props);
  }

  childRef: any = React.createRef();

  file: any = null;
  dataField: string = "";
  dataXls: Array<Array<string>> = [];
  
  state = {
    pathNewFile: ""
  }

  changeNumWind(numWind: number) {
    this.props.onChangeData(Number(numWind));
  }

  alertNotify(color: string, title: string) {
    this.childRef.current.alertNotify(color, title);
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
          tempRow.push(elem[key]);
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

  convertDataFun(dataJson: {[key: string]: any}) {
    this.dataXls = this.parseObj(dataJson);

    if (Array.isArray(this.dataXls)) {
      this.alertNotify("bg-green-700", "The data has been successfully converted!");
    } else {
      this.alertNotify("bg-red-700", "No data was received from the file!");
    }
  }

  async parseDataFileFun() {
    if (this.file != null) {
      const fileUrl = URL.createObjectURL(this.file);
      const response = await fetch(fileUrl);
      const text = await response.text();
      if (text != null && text != '') {
        const dataJson = JSON.parse(text);
        this.convertDataFun(dataJson);
      } else {
        this.alertNotify("bg-red-700", "The file is empty!");
      }
    } else {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    }
  }

  parseDataFieldFun() {
    if (this.dataField != '') {
      const dataJson = JSON.parse(this.dataField);
      this.convertDataFun(dataJson);
    } else {
      this.alertNotify("bg-red-700", "The field is empty! Insert the data!");
    }
  }

  async saveDataFileFun() {
    if (this.file != null || this.dataXls.length > 0) {
      const nameNewFile = (this.file) ? /^(.+)\..+$/.exec(this.file["name"])![1] : 'json_to_xls';
      await invoke("json_to_xls", {"name": nameNewFile, "data": JSON.stringify(this.dataXls)})
      .then((data: any) => {
        this.setState({
          pathNewFile: data
        });
        this.alertNotify("bg-green-700", `The data has been successfully saved to a file "${data}"!`);
      })
      .catch((err: any) => console.error(err));
    } else if (this.file == null) {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    } else if (this.dataXls.length == 0) {
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
              <span>Converter JSON to XLS</span>
            </div>
            <select className="styleSelect !w-min" onChange={(event: any) => {this.changeNumWind(event.target.value)}} value={this.props.numWind}>
              <option value={1}>1 window</option>
              <option value={2}>2 windows</option>
              <option value={3}>3 windows</option>
            </select>
          </div>

          <details className="styleDetails">
            <summary>
              <span className="text-xl font-bold">Select the JSON file with the data</span>
            </summary>

            <div className="flex flex-col gap-y-3">
              <input className="styleFileInput" type="file" onChange={(event: any) => {this.file = event.target.files[0]}} accept=".json" />
              <button className="styleBut w-max" onClick={() => {this.parseDataFileFun()}}>Convert a data</button>
            </div>
          </details>

          <details className="styleDetails">
            <summary>
              <span className="text-xl font-bold">Insert JSON data</span>
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

export default JsonToXls;