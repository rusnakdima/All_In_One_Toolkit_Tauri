import React from 'react';

import { Link } from "react-router-dom";

import { HomeOutline, ReaderOutline, CodeWorkingOutline, ColorFilterOutline, BugOutline, BarChartOutline, /* DocumentOutline,*/  CodeSlashOutline } from "react-ionicons";

class Nav extends React.Component {
  render(){
    return (
      <div className="fixed top-0 left-0 m-0 p-0 z-40 w-full h-screen -translate-x-full bg-white/60 dark:bg-black/30" id="menuBack">
        <div className="w-64 p-4 bg-gray-200 dark:bg-zinc-800 h-screen transition-transform -translate-x-full">
          <span className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">Menu</span>
          <div className="flex flex-col py-4 overflow-y-auto h-full space-y-2 font-medium">
            <Link to="/" className="styleLinkMenu"><HomeOutline cssClasses="text-black dark:text-white !w-[35px] !h-[35px]" /> <span>Home</span></Link>
            <Link to="/count_words" className="styleLinkMenu"><ReaderOutline cssClasses="text-black dark:text-white !w-[35px] !h-[35px]" /> <span>Count words</span></Link>
            <Link to="/url_enc_dec" className="styleLinkMenu"><CodeWorkingOutline cssClasses="text-black dark:text-white !w-[35px] !h-[35px]" /> <span>URL Encode/Decode</span></Link>
            <Link to="/base64_enc_dec" className="styleLinkMenu"><CodeWorkingOutline cssClasses="text-black dark:text-white !w-[35px] !h-[35px]" /> <span>Base64 Encode/Decode</span></Link>
            <Link to="/color_palette" className="styleLinkMenu"><ColorFilterOutline cssClasses="text-black dark:text-white !w-[35px] !h-[35px]" /> <span>Color Palette</span></Link>
            <Link to="/virustotal" className="styleLinkMenu"><BugOutline cssClasses="text-black dark:text-white !w-[35px] !h-[35px]" /> <span>VirusTotal</span></Link>
            <Link to="/data_to_chart" className="styleLinkMenu"><BarChartOutline cssClasses="text-black dark:text-white !w-[35px] !h-[35px]" /> <span>Visualization data on chart</span></Link>
            <Link to="/csv_to_table" className="styleLinkMenu"><CodeSlashOutline cssClasses="text-black dark:text-white !w-[35px] !h-[35px]" /> <span>CSV to Table data</span></Link>
            <Link to="/json_to_table" className="styleLinkMenu"><CodeSlashOutline cssClasses="text-black dark:text-white !w-[35px] !h-[35px]" /> <span>JSON to Table data</span></Link>
            
            {/* <Link to="/convert_doc_txt" className="styleLinkMenu"><DocumentOutline cssClasses="text-black dark:text-white !w-[35px] !h-[35px]" /> <span>Converter DOC to TXT</span></Link>
            <Link to="/convert_txt_doc" className="styleLinkMenu"><DocumentOutline cssClasses="text-black dark:text-white !w-[35px] !h-[35px]" /> <span>Converter TXT to DOC</span></Link>
            <Link to="/xls_to_json" className="styleLinkMenu"><CodeSlashOutline cssClasses="text-black dark:text-white !w-[35px] !h-[35px]" /> <span>XLS to JSON</span></Link>
            <Link to="/xml_to_json" className="styleLinkMenu"><CodeSlashOutline cssClasses="text-black dark:text-white !w-[35px] !h-[35px]" /> <span>XML to JSON </span></Link>
            <Link to="/json_to_xml" className="styleLinkMenu"><CodeSlashOutline cssClasses="text-black dark:text-white !w-[35px] !h-[35px]" /> <span>JSON to XML</span></Link> */}
          </div>
        </div>
      </div>
    );
  };
};

export default Nav;