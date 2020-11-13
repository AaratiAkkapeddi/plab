import React, { Component } from 'react';
import ReactMarkdown from "react-markdown";
import './style.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };

   }

   render() {

    return (

     <header className="App-header Homepage">
          Hello World
      </header>




    );
  }
}

export default Home
