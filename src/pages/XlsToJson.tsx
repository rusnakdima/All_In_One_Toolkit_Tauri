import React from "react";

import * as XLSX from "xlsx";

import { CloseCircleOutline } from "react-ionicons";

import { invoke } from "@tauri-apps/api/tauri";

class XlsToJson extends React.Component {
  file: any = null;
  dataField: string = "";
  dataJson: {[key: string]: any} = {};

  state = {
    windNotify: false,
    notText: ""
  };

  alertNotify(color: string, title: string) {
    this.setState({
      windNotify: true
    })
    setTimeout(() => {
      let notify = document.querySelector("#windNotify") as HTMLDivElement | null;
      if (notify != null) notify.classList.add(color);
      this.setState({
        notText: title
      })
      
      let timeNotify = document.querySelector("#timeNotify") as HTMLDivElement | null;
      if (timeNotify != null) {
        if(timeNotify.style.width != '') if(+timeNotify.style.width.split('').slice(0, -1).join('') > 0) return;
        let width = 100;
        timeNotify.style.width = `${width}%`;
    
        const interval = setInterval(() => {
          width -= 0.3;
          if (width < 0) {
            width = 0;
            clearInterval(interval);
            this.setState({
              windNotify: false
            })
          }
          if (timeNotify != null) timeNotify.style.width = `${width}%`;
        }, 10);
      }
    }, 10);
  };

  convertDataFun = (data: any[]) => {
    this.dataJson = {"root": []};
    let strokeF = data[0];
    data.splice(0, 1);
    data.forEach((element) => {
      let tempObj: {[key: string]: any} = {};
      element.forEach((elem: any, index: number) => tempObj[strokeF[index]] = elem);
      this.dataJson["root"].push(tempObj);
    });

    if (Object.keys(this.dataJson).length > 0) {
      this.alertNotify("bg-green-700", "The data has been successfully converted!");
    } else {
      this.alertNotify("bg-red-700", "No data was received from the file!");
    }
  };

  parseDataFileFun = async () => {
    if(this.file != null){
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const text = (e.target.result);
        const workbook = XLSX.read(text, {type:'binary'});
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        this.convertDataFun(data);
      }
      reader.readAsBinaryString(this.file)
    } else {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    }
  };

  parseDataFieldFun = () => {
    if(this.dataField != ''){
      const data = this.dataField.split("\n").map((elem) => elem.split("\t"));
      this.convertDataFun(data);
    } else {
      this.alertNotify("bg-red-700", "The field is empty! Insert the data!");
    }
  };

  saveDataFileFun = async () => {
    if(this.file != null || Object.keys(this.dataJson).length > 0){
      await invoke("xls_to_json", {"data": JSON.stringify(this.dataJson)})
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
        <div className="flex flex-col">
          <span className="text-2xl font-bold border-b-2 styleBorderSolid">Converter XLS to JSON</span>

          <details className="styleDetails">
            <summary>
              <span className="text-xl font-bold">Select a tabular document with data</span>
            </summary>

            <div className="flex flex-col gap-y-3">
              <input className="styleFileInput" type="file" onChange={(event: any) => {this.file = event.target.files[0]}} accept=".xls, .xlsx, .xlsm" />
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
        </div>

        {this.state.windNotify && <div id="windNotify" className="styleWindNotify">
          <div className="flex flex-row p-3">
            <div className="flex flex-col">
              <span className="text-4xl">Notification</span>
              <span>{this.state.notText}</span>
            </div>
            <button onClick={() => {this.setState({windNotify: false})}}>
              <CloseCircleOutline cssClasses={"!text-white !w-10 !h-10"} />
            </button>
          </div>
          <div className="flex flex-col mb-1 bg-white w-full h-1" id="timeNotify"></div>
        </div>}
      </>
    );
  };
};

export default XlsToJson;