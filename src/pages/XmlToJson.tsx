import React from "react";

import { CloseCircleOutline } from "react-ionicons";

import { invoke } from "@tauri-apps/api/tauri";

class XmlToJson extends React.Component {
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

  convertDataFileFun = async () => {
    if(this.file != null){
      const fileUrl = URL.createObjectURL(this.file);
      const response = await fetch(fileUrl);
      const text = await response.text();
      if(text != null && text != ''){
        var dataXml = text;
        this.convertDataFun(dataXml);
      }
    } else {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    }
  };

  convertDataFieldFun = () => {
    if(this.dataField != ''){
      var dataXml = this.dataField;
      this.convertDataFun(dataXml);
    } else {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    }
  };

  saveDataFileFun = async () => {
    if(this.file != null || Object.keys(this.dataJson).length != 0){
      await invoke("xml_to_json", {"data": JSON.stringify(this.dataJson)})
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

          <details>
            <summary>
              <span className="text-xl font-bold">Select the XML file with the data</span>
            </summary>
            
            <div className="flex flex-col gap-y-3">
              <input className="styleFileInput" type="file" onChange={(event: any) => {this.file = event.target.files[0]}} accept=".xml" />
              <button className="styleBut w-max" onClick={() => {this.convertDataFileFun()}}>Convert data from a XML file</button>
            </div>
          </details>

          <details>
            <summary>
              <span className="text-xl font-bold">Insert XML data</span>
            </summary>

            <div className="flex flex-col gap-y-3">
              <textarea className="styleTextarea" name="field" onChange={(event: any) => {this.dataField = event.target.value}} rows={7}></textarea>
              <button className="styleBut w-max" onClick={() => {this.convertDataFieldFun()}}>Convert data from the field</button>
            </div>
          </details>

          <div className="flex flex-row gap-x-3">
            <button className="styleBut" onClick={() => {this.saveDataFileFun()}}>Save data to file JSON</button>
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

export default XmlToJson;