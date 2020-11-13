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
    this.updateBlock = this.updateBlock.bind(this);
   }
   updateBlock(id){
      let tags = document.getElementById(id);
      tags = tags.querySelector(".edit-tags");
      tags = tags.value
      let ogValue;
      arena
      .block(id)
      .get()
      .then(block => {
        ogValue = block.description;
        tags =  ogValue + " " + tags;
        arena.block(id).update({
          description: tags
        }).then(item => {
            document.getElementById('message').innerHTML = "submitted";
            setTimeout(function(){
              document.getElementById('message').innerHTML = "";
            }, 8000)
        });
      })
      .catch(console.error);
      
   }
   submitBlock(){
      let content = document.getElementById('block-content');
      let title = document.getElementById('block-title');
      let tags = document.getElementById('block-tags');
      arena.block().create("poetics-lab-site", {
        content: content.value,
        title: title.value,
        description: tags.value
      }).then(item => {
          document.getElementById('message').innerHTML = "submitted";
          setTimeout(function(){
            document.getElementById('message').innerHTML = "";
          }, 8000)
      });
   }

   render() {
    let {blocks} = this.props;
    let blocksClean = [];
    blocks.forEach((c) => {
        if (!blocksClean.includes(c)) {
            blocksClean.push(c);
        }
    });

    let allBlocks = blocksClean.map(block => {
      return (<div key={block.id} id={block.id} className='plain-block'>
          {block.title || "Untitled"}
          <br></br>
          <input
              className="edit-tags"
              type="text"
              placeholder="tags"
            /> 
            <button onClick={()=>this.updateBlock(block.id)}>submit</button>
          </div>)
    });
    return (

     <header className="App-header Homepage">
          <div className="makeBlock">
          <h1>Test Creating a Block Here:</h1>
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
            /> <br></br>
            <button onClick={this.submitBlock}>Create Block</button>
            <span id='message'></span>
          </div>
          <div className="edit-area">
            <h1>Try Adding Tags to Existing Blocks Here:</h1>
            {allBlocks}
          </div>
      </header>




    );
  }
}

export default Home
