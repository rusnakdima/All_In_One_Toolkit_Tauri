import React from "react";
import { ChevronBackCircleOutline } from "react-ionicons";
import { Link } from "react-router-dom";

class KeyCode extends React.Component<{numWind: number, onChangeData: any}> {
  constructor(props: any) {
    super(props);
  }

  state = {
    isShow: false,
    keyCode: 0,
    key: '',
    code: ''
  }

  changeNumWind(numWind: number) {
    this.props.onChangeData(Number(numWind));
  }

  componentDidMount(): void {
    document.addEventListener("keydown", (event: any) => {
      // console.log(event)
      this.setState({
        isShow: true,
        keyCode: event.keyCode | event.which,
        key: event.key,
        code: event.code,
      });
    });
  }

  search(value: string) {
    console.log(value)
    const event = new KeyboardEvent('keydown', { key: value });
    document.dispatchEvent(event);
  }

  render() {
    return (
      <div className={`flex flex-col gap-y-5 ${(this.props.numWind > 2) ? 'w-full lg:w-1/3' : (this.props.numWind > 1) ? 'w-full lg:w-1/2' : 'w-full'}`}>
        <div className="flex flex-row justify-between items-center border-b-2 styleBorderSolid pb-2">
          <div className="flex flex-row gap-x-2 text-2xl font-bold">
            <Link to="/"><ChevronBackCircleOutline cssClasses="styleIonIcon" /></Link>
            <span>JavaScript Key Code Event</span>
          </div>
          <select className="styleSelect !w-min" onChange={(event: any) => {this.changeNumWind(event.target.value)}} value={this.props.numWind}>
            <option value={1}>1 window</option>
            <option value={2}>2 windows</option>
            <option value={3}>3 windows</option>
          </select>
        </div>

        {/* <div className="flex flex-col items-end">
          <input type="text" placeholder="Search" onChange={(event: any) => {this.search(event.target.value)}} className="styleField !w-auto" />
        </div> */}

        {!this.state.isShow &&
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center rounded-xl styleBorderSolid border-2 p-5">
              <span className="text-2xl">Press any key to get the</span>
              <span className="text-2xl">JavaScript event keycode info</span>
            </div>
          </div>
        }
        {this.state.isShow &&
          <div className="flex flex-col gap-y-5 items-center">
            <span className="text-2xl">JavaScript Key Code</span>
            <span className="text-6xl font-bold">{this.state.keyCode}</span>
            <span className="text-xl">Key Code Information</span>

            <div className="flex flex-row gap-x-5">
              <div className="styleBorderSolid border !border-blue-700 w-[200px] h-[200px]">
                <div className="flex flex-col h-[40px] items-center p-2 text-white bg-blue-700 dark:bg-blue-700">
                  <span>event.key</span>
                </div>
                <div className="flex flex-col h-[160px] justify-center items-center">
                  <span className="text-xl font-bold">{(this.state.key == " ") ? '(blank space)' : this.state.key}</span>
                </div>
              </div>

              <div className="styleBorderSolid border !border-blue-700 w-[200px] h-[200px]">
                <div className="flex flex-col h-[40px] items-center p-2 text-white bg-blue-700 dark:bg-blue-700">
                  <span>event.code</span>
                </div>
                <div className="flex flex-col h-[160px] justify-center items-center">
                  <span className="text-xl font-bold">{this.state.code}</span>
                </div>
              </div>

              <div className="styleBorderSolid border !border-blue-700 w-[200px] h-[200px]">
                <div className="flex flex-col h-[40px] items-center p-2 text-white bg-blue-700 dark:bg-blue-700">
                  <span>event.which</span>
                </div>
                <div className="flex flex-col h-[160px] justify-center items-center">
                  <span className="text-xl font-bold">{this.state.keyCode}</span>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  };
};

export default KeyCode;