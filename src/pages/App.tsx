import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";
import Nav from "./Nav";

import Home from "./Home";
import CountWords from "./CountWords";
import UrlEncDec from "./UrlEncDec";
import Base64EncDec from "./Base64EncDec";
import ColorPalette from "./ColorPalette";
import VirusTotal from "./VirusTotal";
import DataToChart from "./DataToChart";
import CsvToTable from "./CsvToTable";
import JsonToTable from "./JsonToTable";
import JsonToXml from "./JsonToXml";
import XmlToJson from "./XmlToJson";
import XlsToJson from "./XlsToJson";
import JsonToXls from "./JsonToXls";

class App extends React.Component {

  render() {
    return (
      <div className="flex flex-col">
        <Header />
        <div className="flex flex-col m-2 mt-14">
          <BrowserRouter>
            <Nav />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/count_words" element={<CountWords />} />
              <Route path="/url_enc_dec" element={<UrlEncDec />} />
              <Route path="/base64_enc_dec" element={<Base64EncDec />} />
              <Route path="/color_palette" element={<ColorPalette />} />
              <Route path="/virustotal" element={<VirusTotal />} />
              <Route path="/data_to_chart" element={<DataToChart />} />
              <Route path="/csv_to_table" element={<CsvToTable />} />
              <Route path="/json_to_table" element={<JsonToTable />} />
              <Route path="/json_to_xml" element={<JsonToXml />} />
              <Route path="/xml_to_json" element={<XmlToJson />} />
              <Route path="/xls_to_json" element={<XlsToJson />} />
              <Route path="/json_to_xls" element={<JsonToXls />} />
            </Routes>
          </BrowserRouter>
        </div>
        <Footer />
      </div>
    );
  };
};

export default App;
