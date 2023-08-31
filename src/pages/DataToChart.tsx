import React from 'react';

import * as XLSX from 'xlsx';

import WindNotify from "./WindNotify";

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";

ChartJS.register( CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false
    },
  },
};

class DataToChart extends React.Component {
  childRef: any = React.createRef();

  file: any = null;
  dataField: string = "";
  columns: number = 0;
  rows: number = 0;
  
  state = {
    blockTable: false,
    blockChart: false,
    outChart: false,
    chartType: "bar",
    dataChart: {
      labels: [],
      datasets: [],
    }
  }

  alertNotify(color: string, title: string) {
    this.childRef.current.alertNotify(color, title);
  };

  createTableFun(data: any){
    this.setState({
      blockTable: true,
      blockChart: true
    })
    setTimeout(() => {
      const dataTable = document.querySelector("#dataTable") as HTMLTableElement | null;
      if(dataTable != null){
        dataTable.innerHTML = "";
  
        this.rows = data.length;
        this.columns = data[0].length;
        let thead = document.createElement("thead");
        let tr = document.createElement("tr");
        data[0].forEach((val: any) => {
          let th = document.createElement("th");
          th.innerHTML = val;
          th.setAttribute("class", "styleTD");
          th.contentEditable = "true";
          tr.appendChild(th);
        });
        thead.appendChild(tr);
        dataTable.appendChild(thead);
  
        data.splice(0, 1);
        let tbody = document.createElement("tbody");
        data.forEach((elem: any) => {
          let tr = document.createElement("tr");
          elem.forEach((val: any) => {
            let td = document.createElement("td");
            td.innerHTML = val;
            td.setAttribute("class", "styleTD w-min h-[40px] p-5");
            td.contentEditable = "true";
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });
        dataTable.appendChild(tbody);
      }
    }, 20);
  };

  createTableFileData = () => {
    if(this.file != null){
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const text = (e.target.result);
        const workbook = XLSX.read(text, {type:'binary'});
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        this.createTableFun(data);
      }
      reader.readAsBinaryString(this.file)

    } else {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    }
  };

  createTableFieldData = () => {
    if(this.dataField != ''){
      let data = this.dataField.split("\n").map((elem) => elem.split("\t"))
      this.createTableFun(data);
    } else {
      this.alertNotify("bg-red-700", "The field is empty! Insert the data!");
    }
  };

  createTableManual = () => {
    if(this.columns > 0 && this.rows > 0){

      let data = [];
      for(let i = 0; i < this.rows; i++){
        let tempArr = [];
        for(let j = 0; j < this.columns; j++){
          tempArr.push("");
        }
        data.push(tempArr);
      }

      this.createTableFun(data);
    } else {
      this.alertNotify("bg-red-700", "The fields are empty! Enter the data!");
    }
  };

  createChart = () => {
    this.setState({
      outChart: true
    });
    setTimeout(() => {
      const dataTable = document.querySelector("#dataTable") as HTMLTableElement | null;
      const outChart = document.querySelector("#outChart") as HTMLDivElement | null;
      if(dataTable != null && outChart != null) {
        const data: any[] = [];
        const rowLab: any[] = [];
        const colLab: any[] = [];
        for (let i = 0; i < this.rows; i++) {
          let row = dataTable.rows[i];
          let rowData = [];
          for (let j = 0; j < this.columns; j++) {
            let cell = row.cells[j];
            if (i === 0 && j > 0) {
              colLab.push(cell.innerHTML);
            } else if (i > 0 && j === 0) {
              rowLab.push(cell.innerHTML);
            } else if (i != 0 && j != 0) {
              rowData.push(cell.innerHTML);
            }
          }
          if (rowData.length > 0) data.push(rowData);
        }
  
        this.setState({
          dataChart: {
            labels: colLab,
            datasets: data.map((rowData, index) => ({
              label: `${rowLab[index]}`,
              data: rowData,
              backgroundColor: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
            })),
          }
        });
      }
    }, 50);
  };

  render(){
    return (
      <>
        <div className="flex flex-col">
          <span className="text-2xl font-bold border-b-2 styleBorderSolid">Visualization data on chart</span>

          <details className="styleDetails">
            <summary>
              <span className="text-xl font-bold">Select a tabular document with data</span>
            </summary>

            <div className="flex flex-col gap-y-3">
              <input className="styleFileInput" type="file" onChange={(event: any) => {this.file = event.target.files[0]}} accept=".xls, .xlsx, .xlsm" />
              <button className="styleBut w-max" onClick={() => {this.createTableFileData()}}>Create a table</button>
            </div>
          </details>

          <details className="styleDetails">
            <summary>
              <span className="text-xl font-bold">Insert data from a table (copy a table from any source)</span>
            </summary>

            <div className="flex flex-col gap-y-3">
              <textarea className="styleTextarea" onChange={(event: any) => {this.dataField = event.target.value}} rows={7}></textarea>
              <button className="styleBut w-max" onClick={() => {this.createTableFieldData()}}>Create a table</button>
            </div>
          </details>

          <details className="styleDetails">
            <summary>
              <span className="text-xl font-bold">Enter all the data manually</span>
            </summary>

            <div className="flex flex-col gap-y-3">
              <div className="flex flex-row gap-x-3">
                <div className="flex flex-col gap-y-3">
                  <label className="styleLabel">Number of columns:</label>
                  <input className="styleField" type="number" defaultValue={0} onChange={(event: any) => {this.columns = parseInt(event.target.value)}} />
                </div>
                <div className="flex flex-col gap-y-3">
                  <label className="styleLabel">Number of rows:</label>
                  <input className="styleField" type="number" defaultValue={0} onChange={(event: any) => {this.rows = parseInt(event.target.value)}} />
                </div>
              </div>
              
              <button className="styleBut w-max" onClick={() => {this.createTableManual()}}>Create a table</button>
            </div>
          </details>

          {this.state.blockTable && <div className="flex flex-col gap-y-2">
            <span className="text-2xl font-bold">Table data</span>
            <table id="dataTable" className="border styleBorderSolid"></table>
          </div>}

          {this.state.blockChart && <div className="flex flex-col gap-y-3">
            <label className="styleLabel">Select the chart type:</label>
            <select className="styleSelect" defaultValue="bar" onChange={(event: any) => {this.state.chartType = event.target.value; console.log(event.target.value)}}>
              <option value="bar">Bar chart</option>
              <option value="line">Line chart</option>
              <option value="pie">Pie chart</option>
              <option value="doughnut">Donat chart</option>
            </select>

            <button className="styleBut w-max" onClick={() => {this.createChart()}}>Create a diagram</button>

            {this.state.outChart && <div id="outChart" className="bg-white text-black">
              {this.state.chartType == "bar" && <Bar options={options} data={this.state.dataChart} />}
              {this.state.chartType == "line" && <Line options={options} data={this.state.dataChart} />}
              {this.state.chartType == "pie" && <Pie options={options} data={this.state.dataChart} />}
              {this.state.chartType == "doughnut" && <Doughnut options={options} data={this.state.dataChart} />}
            </div>}
          </div>}
        </div>

        <WindNotify ref={this.childRef} />
      </>
    );
  };
};

export default DataToChart;