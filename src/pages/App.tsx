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
              <Route path="/virustotal" element={<VirusTotal />} />
              <Route path="/url_enc_dec" element={<UrlEncDec />} />
              <Route path="/base64_enc_dec" element={<Base64EncDec />} />
              <Route path="/convert_doc_txt" element={<Home />} />
              <Route path="/convert_txt_doc" element={<Home />} />
              <Route path="/data_to_chart" element={<Home />} />
              <Route path="/text_to_speech" element={<Home />} />
              <Route path="/file_downloader" element={<Home />} />
              <Route path="/color_palette" element={<ColorPalette />} />
              <Route path="/xls_to_json" element={<Home />} />
              <Route path="/csv_to_table" element={<Home />} />
              <Route path="/json_to_table" element={<Home />} />
              <Route path="/xml_to_json" element={<Home />} />
              <Route path="/json_to_xml" element={<Home />} />
            </Routes>
          </BrowserRouter>
        </div>
        <Footer />
      </div>
    );
  };
};

export default App;
