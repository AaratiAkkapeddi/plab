import React, { Component } from 'react';
import ReactMarkdown from "react-markdown";
import './style.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Arena from "are.na"

let arena = new Arena({ accessToken: process.env.REACT_APP_ARENA_ACCESS_TOKEN });

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };
    this.submitBlock = this.submitBlock.bind(this);
   }
   submitBlock(){
      let content = document.getElementById('block-content');
      let title = document.getElementById('block-title');
      let tags = document.getElementById('block-tags');
      arena.block().create("poetics-lab-site", {
        content: content.value,
        title: title.value,
        description: tags.value
      });
   }

   render() {
    let {blocks} = this.props;
    let allBlocks = blocks.map(block => {
      return (<div className='plain-block'>{block.title || "Untitled"}</div>)
    });
    return (

     <header className="App-header Homepage">
          <div className="makeBlock">
            <input
              id="block-title"
              className="medium-text"
              type="text"
              placeholder="Title"
            /> 
            <input
              id="block-content"
              className="medium-text"
              type="text"
              placeholder="Content"
            /> 
            <input
              id="block-tags"
              className="medium-text"
              type="text"
              placeholder="Tags"
            /> 
            <button onClick={this.submitBlock}>Create Block</button>
          </div>

          {allBlocks}
      </header>




    );
  }
}

export default Home
