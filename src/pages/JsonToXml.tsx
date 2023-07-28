import React from "react";

import { CloseCircleOutline } from "react-ionicons";

import { invoke } from "@tauri-apps/api/tauri";

class JsonToXml extends React.Component {
  file: any = null;
  dataField: string = "";
  dataXml: string = "";

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

  parseData(object: {[key: string]: any}, stroke: string = ''){
    var tempElement = '';
    Object.entries(object).forEach(([key, value]) => {
      if(Array.isArray(value)) {
        tempElement += `${this.parseData(value, key)}`;
      } else if(typeof value != 'string'){
        key = (isNaN(+key)) ? key : stroke;
        key = key.replace(" ", "");
        tempElement += `<${key}>${this.parseData(value, key)}</${key}>`;
      } else {
        key = key.replace(" ", "");
        tempElement += `<${key}>${value}</${key}>`;
      }
    });
    return tempElement;
  };

  convertDataFun = (dataJSON: {[key: string]: any}) => {
    this.dataXml = this.parseData(dataJSON);
    if (this.dataXml != '') {
      this.alertNotify("bg-green-700", "The data has been successfully converted!");
    } else {
      this.alertNotify("bg-red-700", "No data was received from the file!");
    }
  };

  convertDataFileFun = async () => {
    if(this.file != null){
      const fileUrl = URL.createObjectURL(this.file);
      const response = await fetch(fileUrl);
      const text = await response.text();
      if(text != null && text != ''){
        var dataJson = JSON.parse(text);
        this.convertDataFun(dataJson);
      }
    } else {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    }
  };

  convertDataFieldFun = () => {
    if(this.dataField != ''){
      var dataJson = JSON.parse(this.dataField);
      this.convertDataFun(dataJson);
    } else {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    }
  };

  saveDataFileFun = async () => {
    if(this.file != null || this.dataXml != ''){
      await invoke("json_to_xml", {"data": this.dataXml})
      .then((data: any) => {
        this.alertNotify("bg-green-700", `The data has been successfully saved to a file "${data}"!`);
      })
      .catch((err: any) => console.error(err));
    } else if(this.file == null){
      this.alertNotify("bg-red-700", "You have not selected a file!");
    } else if (this.dataXml == ''){
      this.alertNotify("bg-red-700", "No data was received from the file!");
    }
  };

  render(){
    return (
      <>
        <div className="flex flex-col gap-y-3">
          <span className="text-2xl font-bold border-b-2 styleBorderSolid">Converter JSON to XML</span>

          <details>
            <summary>
              <span className="text-xl font-bold">Select the JSON file with the data</span>
            </summary>
            
            <div className="flex flex-col gap-y-3">
              <input className="styleFileInput" type="file" onChange={(event: any) => {this.file = event.target.files[0]}} accept=".json" />
              <button className="styleBut w-max" onClick={() => {this.convertDataFileFun()}}>Convert data from a JSON file</button>
            </div>
          </details>

          <details>
            <summary>
              <span className="text-xl font-bold">Insert JSON data</span>
            </summary>

            <div className="flex flex-col gap-y-3">
              <textarea className="styleTextarea" name="field" onChange={(event: any) => {this.dataField = event.target.value}} rows={7}></textarea>
              <button className="styleBut w-max" onClick={() => {this.convertDataFieldFun()}}>Convert data from the field</button>
            </div>
          </details>

          <div className="flex flex-row gap-x-3">
            <button className="styleBut" onClick={() => {this.saveDataFileFun()}}>Save data to file XML</button>
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

export default JsonToXml;