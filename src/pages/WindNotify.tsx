import React from "react";

import { AlertCircleOutline, CloseCircleOutline } from "react-ionicons";

class WindNotify extends React.Component {
  state = {
    windNotify: false,
    blockTable: false,
    notText: ""
  };

  alertNotify(color: string, title: string) {
    this.setState({
      windNotify: true
    })
    setTimeout(() => {
      let notify = document.querySelector("#windNotify") as HTMLDivElement | null;
      if (notify != null) notify.classList.add(color);
      this.setState({
        notText: title
      });
      
      let timeNotify = document.querySelector("#timeNotify") as HTMLDivElement | null;
      if (timeNotify != null) {
        if(timeNotify.style.width != '') if(+timeNotify.style.width.split('').slice(0, -1).join('') > 0) return;
        let width = 100;
        timeNotify.style.width = `${width}%`;
    
        const interval = setInterval(() => {
          width -= 0.3;
          if (width < 0) {
            width = 0;
            clearInterval(interval);
            this.setState({
              windNotify: false
            });
          }
          if (timeNotify != null) timeNotify.style.width = `${width}%`;
        }, 10);
      }
    }, 10);
  };

  render () {
    return (
      <>
        {this.state.windNotify && <div id="windNotify" className="styleWindNotify">
          <div className="flex flex-row p-3 items-center">
            <AlertCircleOutline cssClasses={"!text-white !fill-white !w-10 !h-10 !mr-3"} />
            <div className="flex flex-col">
              <span className="text-2xl">Notification</span>
              <span>{this.state.notText}</span>
            </div>
            <button onClick={() => {this.setState({windNotify: false})}}>
              <CloseCircleOutline cssClasses={"!text-white !w-10 !h-10"} />
            </button>
          </div>
          <div className="flex flex-col mb-1 bg-white w-full h-1" id="timeNotify"></div>
        </div>}
        <span className="hidden bg-green-700"></span>
        <span className="hidden bg-red-700"></span>
      </>
    );
  };
};

export default WindNotify;