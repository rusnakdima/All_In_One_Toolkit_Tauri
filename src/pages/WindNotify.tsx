import React from "react";

import { NotificationsOutline, CloseOutline } from "react-ionicons";

class WindNotify extends React.Component {
  state = {
    windNotify: false,
    blockTable: false,
    notText: "",
    width: 0
  };
  interval: any;

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
        if (this.interval) {
          clearInterval(this.interval);
        }

        this.setState({
          width: 100
        });

        timeNotify.style.width = `${this.state.width}%`;

        this.interval = setInterval(() => {
          this.state.width -= 0.3;
          if (this.state.width < 0) {
            this.setState({
              width: 0,
              windNotify: false
            });
            clearInterval(this.interval);
          }
          if (timeNotify != null) timeNotify.style.width = `${this.state.width}%`;
        }, 10);
      }
    }, 10);
  };

  render () {
    return (
      <>
        {this.state.windNotify && <div id="windNotify" className="styleWindNotify">
          <div className="flex flex-row p-3 items-start">
            <div className="flex flex-col">
              <div className="flex flex-row gap-x-2">
                <NotificationsOutline cssClasses={"!text-white !fill-white !w-8 !h-8"} />
                <span className="text-2xl">Notification</span>
              </div>
              <span>{this.state.notText}</span>
            </div>
            <button onClick={() => {this.setState({windNotify: false})}}>
              <CloseOutline cssClasses={"!text-white !w-7 !h-7"} />
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