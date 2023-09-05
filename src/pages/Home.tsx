import React from "react";

import { Link } from "react-router-dom";

import { ReaderOutline, CodeWorkingOutline, ColorFilterOutline, BugOutline, BarChartOutline, CodeSlashOutline } from "react-ionicons";

interface HomeState {
  recentAction: Array<{ to: string; icon: string; name: string }>;
}

class Home extends React.Component<{}, HomeState> {
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

  generateLinks(): Array<any>{
    const links = [];
    for(let i = 0; i < this.state.recentAction.length; i++){
      links.push(
        <Link to={this.state.recentAction[i]['to']} className="styleLinkBlock" key={i}>
        {(this.state.recentAction[i]['icon'] == 'reader') && <ReaderOutline cssClasses="styleIonIcon" />}
        {(this.state.recentAction[i]['icon'] == 'codeworking') && <CodeWorkingOutline cssClasses="styleIonIcon" />}
        {(this.state.recentAction[i]['icon'] == 'colorfilter') && <ColorFilterOutline cssClasses="styleIonIcon" />}
        {(this.state.recentAction[i]['icon'] == 'bug') && <BugOutline cssClasses="styleIonIcon" />}
        {(this.state.recentAction[i]['icon'] == 'barchart') && <BarChartOutline cssClasses="styleIonIcon" />}
        {(this.state.recentAction[i]['icon'] == 'codeslash') && <CodeSlashOutline cssClasses="styleIonIcon" />}
        <span>{this.state.recentAction[i]['name']}</span></Link>
      );
    }
    return links;
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

  render() {
    return (
      <div className="flex flex-col gap-y-5">
        <span className="text-3xl">Home Page</span>

        {(this.state.recentAction.length > 0) && <span className="text-2xl">Recent Action</span>}

        {(this.state.recentAction.length > 0) && 
          <div className="grid grid-cols-4 gap-2">{this.generateLinks()}</div>
        }

        <span className="text-2xl">All Links</span>

        <div className="grid grid-cols-4 gap-2">
          <Link onClick={() => this.addLink('count_words', 'reader', 'Count words')} to="/count_words" className="styleLinkBlock"><ReaderOutline cssClasses="styleIonIcon" /> <span>Count words</span></Link>
          <Link onClick={() => this.addLink('url_enc_dec', 'codeworking', 'URL Encode/Decode')} to="/url_enc_dec" className="styleLinkBlock"><CodeWorkingOutline cssClasses="styleIonIcon" /> <span>URL Encode/Decode</span></Link>
          <Link onClick={() => this.addLink('base64_enc_dec', 'codeworking', 'Base64 Encode/Decode')} to="/base64_enc_dec" className="styleLinkBlock"><CodeWorkingOutline cssClasses="styleIonIcon" /> <span>Base64 Encode/Decode</span></Link>
          <Link onClick={() => this.addLink('color_palette', 'colorfilter', 'Color Palette')} to="/color_palette" className="styleLinkBlock"><ColorFilterOutline cssClasses="styleIonIcon" /> <span>Color Palette</span></Link>
          <Link onClick={() => this.addLink('virustotal', 'bug', 'VirusTotal')} to="/virustotal" className="styleLinkBlock"><BugOutline cssClasses="styleIonIcon" /> <span>VirusTotal</span></Link>
          <Link onClick={() => this.addLink('data_to_chart', 'barchart', 'Visualization data on chart')} to="/data_to_chart" className="styleLinkBlock"><BarChartOutline cssClasses="styleIonIcon" /> <span>Visualization data on chart</span></Link>
          <Link onClick={() => this.addLink('csv_to_table', 'codeslash', 'CSV to Table data')} to="/csv_to_table" className="styleLinkBlock"><CodeSlashOutline cssClasses="styleIonIcon" /> <span>CSV to Table data</span></Link>
          <Link onClick={() => this.addLink('json_to_table', 'codeslash', 'JSON to Table data')} to="/json_to_table" className="styleLinkBlock"><CodeSlashOutline cssClasses="styleIonIcon" /> <span>JSON to Table data</span></Link>
          <Link onClick={() => this.addLink('json_to_xml', 'codeslash', 'JSON to XML')} to="/json_to_xml" className="styleLinkBlock"><CodeSlashOutline cssClasses="styleIonIcon" /> <span>JSON to XML</span></Link>
          <Link onClick={() => this.addLink('xml_to_json', 'codeslash', 'XML to JSON')} to="/xml_to_json" className="styleLinkBlock"><CodeSlashOutline cssClasses="styleIonIcon" /> <span>XML to JSON</span></Link>
          <Link onClick={() => this.addLink('xls_to_json', 'codeslash', 'XLS to JSON')} to="/xls_to_json" className="styleLinkBlock"><CodeSlashOutline cssClasses="styleIonIcon" /> <span>XLS to JSON</span></Link>
          <Link onClick={() => this.addLink('json_to_xls', 'codeslash', 'JSON to XLS')} to="/json_to_xls" className="styleLinkBlock"><CodeSlashOutline cssClasses="styleIonIcon" /> <span>JSON to XLS</span></Link>
          <Link onClick={() => this.addLink('css_converter', 'codeslash', 'CSS Converter')} to="/css_converter" className="styleLinkBlock"><CodeSlashOutline cssClasses="styleIonIcon" /> <span>CSS Converter</span></Link>
        </div>
      </div>
    );
  };
};

export default Home;