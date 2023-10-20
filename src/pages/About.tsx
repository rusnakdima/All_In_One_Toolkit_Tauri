import React from "react";
import { Link } from "react-router-dom";
import { ChevronBackCircleOutline } from "react-ionicons";

import { ENV } from "../env";
import WindNotify from "./WindNotify";

class About extends React.Component<{numWind: number, onChangeData: any}> {
  constructor(props: any){
    super(props);
  }

  childRef: any = React.createRef();

  state = {
    dateLastUpdate: '',
    windUpdates: false,
  }

  changeNumWind = (numWind: number) => {
    this.props.onChangeData(Number(numWind));
  }

  alertNotify(color: string, title: string) {
    this.childRef.current.alertNotify(color, title);
  };

  matchVersion = (lastVer: string) => {
    let tempVer = lastVer.slice(1).split(".");
    let curVer = ENV.version.split(".");
    return (Number(tempVer[0]) > Number(curVer[0]) || Number(tempVer[1]) > Number(curVer[1]) || Number(tempVer[2]) > Number(curVer[2]));
  }

  formatDate = (date: string) => {
    return new Date(date).toISOString().split("T")[0];
  }

  getDate = async () => {
    await fetch('https://api.github.com/repos/rusnakdima/All_In_One_Toolkit_Tauri/releases/latest')
      .then(response => response.json())
      .then(json => {
        this.setState({
          dateLastUpdate: String(this.formatDate(json.published_at)),
        });
      })
      .catch(err => {
        console.error(err);
        this.alertNotify("bg-red-700", "Error sending the request!");
      });
  }

  checkUpdates = async () => {
    await fetch('https://api.github.com/repos/rusnakdima/All_In_One_Toolkit_Tauri/releases/latest')
      .then(response => response.json())
      .then(json => {
        if (this.matchVersion(json.tag_name)) {
          this.alertNotify("bg-yellow-500", "A new version is available!");
          this.setState({
            windUpdates: true
          });
        } else {
          this.alertNotify("bg-green-700", "You have the latest version!");
        }
      })
      .catch(err => {
        console.error(err);
        this.alertNotify("bg-red-700", "Error sending the request!");
      });
  }

  render () {
    this.getDate();
    return (
      <>
        <div className={`flex flex-col gap-y-5 ${(this.props.numWind > 2) ? 'w-1/3' : (this.props.numWind > 1) ? 'w-1/2' : 'w-full'}`}>
          <div className="flex flex-row justify-between items-center border-b-2 styleBorderSolid pb-2">
            <div className="flex flex-row gap-x-2 text-2xl font-bold">
              <Link to="/"><ChevronBackCircleOutline cssClasses="styleIonIcon" /></Link>
              <span>About program</span>
            </div>
            <select className="styleSelect !w-min" onChange={(event: any) => {this.changeNumWind(event.target.value)}} value={this.props.numWind}>
              <option value={1}>1 window</option>
              <option value={2}>2 windows</option>
              <option value={3}>3 windows</option>
            </select>
          </div>

          <div className="flex flex-col items-center">
            <img alt="Icon program" src="./assets/img/icon.png" className="!w-1/5" />
            <span className="text-3xl font-bold">All In One Toolkit</span>
            <div className="mt-3 text-xl font-bold">
              <div className="flex flex-row gap-x-3 justify-center">
                <span className="text-gray-600 dark:text-gray-300">Version</span>
                <span>{ENV.version}</span>
              </div>
              <div className="flex flex-row gap-x-3 justify-center">
                <span className="text-gray-600 dark:text-gray-300">Author</span>
                <span>Dmitriy303</span>
              </div>
              <div className="flex flex-row gap-x-3 justify-center">
                <span className="text-gray-600 dark:text-gray-300">Company</span>
                <span>DmitriyDev</span>
              </div>
              <div className="flex flex-row gap-x-3 justify-center">
                <span className="text-gray-600 dark:text-gray-300">Year of creation</span>
                <span>2023</span>
              </div>
              <div className="flex flex-row gap-x-3 justify-center">
                <span className="text-gray-600 dark:text-gray-300">Date of last update</span>
                <span>{this.state.dateLastUpdate}</span>
              </div>
            </div>
            <div className="text-xl font-bold mt-3">
              <button className="styleLink" onClick={this.checkUpdates}> Check for updates...</button>
            </div>
          </div>
        </div>

        {this.state.windUpdates && <div className="styleBackWind">
          <div className="styleWind">
            <div className="border-b-2 pb-2 styleBorderSolid">
              <span className="text-xl font-bold">Updating the program</span>
            </div>
            <div className="flex flex-col my-3">
              <span>Do you want to download the update?</span>
            </div>
            <div className="flex flex-row justify-end gap-x-3 pt-2 border-t-2 styleBorderSolid">
              <button className="styleBut" onClick={() => {this.setState({windUpdates: false})}}>No</button>
              <button className="styleBut" onClick={() => {this.setState({windUpdates: false}); window.open('https://github.com/rusnakdima/All_In_One_Toolkit_Tauri/releases/latest', 'blank')}}>Yes</button>
            </div>
          </div>
        </div>}

        <WindNotify ref={this.childRef} />
      </>
    );
  };
};

export default About;