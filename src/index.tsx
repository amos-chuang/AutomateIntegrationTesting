import * as React from "react";
import * as ReactDOM from "react-dom";

/*const App = () => {
  return (
    <div>
      <p>Hello world...!!</p>
      <LineChart name="abc" width={500} height={500} />
    </div>
  )
}*/

class App extends React.Component<any, any> {
  public render() {
    return (
      <div>
        <p>Hello world...!!??_ (index)</p>
        <hr />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
