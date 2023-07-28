import React from "react";

class CountWords extends React.Component {
  state = {
    dataField: "",
    outputText: ""
  };
  file = null;

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
    const outputEl = document.querySelector("output") as HTMLOutputElement | null;
    if(outputEl != null){
      outputEl.setAttribute("style", "display: block");
      this.setState({
        outputText: result 
      });
    }
  };

  render() {
    return (
      <div className="flex flex-col gap-y-3">
        <span className="text-2xl font-bold border-b-2 styleBorderSolid">Counting the number of words in the text</span>
        
        <span className="text-xl font-bold">Choose a file</span>

        <div className="flex flex-col">
          <input className="styleFileInput" onChange={(event: any) => {this.changeFile(event)}} type="file" accept=".txt" />
        </div>
        
        <span className="my-3 text-xl font-bold">Or enter/paste text in the field below</span>
        
        <div className="flex flex-row">
          <textarea onChange={(event: any) => {this.state.dataField = event.target.value}} rows={6} className="styleTextarea" value={this.state.dataField}></textarea>
        </div>
        
        <button className="styleBut w-min" onClick={() => {this.calc()}}>Calculate</button>
        
        <output className="border styleBorderSolid p-3 rounded-lg" style={{"display": "none"}}>{this.state.outputText}</output>
      </div>
    );
  };
};

export default CountWords;