import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Link } from "react-router-dom";
import { ChevronBackCircleOutline } from "react-ionicons";

import WindNotify from "./WindNotify";

class JsonToXls extends React.Component {
  childRef: any = React.createRef();

  file: any = null;
  dataField: string = "";
  dataXls: any[] = [];

  alertNotify(color: string, title: string) {
    this.childRef.current.alertNotify(color, title);
  };

  convertDataFun = (data: {[key: string]: any}) => {
    this.dataXls = data[Object.keys(data)[0]].map((elem: {[key: string]: any}) => Object.values(elem).map((val: any) => {return String(val)}));
    this.dataXls.unshift(Object.keys(data["root"][0]));

    if (Array.isArray(this.dataXls)) {
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
        const dataJson = JSON.parse(text);
        this.convertDataFun(dataJson);
      }
    } else {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    }
  };

  parseDataFieldFun = () => {
    if(this.dataField != ''){
      const data = JSON.parse(this.dataField);
      this.convertDataFun(data);
    } else {
      this.alertNotify("bg-red-700", "The field is empty! Insert the data!");
    }
  };

  saveDataFileFun = async () => {
    if(this.file != null || this.dataXls.length > 0){
      await invoke("json_to_xls", {"name": (this.file) ? /^(.+)\..+$/.exec(this.file["name"])![1] : 'json_to_xls', "data": JSON.stringify(this.dataXls)})
      .then((data: any) => {
        this.alertNotify("bg-green-700", `The data has been successfully saved to a file "${data}"!`);
      })
      .catch((err: any) => console.error(err));
    } else if(this.file == null){
      this.alertNotify("bg-red-700", "You have not selected a file!");
    } else if (this.dataXls.length == 0){
      this.alertNotify("bg-red-700", "No data was received from the file!");
    }
  };

  render(){
    return (
      <>
        <div className="flex flex-col">
          <div className="flex flex-row gap-x-2 text-2xl font-bold border-b-2 styleBorderSolid">
            <Link to="/"><ChevronBackCircleOutline cssClasses="styleIonIcon" /></Link>
            <span>Converter JSON to XLS</span>
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
        </div>

        <WindNotify ref={this.childRef} />
      </>
    );
  };
};

export default JsonToXls;