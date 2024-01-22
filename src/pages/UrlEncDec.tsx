import React from "react";
import { Link } from "react-router-dom";
import { ChevronBackCircleOutline } from "react-ionicons";

import WindNotify from "./WindNotify";

class UrlEncDec extends React.Component<{numWind: number, onChangeData: any}> {
  constructor(props: any){
    super(props);
  }

  childRef: any = React.createRef();

  urlInput: string = "";
  state = {
    outputText: ""
  };

  changeNumWind(numWind: number) {
    this.props.onChangeData(Number(numWind));
  }

  alertNotify(color: string, title: string) {
    this.childRef.current.alertNotify(color, title);
  }

  encodeFun() {
    try {
      const encodeUrl = encodeURIComponent(this.urlInput);
      this.setState({
        outputText: encodeUrl
      });
    } catch (error) {
      console.error(error);
      this.alertNotify("bg-red-700", "An unexpected error has occurred! Check the entered data!");
    }
  }

  decodeFun() {
    try {
      const decodeUrl = decodeURIComponent(this.urlInput);
      this.setState({
        outputText: decodeUrl
      });
    } catch (error) {
      console.error(error);
      this.alertNotify("bg-red-700", "An unexpected error has occurred! Check the entered data!");
    }
  }

  render() {
    return (
      <>
        <div className={`flex flex-col gap-y-5 ${(this.props.numWind > 2) ? 'w-1/3' : (this.props.numWind > 1) ? 'w-1/2' : 'w-full'}`}>
          <div className="flex flex-row justify-between items-center border-b-2 styleBorderSolid pb-2">
            <div className="flex flex-row gap-x-2 text-2xl font-bold">
              <Link to="/"><ChevronBackCircleOutline cssClasses="styleIonIcon" /></Link>
              <span>Encode/Decode URL</span>
            </div>
            <select className="styleSelect !w-min" onChange={(event: any) => {this.changeNumWind(event.target.value)}} value={this.props.numWind}>
              <option value={1}>1 window</option>
              <option value={2}>2 windows</option>
              <option value={3}>3 windows</option>
            </select>
          </div>
          
          <label className="styleLabel">Enter the link:</label>
          <textarea className="styleField" onChange={(event: any) => { this.urlInput = event.target.value }}></textarea>

          <div className="flex flex-row gap-x-2">
            <button className="styleBut" onClick={() => {this.encodeFun()}}>Encode</button>
            <button className="styleBut" onClick={() => {this.decodeFun()}}>Decode</button>
          </div>
          
          {this.state.outputText != '' && <textarea id="output" className="styleField" style={{"display": "none"}} defaultValue={this.state.outputText}></textarea>}
        </div>

        <WindNotify ref={this.childRef} />
      </>
    );
  };
};

export default UrlEncDec;