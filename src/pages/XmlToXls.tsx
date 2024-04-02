import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Link } from "react-router-dom";
import { ChevronBackCircleOutline } from "react-ionicons";

import WindNotify from "./WindNotify";

class XmlToXls extends React.Component<{numWind: number, onChangeData: any}> {
  constructor(props: any) {
    super(props);
  }

  childRef: any = React.createRef();

  file: any = null;
  dataField: string = "";
  dataXls: Array<any> = [];
  
  state = {
    pathNewFile: ""
  }

  changeNumWind(numWind: number) {
    this.props.onChangeData(Number(numWind));
  }

  alertNotify(color: string, title: string) {
    this.childRef.current.alertNotify(color, title);
  }

  parseArr(arr: Array<any>, startPos: number) {
    let table: Array<Array<string>> = [];
    const tempHead: Array<any> = [];
    arr.forEach((elem: any) => {
      ; [...elem.children].forEach((key: any) => {
        if (!tempHead.includes(key.nodeName)) {
          tempHead.push(key.nodeName);
        }
      });
    });
    table.push(tempHead);

    arr.forEach((elem: any) => {
      console.log(elem)
      let tempRow: Array<string> = [];
      tempRow.push(...Array(startPos).fill(''));
      tempHead.forEach((key: any, headIndex: number) => {
        const element = [...elem.children].find((child) => child.nodeName == key);
        console.log(element)
        if (!element && element == null) {
          tempRow.push("", "");
        } else if ([...element.children].length > 0) {
          console.log(element)
          if ([...element.children].every((value: any) => value.nodeName == element.children[0].nodeName)) {
            // tempRow.push(this.parseArr([...element.children]));this.parseArr([...elem.children], startPos + 1).forEach((row: Array<string>, iRow: number) => {
            this.parseArr([...element.children], startPos + 1).forEach((row: Array<string>, iRow: number) => {
              if (iRow == 0) {
                tempRow.push(...row);
                table.push(tempRow);
              } else {
                table.push(row);
              }
            });
          } else {
            this.parseData([...element.children]).forEach((row: Array<string>, iRow: number) => {
              if (iRow == 0) {
                tempRow.push(...row);
                table.push(tempRow);
              } else {
                table.push([...Array(startPos + headIndex).fill(''), ...row]);
              }
            });
          }
        } else {
          tempRow.push(element.textContent.toString());
        }
      });
      table.push(tempRow);
    });
    return table;
  }

  parseData(xmlNodes: Array<any>, startPos: number = 0) {
    let table: Array<Array<string>> = [];
    let tempHead: Array<string> = [];
    tempHead.push(...[...Array(startPos).fill(''), 'Key', 'Value']);
    table.push(tempHead);
    xmlNodes.forEach((elem: any) => {
      let tempRow: Array<string> = [];
      tempRow.push(...[...Array(startPos).fill(''), elem.nodeName]);
      if ([...elem.children].length > 0) {
        if ([...elem.children].every((value: any) => value.nodeName == elem.children[0].nodeName)) {
          console.log(elem)
          console.log(this.parseArr([...elem.children], startPos + 1))
          this.parseArr([...elem.children], startPos + 1).forEach((row: Array<string>, iRow: number) => {
            if (iRow == 0) {
              tempRow.push(...row);
              table.push(tempRow);
            } else {
              table.push(row);
            }
          });
        } else {
          this.parseData([...elem.children], startPos + 1).forEach((row: Array<string>, iRow: number) => {
            if (iRow == 0) {
              tempRow.push(...row.slice(startPos + 1));
              table.push(tempRow);
            } else {
              table.push(row);
            }
          });
        }
      } else {
        tempRow.push(elem.textContent.toString());
        table.push(tempRow);
      }
    });
    return table;
  }

  convertDataFun(dataXml: string) {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(dataXml, 'text/xml');
    this.dataXls = this.parseData([...xmlDoc.children]);
    console.log(this.dataXls)

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
        const dataXml = text;
        this.convertDataFun(dataXml);
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
      this.convertDataFun(dataXml);
    } else {
      this.alertNotify("bg-red-700", "The field is empty! Insert the data!");
    }
  }

  async saveDataFileFun() {
    if (this.file != null || this.dataXls.length > 0) {
      const nameNewFile = (this.file) ? /^(.+)\..+$/.exec(this.file["name"])![1] : 'xml_to_xls';
      await invoke("xml_to_xls", {"name": nameNewFile, "data": this.dataXls})
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
              <span>Converter XML to XLS</span>
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
              <button className="styleBut w-max" onClick={() => {this.parseDataFileFun()}}>Convert a data</button>
            </div>
          </details>

          <details className="styleDetails">
            <summary>
              <span className="text-xl font-bold">Insert XML data</span>
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

export default XmlToXls;