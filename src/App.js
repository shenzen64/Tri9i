import React from 'react'
import './app.scss';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from './components/Home';
import Map from './components/Map';
import SignUp from './components/SignUp';
import Login from './components/Login';
import CreateTrajet from './components/CreateTrajet';



const Routing = ()=> {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>

      <Route exact path="/map">
        <Map />
      </Route>
      <Route exact path="/signup">
        <SignUp />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>

      <Route exact path="/creer">
        <CreateTrajet />
      </Route>
    </Switch>
  )
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routing />
      </BrowserRouter>
    </div>
  );
}
export default App;
