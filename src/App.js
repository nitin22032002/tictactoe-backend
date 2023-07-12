import Home from "./component/Home";
import Leaderboard from "./component/Leaderboard";
import Navbar from "./component/Navbar";
import {Switch,Route} from "react-router-dom";
import PlayWindow from "./component/PlayWindow";
import Login from "./component/Login";
import DialogUser from "./component/Dialog";
function App() {
  return (
    <>
      <Navbar/>
      <DialogUser/>
    <Switch>
        <Route exact path="/leaderboard" >
            <Leaderboard/>
        </Route>
        <Route exact path="/play" >
              <PlayWindow/>
        </Route>
        <Route exact path="/" >
            <Home/>
        </Route>
        <Route exact path="/login" >
            <Login/>
        </Route>
    </Switch>
    </>
  );
}

export default App;
