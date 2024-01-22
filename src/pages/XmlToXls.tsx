import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Link } from "react-router-dom";
import { ChevronBackCircleOutline } from "react-ionicons";

import WindNotify from "./WindNotify";

class XmlToXls extends React.Component<{numWind: number, onChangeData: any}> {
  constructor(props: any){
    super(props);
  }

  childRef: any = React.createRef();

  file: any = null;
  dataField: string = "";
  dataXls: Array<any> = [];

  changeNumWind(numWind: number) {
    this.props.onChangeData(Number(numWind));
  }

  alertNotify(color: string, title: string) {
    this.childRef.current.alertNotify(color, title);
  }

  parseData(xmlNodes: Array<any>) {
    // Object.keys(obj).forEach((key: string) => {
    //   if (Array.isArray(obj[key])) {
    //     this.dataXls.push(Object.keys(obj[key][0]));
    //     obj[key].forEach((item: string) => {
    //       this.dataXls.push(Object.values(item));
    //     });
    //   } else {
    //     this.dataXls.push([key]);
    //     this.parseData(obj[key]);
    //   }
    // });
    console.log(xmlNodes)
    console.log(this.parseData([...xmlNodes[0].children]));
  }

  convertDataFun(dataXml: string) {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(dataXml, 'text/xml');
    console.log(this.parseData([...xmlDoc.children]))
    // this.dataXls = data[Object.keys(data)[0]].map((elem: {[key: string]: any}) => Object.values(elem).map((val: any) => {return String(val)}));
    // this.dataXls.unshift(Object.keys(data["root"][0]));

    if (Array.isArray(this.dataXls)) {
      this.alertNotify("bg-green-700", "The data has been successfully converted!");
    } else {
      this.alertNotify("bg-red-700", "No data was received from the file!");
    }
  }

  async parseDataFileFun() {
    if(this.file != null){
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
    if(this.dataField != ''){
      const dataXml = this.dataField;
      this.convertDataFun(dataXml);
    } else {
      this.alertNotify("bg-red-700", "The field is empty! Insert the data!");
    }
  }

  async saveDataFileFun() {
    if(this.file != null || this.dataXls.length > 0){
      await invoke("xml_to_xls", {"name": (this.file) ? /^(.+)\..+$/.exec(this.file["name"])![1] : 'xml_to_xls', "data": JSON.stringify(this.dataXls)})
      .then((data: any) => {
        this.alertNotify("bg-green-700", `The data has been successfully saved to a file "${data}"!`);
      })
      .catch((err: any) => console.error(err));
    } else if(this.file == null){
      this.alertNotify("bg-red-700", "You have not selected a file!");
    } else if (this.dataXls.length == 0){
      this.alertNotify("bg-red-700", "No data was received from the file!");
    }
  }

  render() {
    return (
      <>
        <div className={`flex flex-col gap-y-5 ${(this.props.numWind > 2) ? 'w-1/3' : (this.props.numWind > 1) ? 'w-1/2' : 'w-full'}`}>
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
        </div>

        <WindNotify ref={this.childRef} />
      </>
    );
  };
};

export default XmlToXls;