import React from "react";
import { BrowserRouter, useRoutes, Outlet } from "react-router-dom";

import Header from "./Header";
import Nav from "./Nav";

import Home from "./Home";
import About from "./About";

import CountWords from "./CountWords";
import UrlEncDec from "./UrlEncDec";
import Base64EncDec from "./Base64EncDec";
import ColorPalette from "./ColorPalette";
import VirusTotal from "./VirusTotal";
import DataToChart from "./DataToChart";
import CsvToTable from "./CsvToTable";
import JsonToTable from "./JsonToTable";
import XmlToTable from "./XmlToTable";
import PlistToTable from "./PlistToTable";
import JsonToXml from "./JsonToXml";
import XmlToJson from "./XmlToJson";
import XlsToJson from "./XlsToJson";
import JsonToXls from "./JsonToXls";
import XmlToXls from "./XmlToXls";
import XlsToXml from "./XlsToXml";
import CssConverter from "./CssConverter";
import MarkdownEditor from "./MarkdownEditor";

const Router = (data: any) => {
  const routes = [
    {
      path: '/',
      element: <Outlet />,
      children: [
        { path: '/', element: <Home numWind={data.numWind} onChangeData={data.onChangeData} /> },
        { path: 'home', element: <Home numWind={data.numWind} onChangeData={data.onChangeData} /> },
        { path: 'about', element: <About numWind={data.numWind} onChangeData={data.onChangeData} /> },
        { path: 'count_words', element: <CountWords numWind={data.numWind} onChangeData={data.onChangeData} /> },
        { path: 'url_enc_dec', element: <UrlEncDec numWind={data.numWind} onChangeData={data.onChangeData} /> },
        { path: 'base64_enc_dec', element: <Base64EncDec numWind={data.numWind} onChangeData={data.onChangeData} /> },
        { path: 'color_palette', element: <ColorPalette numWind={data.numWind} onChangeData={data.onChangeData} /> },
        { path: 'virustotal', element: <VirusTotal numWind={data.numWind} onChangeData={data.onChangeData} /> },
        { path: 'data_to_chart', element: <DataToChart numWind={data.numWind} onChangeData={data.onChangeData} /> },
        { path: 'csv_to_table', element: <CsvToTable numWind={data.numWind} onChangeData={data.onChangeData} /> },
        { path: 'json_to_table', element: <JsonToTable numWind={data.numWind} onChangeData={data.onChangeData} /> },
        { path: 'xml_to_table', element: <XmlToTable numWind={data.numWind} onChangeData={data.onChangeData} /> },
        { path: 'plist_to_table', element: <PlistToTable numWind={data.numWind} onChangeData={data.onChangeData} /> },
        { path: 'json_to_xml', element: <JsonToXml numWind={data.numWind} onChangeData={data.onChangeData} /> },
        { path: 'xml_to_json', element: <XmlToJson numWind={data.numWind} onChangeData={data.onChangeData} /> },
        { path: 'xls_to_json', element: <XlsToJson numWind={data.numWind} onChangeData={data.onChangeData} /> },
        { path: 'json_to_xls', element: <JsonToXls numWind={data.numWind} onChangeData={data.onChangeData} /> },
        { path: 'xml_to_xls', element: <XmlToXls numWind={data.numWind} onChangeData={data.onChangeData} /> },
        { path: 'xls_to_xml', element: <XlsToXml numWind={data.numWind} onChangeData={data.onChangeData} /> },
        { path: 'css_converter', element: <CssConverter numWind={data.numWind} onChangeData={data.onChangeData} /> },
        { path: 'markdown_editor', element: <MarkdownEditor numWind={data.numWind} onChangeData={data.onChangeData} /> },
      ]
    }
  ];
  let element = useRoutes(routes);

  return element;
};

class App extends React.Component {
  state = {
    numWind: 1,
  };

  changeNumWind(numWind: number) {
    this.setState({
      numWind: numWind,
    });
  }

  render() {
    return (
      <div className="flex flex-col">
        <Header />
        <div className={`flex ${this.state.numWind > 1 ? 'flex-col gap-y-3 lg:flex-row lg:gap-x-3' : 'flex-col'} m-2 mt-14`}>
          <BrowserRouter>
            <Nav />
            <Router numWind={this.state.numWind} onChangeData={(value: number) => {this.changeNumWind(value)}} />
          </BrowserRouter>
          {this.state.numWind > 1 && <div className="border-l-2 styleBorderSolid"></div>}
          {this.state.numWind > 1 && <BrowserRouter>
            <Nav />
            <Router numWind={this.state.numWind} onChangeData={(value: number) => {this.changeNumWind(value)}} />
          </BrowserRouter>}
          {this.state.numWind > 2 && <div className="border-l-2 styleBorderSolid"></div>}
          {this.state.numWind > 2 && <BrowserRouter>
            <Nav />
            <Router numWind={this.state.numWind} onChangeData={(value: number) => {this.changeNumWind(value)}} />
          </BrowserRouter>}
        </div>
      </div>
    );
  };
};

export default App;
