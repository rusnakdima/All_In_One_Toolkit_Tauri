import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Link } from "react-router-dom";
import { ChevronBackCircleOutline } from "react-ionicons";

import { ENV } from "../env";
import WindNotify from "./WindNotify";

class About extends React.Component<{numWind: number, onChangeData: any}> {
  constructor(props: any) {
    super(props);
  }

  childRef: any = React.createRef();

  state = {
    dateVersion: localStorage['dateVersion'] || 'Unknown',
    dateCheck: localStorage['dateCheck'] || 'Unknown',
    lastVersion: '',
    pathUpdate: '',
    windUpdates: false,
    downloadProgress: false,
  }

  componentDidMount(): void {
    this.getDate();
    this.checkUpdates();
  }

  changeNumWind(numWind: number) {
    this.props.onChangeData(Number(numWind));
  }

  alertNotify(color: string, title: string) {
    this.childRef.current.alertNotify(color, title);
  }

  matchVersion(lastVer: string) {
    const v1Components = lastVer.split('.').map(Number);
    const v2Components = ENV.version.split('.').map(Number);

    for (let i = 0; i < Math.max(v1Components.length, v2Components.length); i++) {
      const v1Value = v1Components[i] || 0;
      const v2Value = v2Components[i] || 0;

      if (v1Value < v2Value) {
        return false;
      } else if (v1Value > v2Value) {
        return true;
      }
    }

    return false;
  }

  formatDate(date: string) {
    return new Date(date).toISOString().split("T")[0];
  }

  async getDate() {
    await fetch(`https://api.github.com/repos/rusnakdima/All_In_One_Toolkit_Tauri/releases/tags/v${ENV.version}`)
    .then(response => response.json())
    .then(json => {
      if (json && json.published_at) {
        localStorage['dateVersion'] = String(this.formatDate(json.published_at));
        this.setState({
          dateVersion: String(this.formatDate(json.published_at)),
        });
      } else {
        throw Error("Invalid request");
      }
    })
    .catch(err => {
      console.error(err);
      this.alertNotify("bg-red-700", "Error sending the request!");
    });
  }

  public async checkUpdates() {
    localStorage['dateCheck'] = String(this.formatDate(new Date().toUTCString()));
    this.setState({
      dateCheck: String(this.formatDate(new Date().toUTCString()))
    });
    await fetch('https://api.github.com/repos/rusnakdima/All_In_One_Toolkit_Tauri/releases/latest')
    .then(response => response.json())
    .then(json => {
      if (json && json.tag_name) {
        const lastVer: string = json.tag_name;
        setTimeout(() => {
          if (this.matchVersion(lastVer)) {
            this.alertNotify("bg-yellow-500", "A new version is available!");
            this.setState({
              windUpdates: true,
              lastVersion: lastVer
            });
          } else {
            this.alertNotify("bg-green-700", "You have the latest version!");
          }
        }, 1000);
      } else {
        throw Error("Invalid request");
      }
    })
    .catch(err => {
      console.error(err);
      this.alertNotify("bg-red-700", "Error sending the request!");
    });
  }

  async downloadFile() {
    this.setState({
      downloadProgress: true
    })
    this.alertNotify("bg-yellow-500", "Wait until the program update is downloaded!");
    await invoke("download_update", {"url": `https://github.com/rusnakdima/All_In_One_Toolkit_Tauri/releases/download/${this.state.lastVersion}/all_in_one_toolkit.exe`, "fileName": "all_in_one_toolkit.exe"})
    .then((data: any) => {
      if (data) {
        this.alertNotify("bg-green-700", "The new version of the program has been successfully downloaded!");
        this.setState({
          pathUpdate: data,
        });
      } else {
        throw Error(data);
      }
    })
    .catch((err: any) => {
      console.error(err)
      this.alertNotify("bg-red-700", `${err}`);
    });
    this.setState({
      windUpdates: false,
      downloadProgress: false
    });
  }

  async openFile() {
    await invoke("open_file", {'path': this.state.pathUpdate})
    .catch((err: any) => {
      console.error(err)
      this.alertNotify("bg-red-700", `${err}`);
    });
  }

  render() {
    return (
      <>
        <div className={`flex flex-col gap-y-5 ${(this.props.numWind > 2) ? 'w-full lg:w-1/3' : (this.props.numWind > 1) ? 'w-full lg:w-1/2' : 'w-full'}`}>
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
            <img alt="Icon program" src="/assets/images/icon.png" className="!w-1/5" />
            <span className="text-3xl font-bold">All In One Toolkit</span>
            <div className="mt-3 text-xl font-bold">
              <div className="flex flex-row gap-x-3 justify-center">
                <span className="text-gray-600 dark:text-gray-300">Version</span>
                <span>{ENV.version}</span>
              </div>
              <div className="flex flex-row gap-x-3 justify-center">
                <span className="text-gray-600 dark:text-gray-300">Date</span>
                <span>{this.state.dateVersion}</span>
              </div>
              <div className="flex flex-row gap-x-3 justify-center">
                <span className="text-gray-600 dark:text-gray-300">Author</span>
                <span>Dmitriy303</span>
              </div>
              <div className="flex flex-row gap-x-3 justify-center">
                <span className="text-gray-600 dark:text-gray-300">Company</span>
                <span>TechCraft Solutions</span>
              </div>
              <div className="flex flex-row gap-x-3 justify-center">
                <span className="text-gray-600 dark:text-gray-300">Year of creation</span>
                <span>2023</span>
              </div>
              <div className="flex flex-row gap-x-3 justify-center">
                <span className="text-gray-600 dark:text-gray-300">Date of last check</span>
                <span>{this.state.dateCheck}</span>
              </div>
            </div>
            <div className="text-xl font-bold mt-3">
              <span className="styleLink" onClick={() => {this.checkUpdates()}}> Check for updates...</span>
            </div>
            {this.state.pathUpdate != '' &&
              <div className="text-xl font-bold mt-3">
                <span className="styleLink" onClick={() => {this.openFile()}}>Open new version</span>
              </div>
            }
          </div>
        </div>

        {this.state.windUpdates &&
          <div className="styleBackWind">
            <div className="styleWind">
              <div className="border-b-2 pb-2 styleBorderSolid">
                <span className="text-xl font-bold">Updating the program</span>
              </div>
              <div className="flex flex-col my-3 gap-y-2">
                <span>Do you want to download the update?</span>
                {this.state.downloadProgress &&
                  <div className="w-full bg-gray-300 rounded-full mb-4 dark:bg-gray-700" style={{height: "20px"}}>
                    <div className="w-full rounded-full" style={{height: "20px", backgroundImage: 'repeating-linear-gradient( 45deg, transparent, transparent 10px, rgb(5 122 85) 10px, rgb(5 122 85) 20px )', animation: 'slide 4s linear infinite'}}></div>
                  </div>
                }
              </div>
              <div className="flex flex-row justify-end gap-x-3 pt-2 border-t-2 styleBorderSolid">
                <button className="styleBut" onClick={() => {this.setState({windUpdates: false})}}>No</button>
                <button className="styleBut" onClick={() => {this.downloadFile()}}>Yes</button>
              </div>
            </div>
          </div>
        }

        <WindNotify ref={this.childRef} />
      </>
    );
  };
};

export default About;