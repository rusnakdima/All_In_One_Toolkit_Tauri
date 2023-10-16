import React from "react";
import { Link } from "react-router-dom";
import { ChevronBackCircleOutline } from "react-ionicons";

class UrlEncDec extends React.Component {
  urlInput: string = "";
  state = {
    outputText: ""
  };

  encodeFun = () => {
    const outputEl = document.querySelector("#output") as HTMLTextAreaElement | null;
    if(outputEl != null){
      outputEl.setAttribute("style", "display: block");
      const encodeUrl = encodeURIComponent(this.urlInput);
      this.setState({
        outputText: encodeUrl
      });
    }
  };

  decodeFun = () => {
    const outputEl = document.querySelector("#output") as HTMLTextAreaElement | null;
    if(outputEl != null){
      outputEl.setAttribute("style", "display: block");
      const decodeUrl = decodeURIComponent(this.urlInput);
      this.setState({
        outputText: decodeUrl
      });
    }
  };

  render() {
    return (
      <div className="flex flex-col gap-y-3">
        <div className="flex flex-row gap-x-2 text-2xl font-bold border-b-2 styleBorderSolid">
          <Link to="/"><ChevronBackCircleOutline cssClasses="styleIonIcon" /></Link>
          <span>Encode/Decode URL</span>
        </div>
        
        <label className="styleLabel">Enter the link:</label>
        <textarea className="styleField" onChange={(event: any) => { this.urlInput = event.target.value }}></textarea>

        <div className="flex flex-row gap-x-2">
          <button className="styleBut" onClick={() => {this.encodeFun()}}>Encode</button>
          <button className="styleBut" onClick={() => {this.decodeFun()}}>Decode</button>
        </div>
        
        <textarea id="output" className="styleField" style={{"display": "none"}} defaultValue={this.state.outputText}></textarea>
      </div>
    );
  };
};

export default UrlEncDec;