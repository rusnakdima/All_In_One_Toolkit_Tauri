import React from "react";
import { Link } from "react-router-dom";
import { ReaderOutline, CodeWorkingOutline, ColorFilterOutline, BugOutline, BarChartOutline, CodeSlashOutline, LinkOutline } from "react-ionicons";

interface HomeState {
  recentAction: Array<{ to: string; icon: string; name: string }>;
  tempLinks: Array<{ to: string; icon: string; name: string }>;
}

class Home extends React.Component<{}, HomeState> {
  state: HomeState = {
    recentAction: [],
    tempLinks: [],
  };

  links: Array<any> = [
    { "to": 'count_words', "icon": 'reader', "name": 'Count words' },
    { "to": 'url_enc_dec', "icon": 'link', "name": 'URL Encode/Decode' },
    { "to": 'base64_enc_dec', "icon": 'codeworking', "name": 'Base64 Encode/Decode' },
    { "to": 'color_palette', "icon": 'colorfilter', "name": 'Color Palette' },
    { "to": 'virustotal', "icon": 'bug', "name": 'VirusTotal' },
    { "to": 'data_to_chart', "icon": 'barchart', "name": 'Visualization data on chart' },
    { "to": 'csv_to_table', "icon": 'codeslash', "name": 'CSV to Table data' },
    { "to": 'json_to_table', "icon": 'codeslash', "name": 'JSON to Table data' },
    { "to": 'xml_to_table', "icon": 'codeslash', "name": 'XML to Table data' },
    { "to": 'plist_to_table', "icon": 'codeslash', "name": 'Plist to Table data' },
    { "to": 'json_to_xml', "icon": 'codeslash', "name": 'JSON to XML' },
    { "to": 'xml_to_json', "icon": 'codeslash', "name": 'XML to JSON' },
    { "to": 'xls_to_json', "icon": 'codeslash', "name": 'XLS to JSON' },
    { "to": 'json_to_xls', "icon": 'codeslash', "name": 'JSON to XLS' },
    { "to": 'xls_to_xml', "icon": 'codeslash', "name": 'XLS to XML' },
    { "to": 'css_converter', "icon": 'codeslash', "name": 'CSS Converter' },
  ];

  componentDidMount(): void {
    let recAct = localStorage["recAct"];
    if(recAct && recAct != ''){
      this.setState({
        recentAction: JSON.parse(recAct)
      });
    }
    if (this.state.tempLinks.length == 0) {
      this.setState({
        tempLinks: this.links,
      });
    }
  }

  generateLinks(): Array<any>{
    const links = [];
    for (let i = 0; i < this.state.recentAction.length; i++) {
      const element = this.state.recentAction[i];
      links.push(
        <Link onClick={() => this.addLink(element['to'], element['icon'], element['name'])} to={element['to']} className="styleLinkBlock" key={i}>
        {(element['icon'] == 'link') && <LinkOutline cssClasses="styleIonIcon" />}
        {(element['icon'] == 'reader') && <ReaderOutline cssClasses="styleIonIcon" />}
        {(element['icon'] == 'codeworking') && <CodeWorkingOutline cssClasses="styleIonIcon" />}
        {(element['icon'] == 'colorfilter') && <ColorFilterOutline cssClasses="styleIonIcon" />}
        {(element['icon'] == 'bug') && <BugOutline cssClasses="styleIonIcon" />}
        {(element['icon'] == 'barchart') && <BarChartOutline cssClasses="styleIonIcon" />}
        {(element['icon'] == 'codeslash') && <CodeSlashOutline cssClasses="styleIonIcon" />}
        <span>{element['name']}</span></Link>
      );
    }
    return links;
  }

  addLink(to: string, icon: string, name: string): void{
    let tempObj = { "to": to, "icon": icon, "name": name };
    if (this.state.recentAction.find((item: any) => item['to'] == tempObj['to'])) {
      this.state.recentAction.splice(this.state.recentAction.findIndex((item: any) => item["to"] == tempObj["to"]), 1);
      this.state.recentAction.unshift(tempObj);
    } else {
      this.state.recentAction.unshift(tempObj);
    }
    if(this.state.recentAction.length > 7) this.state.recentAction.pop();
    localStorage["recAct"] = JSON.stringify(this.state.recentAction);
  }

  search = (substr: string) => {
    const searchValue = substr.toLowerCase();
    const tempLinks = [];
    if (searchValue != '') {
      tempLinks.push(...this.links.filter((item: any) => item.name.toLowerCase().indexOf(searchValue) >= 0));
      this.setState({
        tempLinks: tempLinks,
      });
    } else {
      this.setState({
        tempLinks: this.links,
      });
    }
  }

  outputLinks = () => {
    const tempLinks = [];
    for (let i = 0; i < this.state.tempLinks.length; i++) {
      const element = this.state.tempLinks[i];
      tempLinks.push(
        <Link onClick={() => this.addLink(element['to'], element['icon'], element['name'])} to={element['to']} className="styleLinkBlock" key={i}>
        {(element['icon'] == 'link') && <LinkOutline cssClasses="styleIonIcon" />}
        {(element['icon'] == 'reader') && <ReaderOutline cssClasses="styleIonIcon" />}
        {(element['icon'] == 'codeworking') && <CodeWorkingOutline cssClasses="styleIonIcon" />}
        {(element['icon'] == 'colorfilter') && <ColorFilterOutline cssClasses="styleIonIcon" />}
        {(element['icon'] == 'bug') && <BugOutline cssClasses="styleIonIcon" />}
        {(element['icon'] == 'barchart') && <BarChartOutline cssClasses="styleIonIcon" />}
        {(element['icon'] == 'codeslash') && <CodeSlashOutline cssClasses="styleIonIcon" />}
        <span>{element['name']}</span></Link>
      );
    }
    return tempLinks;
  }

  render() {
    return (
      <div className="flex flex-col gap-y-5">
        <span className="text-3xl font-bold border-b-2 styleBorderSolid">Home Page</span>

        {(this.state.recentAction.length > 0) && <span className="text-2xl">Recent Action</span>}

        {(this.state.recentAction.length > 0) && 
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2">{this.generateLinks()}</div>
        }

        <div className="flex flex-row justify-between">
          <span className="text-2xl">All Links</span>
          <input type="text" name="" id="" placeholder="Search" onChange={(event: any) => {this.search(event.target.value)}} className="styleField !w-auto" />
        </div>

        {(this.state.tempLinks.length > 0) && <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2">{this.outputLinks()}</div>}
      </div>
    );
  };
};

export default Home;