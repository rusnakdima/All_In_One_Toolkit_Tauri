import React from "react";
import { Link } from "react-router-dom";
import { ChevronBackCircleOutline } from "react-ionicons";

import WindNotify from "./WindNotify";

class PlistToTable extends React.Component {
  childRef: any = React.createRef();

  file: any = null;

  state = {
    blockList: false,
  };

  alertNotify(color: string, title: string) {
    this.childRef.current.alertNotify(color, title);
  };

  changeIcon = (e: any) => {
    const addElem = '<svg class="styleIonIcon" style="width: 25px !important; height: 25px !important" data-toggle="close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path data-toggle="close" d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"></path><path data-toggle="close" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 176v160M336 256H176"></path></svg>';
    const removeElem = '<svg class="styleIonIcon" style="width: 25px !important; height: 25px !important" data-toggle="open" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path data-toggle="open" d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"></path><path data-toggle="open" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M336 256H176"></path></svg>';
    function setIcon (state: string, icon: string) {
      let element;
      
      if (e.target.nodeName == "svg") element = e.target.parentElement;
      else if (e.target.nodeName == "path") element = e.target.parentElement.parentElement;
      else if (e.target.nodeName == "SPAN") element = e.target;

      const text = element.textContent;
      element.innerHTML = icon + text;
      element.dataset.toggle = state;
    }
    if (e.target.dataset.toggle == "close") {
      setIcon("open", removeElem);
    } else if (e.target.dataset.toggle == "open") {
      setIcon("close", addElem);
    }
  }

  createTR = (array: any, styleText: Array<string>, padLeft: number) =>{
    const divBlock = document.createElement('div');
    divBlock.classList.add("w-full");
    divBlock.classList.add("flex");
    divBlock.classList.add("flex-row");
    divBlock.classList.add("styleTD");
    
    array.forEach((elem: any, index: number) => {
      let cell = document.createElement('div');
      cell.classList.add("w-1/3");
      let span = document.createElement('span');
      if (index == 0 && (array[1] == "Dictonary" || array[1] == "Array")) {
        span.classList.add("flex");
        span.classList.add("flex-row");
        span.classList.add("items-center");
        span.setAttribute("data-toggle", "close");
        span.onclick = this.changeIcon;
        span.innerHTML = '<svg class="styleIonIcon" style="width: 25px !important; height: 25px !important" data-toggle="close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path data-toggle="close" d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"></path><path data-toggle="close" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 176v160M336 256H176"></path></svg>';
        span.append(elem);
      } else {
        span.innerHTML = elem;
      }
      if (styleText.length > 1 && index == 2) {
        styleText.forEach((item: string) => span.classList.add(item));
      } else {
        span.classList.add(styleText[0]);
      }
      if (index == 0) span.style.paddingLeft = `${padLeft}px`;
      cell.appendChild(span);
      divBlock.appendChild(cell);
    });

    return divBlock;
  }

  createDetails = (key: string, type: string, numItems: number, padLeft: number) => {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.style.listStyle = "none";
    summary.classList.add("flex");
    summary.classList.add("flex-row");
    summary.classList.add("items-center");
    summary.appendChild(this.createTR([key, type, `${numItems} Items`], ["font-normal", "text-gray-600", "dark:text-gray-300"], padLeft-20));
    details.appendChild(summary);
    return details;
  }

  parseData = (array: any, key: string, padLeft: number) => {
    const details = this.createDetails(key, "Dictonary", array.length/2, padLeft);
    padLeft += 20;
    for (let i = 0; i <= array.length-1; i=i+2) {
      const element = array[i];
      const element1 = array[i+1];
      if (element1.nodeName == "dict") {
        details.appendChild(this.parseData([...element1.children], element.textContent, padLeft));
      } else if (element1.nodeName == "array") {
        const details1 = this.createDetails(element.textContent, "Array", [...element1.children].length, padLeft);
        if (element1.children[0].nodeName == "dict") {
          for (let j = 0; j < [...element1.children].length; j++) {
            details1.appendChild(this.parseData([...element1.children][j].children, ''+j, padLeft + 20));
          }
        } else {
          for (let j = 0; j < [...element1.children].length; j++) {
            const element2 = [...element1.children][j];
            details1.appendChild(this.createTR([j, element2.nodeName, element2.textContent], ["font-normal"], padLeft + 20));
          }
        }
        details.appendChild(details1);
      } else if (element1.nodeName == "true" || element1.nodeName == "false") {
        details.appendChild(this.createTR([element.textContent, "Boolean", element1.nodeName], ["font-normal"], padLeft));
      } else {
        details.appendChild(this.createTR([element.textContent, element1.nodeName, element1.textContent], ["font-normal"], padLeft));
      }
    }
    return details;
  }

  createList = (dataXML: string) => {
    this.setState({
      blockList: true
    });
    setTimeout(() => {
      const blockList = document.querySelector('#blockList') as HTMLDivElement | null;
      if (blockList != null) {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(dataXML, 'text/xml');
        let dict = xmlDoc.children[0].children[0];

        blockList.innerHTML = "";
        blockList.appendChild(this.createTR(["Key", "Type", "Value"], ["font-bold"], 0));
        blockList.appendChild(this.parseData([...dict.children], 'Root', 20));
      }
    }, 50);
  };

  parseDataFileFun = async () =>{
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
        <div className="flex flex-col gap-y-3">
          <div className="flex flex-row gap-x-2 text-2xl font-bold border-b-2 styleBorderSolid">
            <Link to="/"><ChevronBackCircleOutline cssClasses="styleIonIcon" /></Link>
            <span>Plist Viewer</span>
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

          {this.state.blockList && <div className="flex flex-col" id="blockList"></div>}
        </div>

        <WindNotify ref={this.childRef} />
      </>
    );
  };
};

export default PlistToTable;