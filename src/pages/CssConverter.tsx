import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Link } from "react-router-dom";
import { ChevronBackCircleOutline } from "react-ionicons";

import WindNotify from "./WindNotify";

class CssConverter extends React.Component<{numWind: number, onChangeData: any}> {
  constructor(props: any) {
    super(props);
  }

  childRef: any = React.createRef();

  file: any = null;

  typeStyle: string = "";
  dataField: string = "";

  dataArr: Array<any> = [];

  state = {
    blockTable: false,
    dataTable: {"thead": [], "tbody": []},
  };

  changeNumWind(numWind: number) {
    this.props.onChangeData(Number(numWind));
  }

  componentDidMount(): void {
    this.getDataFile();
  }

  alertNotify(color: string, title: string) {
    this.childRef.current.alertNotify(color, title);
  }

  async getDataFile() {
    await invoke("get_json")
    .then((json: any) => {
      if (json && json != '') this.dataArr = JSON.parse(json)["root"];
    })
    .catch((err: any) => console.error(err));
    // if (this.file != null) {
    //   const fileUrl = URL.createObjectURL(this.file);
    //   const response = await fetch(fileUrl);
    //   const text = await response.text();
    //   if (text != null && text != '') {
    //     const dataJson = JSON.parse(text);
    //     this.dataArr = dataJson["root"];
    //   }
    //   this.alertNotify("bg-green-700", "Data has been successfully extracted!");
    // } else {
    //   this.alertNotify("bg-red-700", "You have not selected a file!");
    // }
  }

  searchElemData(item: string, style: string) {
    let textElem = '';
    try {
      let tempObj: {[key: string]: any} = { "color": "text", "background-color": "bg", "border-color": "border", "border-top-color": "border-t", "border-bottom-color": "border-b", "border-left-color": "border-l", "border-right-color": "border-r", "border-inline-start-color": "border-s", "border-inline-end-color": "border-e" };
      let regCSS = /([\w\-]*):\s*([\s\w\d\%\,\(\)\#\-]*);/;
      let propCSS = regCSS.exec(item);
      if (propCSS && propCSS![2].indexOf("rgb") >= 0) {
        for(let i = 0; i < 3; i++) {
          propCSS[2] = propCSS![2].replace(/\,\s*/, " ");
          item = item.replace(/\,\s*/, " ");
        }
      }
      let propTailwind = /^(\w+)(?:-([\w\/\[\]]+))?(?:-([\w\/\[\]]+))?(?:-([\w\/\[\]]+))?$/.exec(item);
      if (propTailwind && propTailwind![3] && propTailwind![4]) {
        if (Object.values(tempObj).includes(propTailwind![1] + '-' + propTailwind![2])) {
          propTailwind![1] = propTailwind![1] + '-' + propTailwind![2];
          propTailwind![2] = propTailwind![3] + '-' + propTailwind![4];
          propTailwind![3] = '';
          propTailwind![4] = '';
        } else {
          propTailwind![2] = propTailwind![2] + '-' + propTailwind![3] + '-' + propTailwind![4];
          propTailwind![3] = '';
          propTailwind![4] = '';
        }
      } else if (propTailwind && propTailwind![3]) {
        if (Object.values(tempObj).includes(propTailwind![1] + '-' + propTailwind![2])) {
          propTailwind![1] = propTailwind![1] + '-' + propTailwind![2];
          propTailwind![2] = propTailwind![3];
          propTailwind![3] = '';
        } else {
          propTailwind![2] = propTailwind![2] + '-' + propTailwind![3];
          propTailwind![3] = '';
        }
      }
      let objItem;
      if (this.typeStyle == style) {
        textElem = item;
      } else if (objItem = this.dataArr.find((obj: any) => obj[this.typeStyle] == item)) {
        if (propCSS && Object.keys(tempObj).includes(propCSS![1])) {
          textElem = (objItem[style]) ? `${tempObj[String(propCSS![1])]}-${objItem[style]}` : "";
        } else {
          textElem = (objItem[style]) ? objItem[style] : "";
        }
      } else if ((propCSS && Object.keys(tempObj).includes(propCSS![1])) ||
                (propTailwind && Object.values(tempObj).includes(propTailwind![1]))) {
        if (this.typeStyle == "css" && (objItem = this.dataArr.find((obj: any) => obj["css"] == `color: ${propCSS![2]};`))) {
          if (objItem) {
            textElem = (objItem[style]) ? `${tempObj[String(propCSS![1])]}-${objItem[style]}` : "";
          } else {
            textElem = "";
          }
        } else if (this.typeStyle != "css" && style == "css" && (objItem = this.dataArr.find((obj: any) => obj[this.typeStyle] == propTailwind![2]))) {
          if (objItem) {
            textElem = (objItem[style]) ? `${Object.keys(tempObj).find((elem: string) => tempObj[elem] == propTailwind![1])}: ${regCSS.exec(objItem["css"])![2]};` : "";
          } else {
            textElem = "";
          }
        } else if (this.typeStyle != "css" && style != "css" && (objItem = this.dataArr.find((obj: any) => obj[this.typeStyle] == propTailwind![2]))) {
          if (objItem) {
            textElem = (objItem[style]) ? `${propTailwind![1]}-${objItem[style]}` : "";
          } else {
            textElem = "";
          }
        } else if (this.typeStyle == "css" && style == "tailwind" && propCSS) {
          let key = this.dataArr.find((obj: any) => obj[style].indexOf(propCSS![1]))!["tailwind_custom"];
          if (Object.keys(tempObj).includes(propCSS![1])) {
            key = tempObj[propCSS![1]];
          }
          textElem = key + "-[" + propCSS![2] + "]";
        }
      } else if (this.typeStyle == "css" && style == "tailwind" && propCSS) {
        let key = this.dataArr.find((obj: any) => obj[style].indexOf(propCSS![1]))!["tailwind_custom"];
        if (Object.keys(tempObj).includes(propCSS![1])) {
          key = tempObj[propCSS![1]];
        }
        textElem = key + "-[" + propCSS![2] + "]";
      }
    } catch (err: any) {
      this.alertNotify("bg-red-700", err);
      console.error(err);
    }
    return textElem;
  }

  async convertData() {
    if (/* this.file && */ this.dataArr.length > 0 && this.dataField != '' && this.typeStyle != '') {
      this.setState({
        blockTable: true,
      });

      let listField = (this.typeStyle != "css") ? this.dataField.match(/[\w\d\/\[\]\-]*[^\s*\n*]/gm) : this.dataField.match(/[\w\-]*:\s*[\s\w\d\%\,\(\)\#\-]*;/gm);

      let tempHead: Array<any> = [];
      if (listField) {
        listField.unshift("Data Field");
        listField.forEach((item: string) => {
          tempHead.push(item);
        });
        listField.shift();
      }
      
      let objStyles = {"css": "CSS", "bootstrap": "Bootstrap 5", "tailwind": "Tailwind CSS"};
      
      let tempBody: Array<any> = [];
      Object.entries(objStyles).forEach(([key, value]) => {
        let tempRow: Array<any> = [];
        tempRow.push({"elem": "th", "text": value});
        if (listField) {
          listField.forEach((item: string) => {
            tempRow.push({"elem": "td", "text": this.searchElemData(item, key)});
          });
        }
        tempBody.push(tempRow);
      });

      setTimeout(() => {
        this.setState({
          dataTable: {
            "thead": tempHead,
            "tbody": tempBody,
          }
        });
      }, 500);
    } else if (/* !this.file && */ this.dataArr.length == 0) {
      this.alertNotify("bg-red-700", "You don't have a style library! Download it from the git repository from this program!");
    } else if (this.typeStyle == '') {
      this.alertNotify("bg-red-700", "You have not selected the type of source styles!");
    } else if (this.dataField == '') {
      this.alertNotify("bg-red-700", "The field is empty! Insert the data!");
    }
  }

  render() {
    return (
      <>
        <div className={`flex flex-col gap-y-5 ${(this.props.numWind > 2) ? 'w-full lg:w-1/3' : (this.props.numWind > 1) ? 'w-full lg:w-1/2' : 'w-full'}`}>
          <div className="flex flex-row justify-between items-center border-b-2 styleBorderSolid pb-2">
            <div className="flex flex-row gap-x-2 text-2xl font-bold">
              <Link to="/"><ChevronBackCircleOutline cssClasses="styleIonIcon" /></Link>
              <span>CSS Converter to classes CSS Frameworks</span>
            </div>
            <select className="styleSelect !w-min" onChange={(event: any) => {this.changeNumWind(event.target.value)}} value={this.props.numWind}>
              <option value={1}>1 window</option>
              <option value={2}>2 windows</option>
              <option value={3}>3 windows</option>
            </select>
          </div>

          {/* <details className="styleDetails">
            <summary>
              <span className="text-xl font-bold">Select the file <span className="italic">css_library.json</span> with the data</span>
            </summary>

            <div className="flex flex-col gap-y-3">
              <input className="styleFileInput" type="file" onChange={(event: any) => {this.file = event.target.files[0]}} accept=".json" />
              <button className="styleBut w-max" onClick={() => {this.getDataFile()}}>Get a data</button>
            </div>
          </details> */}

          <span className="styleLabel">Choose a style type</span>
          <div className="flex flex-row gap-x-5">
            <div className="flex flex-row gap-x-2 justify-center content-center">
              <label className="styleLabel !mt-0">
                <input className="styleRadio mr-2" type="radio" name="typeStyle" onChange={() => {this.typeStyle = "css"}} />
                <span>CSS</span>
              </label>
            </div>

            <div className="flex flex-row gap-x-2 justify-center content-center">
              <label className="styleLabel !mt-0">
                <input className="styleRadio mr-2" type="radio" name="typeStyle" onChange={() => {this.typeStyle = "bootstrap"}} />
                <span>Bootstrap 5</span>
              </label>
            </div>

            <div className="flex flex-row gap-x-2 justify-center content-center">
              <label className="styleLabel !mt-0">
                <input className="styleRadio mr-2" type="radio" name="typeStyle" onChange={() => {this.typeStyle = "tailwind"}} />
                <span>Tailwind CSS</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-y-3">
            <label className="styleLabel">Enter the style according to the selected type (you can enter several classes or properties separated by a space)</label>
            <textarea className="styleTextarea" onChange={(event: any) => {this.dataField = event.target.value}} rows={2}></textarea>
            <button className="styleBut w-max" onClick={() => {this.convertData()}}>Convert data</button>
          </div>

          {this.state.blockTable && <div className="overflow-x-auto" id="blockTable">
            <table className="border styleBorderSolid">
              <thead>
                <tr>
                  {this.state.dataTable.thead.map((elem: any, index: number) => {
                    return <th className='styleTD whitespace-nowrap' key={index}>{elem}</th>
                  })}
                </tr>
              </thead>
              <tbody>
                {this.state.dataTable.tbody.map((elem: any, index: number) => {
                  return <tr key={index}>
                    {elem.map((val: any, index1: number) => {
                      if (val.elem == "th") { return <th className='styleTD whitespace-nowrap' key={index1}>{val.text}</th> }
                      else { return <td className='styleTD whitespace-nowrap' key={index1}>{val.text}</td> }
                    })}
                  </tr>
                })}
              </tbody>
            </table>
          </div>}
        </div>

        <WindNotify ref={this.childRef} />
      </>
    );
  };
};

export default CssConverter;