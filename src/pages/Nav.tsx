import React from 'react';
import { Link } from "react-router-dom";
import { HomeOutline, InformationOutline } from "react-ionicons";

interface HomeState {
  recentAction: Array<{ to: string; icon: string; name: string }>;
}

class Nav extends React.Component<{}, HomeState> {
  state: HomeState = {
    recentAction: [],
  };

  componentDidMount(): void {
    let recAct = localStorage["recAct"];
    if(recAct && recAct != ''){
      this.setState({
        recentAction: JSON.parse(recAct)
      });
    }
  }

  addLink(to: string, icon: string, name: string): void{
    let tempObj = { "to": to, "icon": icon, "name": name };
    if(!this.state.recentAction.find((item: any) => item['to'] == tempObj['to'])){
      this.state.recentAction.unshift(tempObj)
    } else {
      this.state.recentAction.splice((this.state.recentAction.findIndex((item: any) => item == tempObj)), 1);
      this.state.recentAction.unshift(tempObj);
    }
    if(this.state.recentAction.length > 4) this.state.recentAction.pop();
    localStorage["recAct"] = JSON.stringify(this.state.recentAction);
  }

  render(){
    return (
      <div className="fixed top-0 left-0 m-0 p-0 z-40 w-full h-screen -translate-x-full bg-white/60 dark:bg-black/30" id="menuBack">
        <div className="w-64 p-4 bg-gray-200 dark:bg-zinc-800 h-screen transition-transform -translate-x-full">
          <span className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">Menu</span>
          <div className="flex flex-col py-4 overflow-y-auto h-full space-y-2 font-medium">
            <Link to="/" className="styleLinkMenu"><HomeOutline cssClasses="styleIonIcon" /> <span>Home</span></Link>
            <Link to="/about" className="styleLinkMenu"><InformationOutline cssClasses="styleIonIcon" /> <span>About</span></Link>
          </div>
        </div>
      </div>
    );
  };
};

export default Nav;