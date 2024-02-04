import React from "react";
import { ChevronBackCircleOutline } from "react-ionicons";
import { Link } from "react-router-dom";

class VisualArray extends React.Component<{numWind: number, onChangeData: any}> {
  constructor(props: any) {
    super(props);
  }

  state = {
    array: []
  }

  changeNumWind(numWind: number) {
    this.props.onChangeData(Number(numWind));
  }

  executeCode(data: any) {
    // console.log(data)
    setTimeout(() => {
      try {
        data += "\nreturn array;"
        const result = new Function(data)();
        // console.log(result)
        this.setState({
          array: result
        });
      } catch (error) {
        // console.error(error);
      }
    }, 1500);
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

        <div className="flex flex-col gap-y-5">
          <div className="flex flex-col">
            <textarea className="styleTextarea" cols={30} rows={10} onChange={(e: any) => this.executeCode(e.target.value)} defaultValue="const array = [];"></textarea>
          </div>

          <div className="flex flex-col styleBorderSolid border p-5">
            {this.state.array.length == 0 && <span>The array is empty</span>}
            <div className="flex flex-row flex-wrap gap-3">
              {this.state.array.length > 0 &&
                this.state.array.map((elem: any, index: number) => (
                  <div className="px-5 py-3 styleBorderSolid border flex flex-col justify-center items-center" key={index}>
                    <span className="text-3xl">{elem}</span>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

      </div>
    );
  };
};

export default VisualArray;