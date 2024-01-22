import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronBackCircleOutline, AddCircleOutline, RemoveCircleOutline } from "react-ionicons";

import WindNotify from "./WindNotify";

interface HeadData {
  key: string;
  type: string;
  value: string;
  padLeft: number;
  open: boolean;
}

interface ItemData {
  key: string;
  type: string;
  value: string;
  padLeft: number;
}

interface DetailsData {
  head: HeadData;
  list: (HeadData & {head?: undefined} | ItemData & {head?: undefined} | DetailsData)[];
}

interface DetailsProps {
  data: DetailsData;
  indexKey: string;
}

const RecursiveDetails: React.FC<DetailsProps> = ({ data, indexKey }) => {
  const [isOpen, setIsOpen] = useState(data.head.open);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <details>
      <summary onClick={toggleOpen} className="flex flex-row items-center list-none">
        <div className="styleTD flex flex-row w-full">
          <div className="w-1/3">
            <span className="font-normal flex flex-row items-center" style={{"paddingLeft": data.head.padLeft}}>
              {isOpen ? (
                <RemoveCircleOutline cssClasses={"styleIonIcon "} />
              ) : (
                <AddCircleOutline cssClasses={"styleIonIcon "} />
              )}
              {data.head.key}
            </span>
          </div>
          <div className="w-1/3"><span className="font-normal">{data.head.type}</span></div>
          <div className="w-1/3"><span className="font-normal text-gray-600 dark:text-gray-300">{data.head.value} Items</span></div>
        </div>
      </summary>
      {data.list.map((item, index) => (
        <div key={indexKey+'.'+(index+1)}>
          {item.head !== undefined ? (
            <RecursiveDetails data={item} indexKey={indexKey+'.'+(index+1)} />
          ) : (
            <div className="styleTD flex flex-row w-full">
              <div className="w-1/3"><span className="font-normal" style={{"paddingLeft": item.padLeft}}>{item.key}</span></div>
              <div className="w-1/3"><span className="font-normal">{item.type}</span></div>
              <div className="w-1/3"><span className="font-normal">{item.value}</span></div>
            </div>
          )}
        </div>
      ))}
    </details>
  );
};

class PlistToTable extends React.Component<{numWind: number, onChangeData: any}> {
  constructor(props: any){
    super(props);
  }

  childRef: any = React.createRef();

  file: any = null;

  state = {
    blockList: false,
    dataDetails: {head: {"key": "", "type": "", "value": "", "padLeft": 0, "open": false}, list: []},
  };

  changeNumWind(numWind: number) {
    this.props.onChangeData(Number(numWind));
  }

  alertNotify(color: string, title: string) {
    this.childRef.current.alertNotify(color, title);
  }

  parseData(array: any, key: string, padLeft: number) {
    const tempDetails: DetailsData = {head: {"key": key, "type": "Dictonary", "value": String(array.length/2), "padLeft": padLeft - 20, "open": false}, list: []};
    padLeft += 20;
    let tempRow: ({"key": string, "type": string, "value": string, "padLeft": number} | DetailsData)[] = [];
    for (let i = 0; i <= array.length-1; i=i+2) {
      const element = array[i];
      const element1 = array[i+1];
      if (element1.nodeName == "dict") {
        tempRow.push(this.parseData([...element1.children], element.textContent, padLeft));
      } else if (element1.nodeName == "array") {
        const tempDetails1: DetailsData = {head: {"key": element.textContent, "type": "Array", "value": String([...element1.children].length), "padLeft": padLeft - 20, "open": false}, list: []};
        let tempRow1: ({"key": string, "type": string, "value": string, "padLeft": number} | DetailsData)[] = [];
        if (element1.children[0].nodeName == "dict") {
          for (let j = 0; j < [...element1.children].length; j++) {
            tempRow1.push(this.parseData([...element1.children][j].children, ''+j, padLeft + 20));
          }
        } else {
          for (let j = 0; j < [...element1.children].length; j++) {
            const element2 = [...element1.children][j];
            tempRow1.push({"key": String(j), "type": element2.nodeName, "value": element2.textContent, "padLeft": padLeft + 20});
          }
        }
        tempDetails1.list = tempRow1;
        tempDetails.list.push(tempDetails1);
      } else if (element1.nodeName == "true" || element1.nodeName == "false") {
        tempRow.push({"key": element.textContent, "type": "Boolean", "value": element1.nodeName, "padLeft": padLeft});
      } else {
        tempRow.push({"key": element.textContent, "type": element1.nodeName, "value": element1.textContent, "padLeft": padLeft});
      }
    }
    tempDetails.list = tempRow;
    return tempDetails;
  }

  createList(dataXML: string) {
    this.setState({
      blockList: true
    });
    setTimeout(() => {
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(dataXML, 'text/xml');
      let dict = xmlDoc.children[0].children[0];
      this.setState({
        dataDetails: this.parseData([...dict.children], 'Root', 20)
      });
    }, 50);
  }

  async parseDataFileFun() {
    if (this.file != null) {
      const fileUrl = URL.createObjectURL(this.file);
      const response = await fetch(fileUrl);
      const text = await response.text();
      if (text != null && text != '') {
        const dataXml = text;
        this.createList(dataXml);
      } else {
        this.alertNotify("bg-red-700", "The file is empty!");
      }
    } else {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    }
  }

  render() {
    return (
      <>
        <div className={`flex flex-col gap-y-5 ${(this.props.numWind > 2) ? 'w-1/3' : (this.props.numWind > 1) ? 'w-1/2' : 'w-full'}`}>
          <div className="flex flex-row justify-between items-center border-b-2 styleBorderSolid pb-2">
            <div className="flex flex-row gap-x-2 text-2xl font-bold">
              <Link to="/"><ChevronBackCircleOutline cssClasses="styleIonIcon" /></Link>
              <span>Plist Viewer</span>
            </div>
            <select className="styleSelect !w-min" onChange={(event: any) => {this.changeNumWind(event.target.value)}} value={this.props.numWind}>
              <option value={1}>1 window</option>
              <option value={2}>2 windows</option>
              <option value={3}>3 windows</option>
            </select>
          </div>

          <details className="styleDetails">
            <summary>
              <span className="text-xl font-bold">Select the PLIST file with the data</span>
            </summary>
            
            <div className="flex flex-col gap-y-3">
              <input className="styleFileInput" type="file" onChange={(event: any) => {this.file = event.target.files[0]}} accept=".plist" />
              <button className="styleBut w-max" onClick={() => {this.parseDataFileFun()}}>Create a table</button>
            </div>
          </details>

          {this.state.blockList && <div className="flex flex-col">
            <div className="styleTD flex flex-row w-full">
              <div className="w-1/3"><span className="font-bold">Key</span></div>
              <div className="w-1/3"><span className="font-bold">Type</span></div>
              <div className="w-1/3"><span className="font-bold">Value</span></div>
            </div>
            <RecursiveDetails data={this.state.dataDetails} indexKey={'1'} />
          </div>}
        </div>

        <WindNotify ref={this.childRef} />
      </>
    );
  };
};

export default PlistToTable;