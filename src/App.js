import React, { useEffect } from 'react'
import './app.scss';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from './components/Home';
import Map from './components/Map';
import SignUp from './components/SignUp';
import Login from './components/Login';
import CreateTrajet from './components/CreateTrajet';
import User from './components/User';
import { useStateValue } from './context/StateProvider';
import Header from './components/Header';



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

      <Route exact path="/profil">
        <User />
      </Route>
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useStateValue();
  useEffect(() => {
   
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        dispatch({ type: "SET_USER", user });
      } 
  }, []);
  
  return (
    <div className="App">
      <BrowserRouter> 
        <Header />
        <Routing />
      </BrowserRouter>
    </div>
  );
}
export default App;
