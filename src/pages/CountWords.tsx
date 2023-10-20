import React from "react";
import { Link } from "react-router-dom";
import { ChevronBackCircleOutline } from "react-ionicons";

class CountWords extends React.Component<{numWind: number, onChangeData: any}> {
  constructor(props: any){
    super(props);
  }
  
  state = {
    dataField: "",
    outputText: ""
  };
  file = null;

  changeNumWind = (numWind: number) => {
    this.props.onChangeData(Number(numWind));
  }

  changeFile = (event: any) => {
    this.file = event.target.files[0];
    if(this.file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const text = (e.target.result);
        this.setState({
          dataField: text
        });
      }
      reader.readAsText(this.file)
    }
  };

  calc = () => {
    let text = this.state.dataField;
    let result = '';
    let num_chars = text.split('').length;
    let num_words = text.split(' ').length;

    result = `Results: ${num_chars} characters, ${num_words} words`;
    this.setState({
      outputText: result 
    });
  };

  render() {
    return (
      <div className={`flex flex-col gap-y-5 ${(this.props.numWind > 2) ? 'w-1/3' : (this.props.numWind > 1) ? 'w-1/2' : 'w-full'}`}>
        <div className="flex flex-row justify-between items-center border-b-2 styleBorderSolid pb-2">
          <div className="flex flex-row gap-x-2 text-2xl font-bold">
            <Link to="/"><ChevronBackCircleOutline cssClasses="styleIonIcon" /></Link>
            <span>Counting the number of words in the text</span>
          </div>
          <select className="styleSelect !w-min" onChange={(event: any) => {this.changeNumWind(event.target.value)}} value={this.props.numWind}>
            <option value={1}>1 window</option>
            <option value={2}>2 windows</option>
            <option value={3}>3 windows</option>
          </select>
        </div>
        
        <span className="text-xl font-bold">Choose a file</span>

        <div className="flex flex-col">
          <input className="styleFileInput" onChange={(event: any) => {this.changeFile(event)}} type="file" accept=".txt" />
        </div>
        
        <span className="my-3 text-xl font-bold">Or enter/paste text in the field below</span>
        
        <div className="flex flex-row">
          <textarea onChange={(event: any) => {this.state.dataField = event.target.value}} rows={6} className="styleTextarea" value={this.state.dataField}></textarea>
        </div>
        
        <button className="styleBut w-min" onClick={() => {this.calc()}}>Calculate</button>
        
        {this.state.outputText != "" && <output className="border styleBorderSolid p-3 rounded-lg">{this.state.outputText}</output>}
      </div>
    );
  };
};

export default CountWords;