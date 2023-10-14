import React from 'react';

import { Link } from "react-router-dom";

import { HomeOutline, ReaderOutline, CodeWorkingOutline, ColorFilterOutline, BugOutline, BarChartOutline, CodeSlashOutline } from "react-ionicons";

interface HomeState {
  recentAction: Array<{ to: string; icon: string; name: string }>;
}

class Nav extends React.Component<{}, HomeState> {
  state: HomeState = {
    recentAction: [],
  };

  componentDidMount(): void {
    let recAct = localStorage["recAct"];
    if(recAct && recAct != ''){
      this.setState({
        recentAction: JSON.parse(recAct)
      });
    }
  }

  addLink(to: string, icon: string, name: string): void{
    let tempObj = { "to": to, "icon": icon, "name": name };
    if(!this.state.recentAction.find((item: any) => item['to'] == tempObj['to'])){
      this.state.recentAction.unshift(tempObj)
    } else {
      this.state.recentAction.splice((this.state.recentAction.findIndex((item: any) => item == tempObj)), 1);
      this.state.recentAction.unshift(tempObj);
    }
    if(this.state.recentAction.length > 4) this.state.recentAction.pop();
    localStorage["recAct"] = JSON.stringify(this.state.recentAction);
  }

  render(){
    return (
      <div className="fixed top-0 left-0 m-0 p-0 z-40 w-full h-screen -translate-x-full bg-white/60 dark:bg-black/30" id="menuBack">
        <div className="w-64 p-4 bg-gray-200 dark:bg-zinc-800 h-screen transition-transform -translate-x-full">
          <span className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">Menu</span>
          <div className="flex flex-col py-4 overflow-y-auto h-full space-y-2 font-medium">
            <Link to="/" className="styleLinkMenu"><HomeOutline cssClasses="styleIonIcon" /> <span>Home</span></Link>
            <Link onClick={() => this.addLink('count_words', 'reader', 'Count words')} to="/count_words" className="styleLinkMenu"><ReaderOutline cssClasses="styleIonIcon" /> <span>Count words</span></Link>
            <Link onClick={() => this.addLink('url_enc_dec', 'codeworking', 'URL Encode/Decode')} to="/url_enc_dec" className="styleLinkMenu"><CodeWorkingOutline cssClasses="styleIonIcon" /> <span>URL Encode/Decode</span></Link>
            <Link onClick={() => this.addLink('base64_enc_dec', 'codeworking', 'Base64 Encode/Decode')} to="/base64_enc_dec" className="styleLinkMenu"><CodeWorkingOutline cssClasses="styleIonIcon" /> <span>Base64 Encode/Decode</span></Link>
            <Link onClick={() => this.addLink('color_palette', 'colorfilter', 'Color Palette')} to="/color_palette" className="styleLinkMenu"><ColorFilterOutline cssClasses="styleIonIcon" /> <span>Color Palette</span></Link>
            <Link onClick={() => this.addLink('virustotal', 'bug', 'VirusTotal')} to="/virustotal" className="styleLinkMenu"><BugOutline cssClasses="styleIonIcon" /> <span>VirusTotal</span></Link>
            <Link onClick={() => this.addLink('data_to_chart', 'barchart', 'Visualization data on chart')} to="/data_to_chart" className="styleLinkMenu"><BarChartOutline cssClasses="styleIonIcon" /> <span>Visualization data on chart</span></Link>
            <Link onClick={() => this.addLink('csv_to_table', 'codeslash', 'CSV to Table data')} to="/csv_to_table" className="styleLinkMenu"><CodeSlashOutline cssClasses="styleIonIcon" /> <span>CSV to Table data</span></Link>
            <Link onClick={() => this.addLink('json_to_table', 'codeslash', 'JSON to Table data')} to="/json_to_table" className="styleLinkMenu"><CodeSlashOutline cssClasses="styleIonIcon" /> <span>JSON to Table data</span></Link>
            <Link onClick={() => this.addLink('json_to_xml', 'codeslash', 'JSON to XML')} to="/json_to_xml" className="styleLinkMenu"><CodeSlashOutline cssClasses="styleIonIcon" /> <span>JSON to XML</span></Link>
            <Link onClick={() => this.addLink('xml_to_json', 'codeslash', 'XML to JSON')} to="/xml_to_json" className="styleLinkMenu"><CodeSlashOutline cssClasses="styleIonIcon" /> <span>XML to JSON</span></Link>
            <Link onClick={() => this.addLink('xls_to_json', 'codeslash', 'XLS to JSON')} to="/xls_to_json" className="styleLinkMenu"><CodeSlashOutline cssClasses="styleIonIcon" /> <span>XLS to JSON</span></Link>
            <Link onClick={() => this.addLink('json_to_xls', 'codeslash', 'JSON to XLS')} to="/json_to_xls" className="styleLinkMenu"><CodeSlashOutline cssClasses="styleIonIcon" /> <span>JSON to XLS</span></Link>
            <Link onClick={() => this.addLink('plist_to_table', 'codeslash', 'Plist to Table data')} to="/plist_to_table" className="styleLinkMenu"><CodeSlashOutline cssClasses="styleIonIcon" /> <span>Plist to Table data</span></Link>
            <Link onClick={() => this.addLink('css_converter', 'codeslash', 'CSS Converter')} to="/css_converter" className="styleLinkMenu"><CodeSlashOutline cssClasses="styleIonIcon" /> <span>CSS Converter</span></Link>
          </div>
        </div>
      </div>
    );
  };
};

export default Nav;