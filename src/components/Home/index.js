import React, { Component } from 'react';
import ReactMarkdown from "react-markdown";
import ReactHtmlParser from "react-html-parser";
import './style.css';
import { MdCallMade } from 'react-icons/md';
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
            document.getElementById('message'+id).innerHTML = "submitted";
            setTimeout(function(){
              document.getElementById('message'+id).innerHTML = "";
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

    let allBlocks = blocksClean.map( (block, index) => {
      console.log(block)
      if(block.class != "Channel"){
      return (<div key={block.id + index} id={block.id} className='plain-block'>
          <a href={"are.na/block/"+block.id}>{block.title || "Untitled"} <MdCallMade /></a>
          <div className="content">
          {block.class == "Image" ?
            (<img src={block.image.square.url} />) :""
          }
          {block.class == "Media" ?
            (<div>{ReactHtmlParser(block.embed.html)} </div>) :""
          }
          {block.class == "Attachment" ?
            (<div>{ReactHtmlParser("<iframe width='400' height='400' src="+block.attachment.url+"</iframe>")} </div>) :""
          }
          {block.class == "Text" ?
            (<div className="text-block">{ReactHtmlParser(block.content_html)} </div>) :""
          }
          </div>
           <em className="tags">{"tags: " + block.description || "no existing tags"}</em>
          <br></br>
          <input
              className="edit-tags"
              type="text"
              placeholder="tags"
            /> 
            <button onClick={()=>this.updateBlock(block.id)}>submit</button>
            <br></br>
            <span className="message" id={"message"+block.id}></span>
           
          </div>)
    }
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
