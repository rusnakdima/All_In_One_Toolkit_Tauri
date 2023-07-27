import React from "react";

class VirusTotal extends React.Component {
  urlInput: string = "";

  reqFun = () => {
    const resDiv = document.querySelector("#result") as HTMLDivElement | null;
    if (resDiv != null) {
      resDiv.setAttribute("style", "display: block");
      resDiv.innerHTML = "";

      const url = btoa(this.urlInput).replace(/=/g, "");
      const apiKey = "7a8e8b508ecbba8020e949da7d4edb85d64c55429d04593884c2cececad685d1";
      const apiUrl = `https://www.virustotal.com/api/v3/urls/${encodeURIComponent(url)}`;

      const params = new URLSearchParams();
      params.set('url', url);

      fetch(apiUrl, {
        method: "GET",
        headers: {
          "accept": 'application/json',
          "x-apikey": apiKey
        }
      }).then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Request error to the VirusTotal API!");
      }).then(json => {
        const colors = ["green-600", "yellow-300", "orange-500", "red-600"];

        const positives = json.data.attributes.last_analysis_stats.malicious || 0;
        const total = Object.keys(
          json.data.attributes.last_analysis_results
        ).length;

        const div = document.createElement("div");
        div.setAttribute("class", "flex flex-col mx-auto w-[200px] h-[200px] mb-5");
        const div1 = document.createElement("div");
        const color = colors[Math.floor((positives / total) * colors.length)];
        div1.setAttribute("class", `flex flex-row rounded-full justify-center items-center border-solid border-4 border-${color} w-full h-full`);
        const span = document.createElement("span");
        span.innerHTML = String(positives);
        span.setAttribute("class", `text-${color} text-5xl`);
        const span1 = document.createElement("span");
        span1.innerHTML = "/" + total;
        span1.setAttribute("class", "text-black dark:text-white text-3xl");
        div1.appendChild(span);
        div1.appendChild(span1);
        div.appendChild(div1);
        resDiv.appendChild(div);

        const textBefList = document.createElement("span");
        textBefList.innerHTML = "List of antiviruses with scan results";
        textBefList.setAttribute("class", "flex felx-col text-xl font-bold justify-center");
        resDiv.appendChild(textBefList);

        const resultList1 = document.createElement("div");
        resultList1.setAttribute("class", "flex flex-row flex-wrap justify-center gap-3");

        var sites_analysis = json.data.attributes.last_analysis_results;

        Object.values(sites_analysis).forEach((elem: any) => {
          const resultItem = document.createElement("div");
          resultItem.setAttribute("class", "flex flex-col justify-center items-center rounded-lg p-2 bg-gray-300 dark:bg-gray-800 !w-[150px] !h-[150px]");

          const engineName = elem.engine_name;
          const result = elem.result;

          const getIcon = () => {
            if(result == "clean"){
              return '<svg class="!text-green-600 !w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M352 176L217.6 336 160 272"></path></svg>'
            } else if(result == "suspicious"){
              return '<svg class="!text-orange-500 !w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M248 64C146.39 64 64 146.39 64 248s82.39 184 184 184 184-82.39 184-184S349.61 64 248 64z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M220 220h32v116"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M208 340h88"></path><path d="M248 130a26 26 0 1026 26 26 26 0 00-26-26z" style="fill: rgb(255 90 31) !important;"></path></svg>'
            } else if(result == "malware"){
              return '<svg class="!text-red-600 !w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"></path><path d="M250.26 166.05L256 288l5.73-121.95a5.74 5.74 0 00-5.79-6h0a5.74 5.74 0 00-5.68 6z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path><path d="M256 367.91a20 20 0 1120-20 20 20 0 01-20 20z" style="fill: rgb(224 36 36) !important;"></path></svg>'
            } else {
              return '<svg class="!text-gray-500 !w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M160 164s1.44-33 33.54-59.46C212.6 88.83 235.49 84.28 256 84c18.73-.23 35.47 2.94 45.48 7.82C318.59 100.2 352 120.6 352 164c0 45.67-29.18 66.37-62.35 89.18S248 298.36 248 324" fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="40"></path><circle cx="248" cy="399.99" r="32" style="fill: rgb(107 114 128) !important;"></circle></svg>'
            }
          }

          const spanEng = document.createElement("span");
          spanEng.innerHTML = engineName;
          
          resultItem.innerHTML = `${getIcon()} <span>${engineName}</span>`;
          resultList1.appendChild(resultItem);
        });

        resDiv.appendChild(resultList1);
      }).catch(error => {
        console.error(error);
        resDiv.textContent = `An error has occurred: ${error.message}`;
      });
    }
  };

  render() {
    return (
      <div className="flex flex-col">
        <div className="flex flex-col gap-y-3">
          <span className="text-2xl font-bold border-b-2 styleBorderSolid">Checking the link via VirusTotal</span>

          <label className="styleLabel">Enter the link:</label>
          <input className="styleField" type="text" onChange={(event: any) => {this.urlInput = event.target.value;}}/>
          <button className="styleBut w-min" onClick={() => {this.reqFun();}}>Check</button>
        </div>

        <div id="result" className="border styleBorderSolid p-3 rounded-lg mt-3" style={{ display: "none" }}></div>
        <span className="border-green-600 text-green-600"></span>
        <span className="border-yellow-300 text-yellow-300"></span>
        <span className="border-orange-500 text-orange-500"></span>
        <span className="border-red-600 text-red-600"></span>
        <span className="text-gray-500"></span>
      </div>
    );
  }
}

export default VirusTotal;
