import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Link } from "react-router-dom";
import { ChevronBackCircleOutline, CheckmarkCircleOutline, InformationCircleOutline, AlertCircleOutline, HelpCircleOutline } from "react-ionicons";

class VirusTotal extends React.Component<{numWind: number, onChangeData: any}> {
  constructor(props: any){
    super(props);
  }

  state = {
    blockResult: false,
    reqText: '',
    circleBlockColor: '',
    milicious: '',
    allAntivirus: '',
    listAntiviruses: [],
  };
  
  urlInput: string = "";

  changeNumWind(numWind: number) {
    this.props.onChangeData(Number(numWind));
  }

  async reqFun() {
    this.setState({
      reqText: "The request is being executed! Wait..."
    });
    try {
      const url = btoa(this.urlInput).replace(/=/g, "");
      const apiKey = "7a8e8b508ecbba8020e949da7d4edb85d64c55429d04593884c2cececad685d1";
      const apiUrl = `https://www.virustotal.com/api/v3/urls/${encodeURIComponent(url)}`;

      const data: string = await invoke("virus_total", { "url": apiUrl, "key": apiKey });
      if (data != null && data != '') {
        const json = JSON.parse(data);

        const colors = ["green-600", "yellow-300", "orange-500", "red-600"];

        const milicious = json.data.attributes.last_analysis_stats.malicious || 0;
        const allAntivirus = Object.keys(json.data.attributes.last_analysis_results).length;
        const color = colors[Math.floor((milicious / allAntivirus) * colors.length)];

        let listAntiviruses: Array<any> = [];
        const sites_analysis = json.data.attributes.last_analysis_results;
        Object.values(sites_analysis).forEach((elem: any) => {
          listAntiviruses.push({"status": elem.result, "name": elem.engine_name});
        });

        this.setState({
          reqText: '',
          circleBlockColor: color,
          milicious: milicious,
          allAntivirus: allAntivirus,
          listAntiviruses: listAntiviruses,
          blockResult: true,
        });

      } else {
        this.setState({
          reqText: "Errors occurred when executing the request!"
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    return (
      <>
        <div className={`flex flex-col gap-y-5 ${(this.props.numWind > 2) ? 'w-full lg:w-1/3' : (this.props.numWind > 1) ? 'w-full lg:w-1/2' : 'w-full'}`}>
          <div className="flex flex-row justify-between items-center border-b-2 styleBorderSolid pb-2">
            <div className="flex flex-row gap-x-2 text-2xl font-bold">
              <Link to="/"><ChevronBackCircleOutline cssClasses="styleIonIcon" /></Link>
              <span>Checking the link via VirusTotal</span>
            </div>
            <select className="styleSelect !w-min" onChange={(event: any) => {this.changeNumWind(event.target.value)}} value={this.props.numWind}>
              <option value={1}>1 window</option>
              <option value={2}>2 windows</option>
              <option value={3}>3 windows</option>
            </select>
          </div>

          <label className="styleLabel">Enter the link:</label>
          <input className="styleField" type="text" onChange={(event: any) => {this.urlInput = event.target.value;}}/>
          <button className="styleBut w-min" onClick={() => {this.reqFun();}}>Check</button>

          {this.state.reqText != '' && <span className="text-xl">{this.state.reqText}</span>}
          {this.state.blockResult && <div className="border styleBorderSolid p-3 rounded-lg mt-3">
            <div className="flex flex-col mx-auto w-[200px] h-[200px] mb-5">
              <div className={`flex flex-row rounded-full justify-center items-center border-solid border-4 border-${this.state.circleBlockColor} w-full h-full`}>
                <span className={`text-${this.state.circleBlockColor} text-5xl`}>{this.state.milicious}</span>
                <span className="text-black dark:text-white text-3xl">/{this.state.allAntivirus}</span>
              </div>
            </div>
            <span className="flex felx-col text-xl font-bold justify-center">List of antiviruses with scan results</span>
            <div className="flex flex-row flex-wrap justify-center gap-3">
              {this.state.listAntiviruses.map((elem: any) => {
                return <div className="flex flex-col justify-center items-center rounded-lg p-2 bg-gray-300 dark:bg-gray-800 !w-[150px] !h-[150px]">
                  {(elem.status == "clean") ? <CheckmarkCircleOutline cssClasses={"!text-green-600 !fill-green-600 !w-[90px] !h-[90px]"} /> :
                   (elem.status == "suspicious") ? <InformationCircleOutline cssClasses={"!text-orange-500 !fill-orange-500 !w-[90px] !h-[90px]"} /> :
                   (elem.status == "malicious") ? <AlertCircleOutline cssClasses={"!text-red-600 !fill-red-600 !w-[90px] !h-[90px]"} /> :
                   <HelpCircleOutline cssClasses={"!text-gray-500 !fill-gray-500 !w-[90px] !h-[90px]"} />}
                  <span className="text-center">{elem.name}</span>
                </div>
              })}
            </div>
          </div>}
          <span className="border-green-600 text-green-600"></span>
          <span className="border-yellow-300 text-yellow-300"></span>
          <span className="border-orange-500 text-orange-500"></span>
          <span className="border-red-600 text-red-600"></span>
          <span className="text-gray-500"></span>
        </div>
      </>
    );
  }
}

export default VirusTotal;
