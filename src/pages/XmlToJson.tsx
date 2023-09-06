import React from "react";

import WindNotify from "./WindNotify";

import { invoke } from "@tauri-apps/api/tauri";

class XmlToJson extends React.Component {
  childRef: any = React.createRef();

  file: any = null;
  dataField: string = "";
  dataJson: {[key: string]: any} = {};

  alertNotify(color: string, title: string) {
    this.childRef.current.alertNotify(color, title);
  };

  parseData(array: any[]){
    let tempObj: {[key: string]: any} = {};
    array.forEach((elem: any) => {
      if([...elem.children].length > 0){
        let rez = this.parseData([...elem.children]);
        if(tempObj[elem.nodeName] != undefined) {
          tempObj[elem.nodeName].length == undefined ? tempObj[elem.nodeName] = [tempObj[elem.nodeName], rez] : tempObj[elem.nodeName].push(rez);
        } else tempObj[elem.nodeName] = rez;
      }
      else tempObj[elem.nodeName] = elem.textContent;
    });
    return tempObj;
  }

  convertDataFun = (dataXML: string) => {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(dataXML, 'text/xml');
    this.dataJson = this.parseData([...xmlDoc.children]);

    if (Object.keys(this.dataJson).length > 0) {
      this.alertNotify("bg-green-700", "The data has been successfully converted!");
    } else {
      this.alertNotify("bg-red-700", "No data was received from the file!");
    }
  };

  parseDataFileFun = async () => {
    if(this.file != null){
      const fileUrl = URL.createObjectURL(this.file);
      const response = await fetch(fileUrl);
      const text = await response.text();
      if(text != null && text != ''){
        const dataXml = text;
        this.convertDataFun(dataXml);
      }
    } else {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    }
  };

  parseDataFieldFun = () => {
    if(this.dataField != ''){
      const dataXml = this.dataField;
      this.convertDataFun(dataXml);
    } else {
      this.alertNotify("bg-red-700", "The field is empty! Insert the data!");
    }
  };

  saveDataFileFun = async () => {
    if(this.file != null || Object.keys(this.dataJson).length != 0){
      await invoke("xml_to_json", {"name": (this.file) ? /^(.+)\..+$/.exec(this.file["name"])![1] : 'xml_to_json', "data": JSON.stringify(this.dataJson)})
      .then((data: any) => {
        this.alertNotify("bg-green-700", `The data has been successfully saved to a file "${data}"!`);
      })
      .catch((err: any) => console.error(err));
    } else if(this.file == null){
      this.alertNotify("bg-red-700", "You have not selected a file!");
    } else if (Object.keys(this.dataJson).length == 0){
      this.alertNotify("bg-red-700", "No data was received from the file!");
    }
  };

  render(){
    return (
      <>
        <div className="flex flex-col gap-y-3">
          <span className="text-2xl font-bold border-b-2 styleBorderSolid">Converter XML to JSON</span>

          <details className="styleDetails">
            <summary>
              <span className="text-xl font-bold">Select the XML file with the data</span>
            </summary>
            
            <div className="flex flex-col gap-y-3">
              <input className="styleFileInput" type="file" onChange={(event: any) => {this.file = event.target.files[0]}} accept=".xml" />
              <button className="styleBut w-max" onClick={() => {this.parseDataFileFun()}}>Convert a table</button>
            </div>
          </details>

          <details className="styleDetails">
            <summary>
              <span className="text-xl font-bold">Insert XML data</span>
            </summary>

            <div className="flex flex-col gap-y-3">
              <textarea className="styleTextarea" name="field" onChange={(event: any) => {this.dataField = event.target.value}} rows={7}></textarea>
              <button className="styleBut w-max" onClick={() => {this.parseDataFieldFun()}}>Convert a table</button>
            </div>
          </details>

          <div className="flex flex-row gap-x-3">
            <button className="styleBut" onClick={() => {this.saveDataFileFun()}}>Save a table</button>
          </div>
        </div>

        <WindNotify ref={this.childRef} />
      </>
    );
  };
};

export default XmlToJson;