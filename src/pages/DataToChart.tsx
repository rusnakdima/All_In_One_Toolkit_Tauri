import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronBackCircleOutline } from 'react-ionicons';

import * as XLSX from 'xlsx';

import WindNotify from "./WindNotify";

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const options = {
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

class DataToChart extends React.Component<{numWind: number, onChangeData: any}> {
  constructor(props: any){
    super(props);
  }

  childRef: any = React.createRef();

  file: any = null;
  dataField: string = "";
  columns: number = 0;
  rows: number = 0;
  
  state = {
    blockTable: false,
    blockChart: false,
    outChart: false,
    dataTable: {"thead": [], "tbody": []},
    chartType: "bar",
    dataChart: {
      labels: [],
      datasets: [],
    }
  }

  changeNumWind(numWind: number) {
    this.props.onChangeData(Number(numWind));
  }

  alertNotify(color: string, title: string) {
    this.childRef.current.alertNotify(color, title);
  }

  createTableFun(dataArr: any[]) {
    this.setState({
      blockTable: true,
      blockChart: true
    });
    setTimeout(() => {
      this.rows = dataArr.length;
      this.columns = dataArr[0].length;
      let tempHead: Array<any> = [];
      dataArr[0].forEach((val: any) => {
        tempHead.push(val);
      });
      let tempBody: Array<any> = [];
      dataArr.splice(0, 1);
      dataArr.forEach((row: any) => {
        let tempRow: Array<any> = [];
        row.forEach((val: any) => {
          tempRow.push(val);
        });
        tempBody.push(tempRow);
      });
      this.setState({
        dataTable: {
          "thead": tempHead,
          "tbody": tempBody,
        }
      });
    }, 20);
  }

  createTableFileData() {
    if(this.file != null){
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const text = (e.target.result);
        const workbook = XLSX.read(text, {type:'binary'});
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const dataArr = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        this.createTableFun(dataArr);
      }
      reader.readAsBinaryString(this.file);
    } else {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    }
  };

  createTableFieldData() {
    if(this.dataField != ''){
      const dataArr = this.dataField.split("\n").map((elem) => elem.split("\t"))
      this.createTableFun(dataArr);
    } else {
      this.alertNotify("bg-red-700", "The field is empty! Insert the data!");
    }
  }

  createTableManual() {
    if(this.columns > 0 && this.rows > 0){
      let dataArr = [];
      for(let i = 0; i < this.rows; i++){
        let tempArr = [];
        for(let j = 0; j < this.columns; j++){
          tempArr.push("");
        }
        dataArr.push(tempArr);
      }

      this.createTableFun(dataArr);
    } else {
      this.alertNotify("bg-red-700", "The fields are empty! Enter the data!");
    }
  }

  createChart() {
    this.setState({
      outChart: true
    });
    setTimeout(() => {
      const data: any[] = this.state.dataTable.tbody.map((item: any) => item.slice(1).map((item1: any) => item1));
      const rowLab: any[] = this.state.dataTable.tbody.map((item: any) => item[0]);
      const colLab: any[] = this.state.dataTable.thead.map((item: any) => item).slice(1);

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
    }, 50);
  }

  render() {
    return (
      <>
        <div className={`flex flex-col gap-y-5 ${(this.props.numWind > 2) ? 'w-1/3' : (this.props.numWind > 1) ? 'w-1/2' : 'w-full'}`}>
          <div className="flex flex-row justify-between items-center border-b-2 styleBorderSolid pb-2">
            <div className="flex flex-row gap-x-2 text-2xl font-bold">
              <Link to="/"><ChevronBackCircleOutline cssClasses="styleIonIcon" /></Link>
              <span>Visualization data on chart</span>
            </div>
            <select className="styleSelect !w-min" onChange={(event: any) => {this.changeNumWind(event.target.value)}} value={this.props.numWind}>
              <option value={1}>1 window</option>
              <option value={2}>2 windows</option>
              <option value={3}>3 windows</option>
            </select>
          </div>

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
            <table className="border styleBorderSolid">
              <thead>
                <tr>
                  {this.state.dataTable.thead.map((cell: any, index: number) => {
                    return <th className='styleTD' suppressContentEditableWarning={true} contentEditable={true} key={index}>{cell}</th>
                  })}
                </tr>
              </thead>
              <tbody>
                {this.state.dataTable.tbody.map((row: any, index: number) => {
                  return <tr key={index}>
                    {row.map((cell: any, index1: number) => {
                      return <td className='styleTD w-min h-[40px] p-5' suppressContentEditableWarning={true} contentEditable={true} key={index1}>{cell}</td>
                    })}
                  </tr>
                })}
              </tbody>
            </table>
          </div>}

          {this.state.blockChart && <div className="flex flex-col gap-y-3">
            <label className="styleLabel">Select the chart type:</label>
            <select className="styleSelect" defaultValue="bar" onChange={(event: any) => {this.setState({chartType: event.target.value})}}>
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