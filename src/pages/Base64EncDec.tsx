import React from "react";

class Base64EncDec extends React.Component {
  baseInput: string = "";
  state = {
    outputText: ""
  }

  encodeFun = () => {
    const outputEl = document.querySelector("#output") as HTMLTextAreaElement | null;
    if(outputEl != null){
      outputEl.setAttribute("style", "display: block");
      try {
        const encodeData = btoa(this.baseInput);
        this.setState({
          outputText: encodeData
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  decodeFun = () => {
    const outputEl = document.querySelector("#output") as HTMLTextAreaElement | null;
    if(outputEl != null){
      outputEl.setAttribute("style", "display: block");
      try {
        const decodeData = atob(this.baseInput);
        this.setState({
          outputText: decodeData
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  render(){
    return(
      <div className="flex flex-col gap-y-3">
        <span className="text-2xl font-bold border-b-2 styleBorderSolid">Encode data to base64 / Decode data from base64</span>
        
        <label className="styleLabel">Enter the data:</label>
        <textarea className="styleField" onChange={(event: any) => { this.baseInput = event.target.value }}></textarea>

        <div className="flex flex-row gap-x-2">
          <button className="styleBut" onClick={() => {this.encodeFun()}}>Encode</button>
          <button className="styleBut" onClick={() => {this.decodeFun()}}>Decode</button>
        </div>

        <textarea id="output" className="styleField" style={{"display": "none"}} defaultValue={this.state.outputText}></textarea>
      </div>
    );
  };
};

export default Base64EncDec;