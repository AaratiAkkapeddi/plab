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
import Airtable from "airtable";
const base = new Airtable({ apiKey: process.env.REACT_APP_AIRTABLE_API_KEY }).base("appCCIW2wLHB8NCYK");


let arena = new Arena({ accessToken: process.env.REACT_APP_ARENA_ACCESS_TOKEN });

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
     blocksClean: []
    };
    this.submitBlock = this.submitBlock.bind(this);
    this.updateBlock = this.updateBlock.bind(this);
    this.handleNew = this.handleNew.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
   }
  componentDidMount(){
    let {blocks,records} = this.props;
    let blocksCleanArr = [];

    blocks.forEach((c) => {
       
        let unique = true;
        for (var i = blocksCleanArr.length - 1; i >= 0; i--) {
          if(blocksCleanArr[i].id == c.id){
            console.log('oops')
            unique = false;
          } 
        }

        if(unique){
          blocksCleanArr.push(c);
        }
    });
    console.log(blocksCleanArr)
    this.setState({blocksClean: blocksCleanArr})

    blocksCleanArr.forEach((c) => {
       // console.log('<3' + c.id)
        let makeNew = true;
        for (var i = records.length - 1; i >= 0; i--) {
          if(records[i].fields["BlockId"] == c.id.toString()){
            makeNew = false
 
          } 
        }

        if (makeNew ) {
        this.handleNew(c.title, c.id, c.description)
        }else{
        
        }
    });
  }
  handleNew(title,blockId,tags) {
     //save roses in cloudinary
    //const dataURI = document.getElementsByTagName("canvas")[0].getAttribute("data-uri");
    //const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/upload`;

    const submissionArray = [
      {
        fields: {
          Title: title,
          BlockId: blockId.toString(),
          Tags: tags
        },
      },
    ];
    base("TagIndex").create(submissionArray);


  }

  handleUpdate(airtableId, title, blockId, tags) {
    //save roses in cloudinary
   // const dataURI = document.getElementsByTagName("canvas")[0].getAttribute("data-uri");
   // const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/upload`;

     const submissionArray = [
      {
        id: airtableId,
        fields: {
          title: title,
          blockId: blockId,
          tags: tags
        },
      },
    ];
    base("TagIndex").update(submissionArray);


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
    let {blocks,records} = this.props;
    // const {blocksClean} = this.state;
    let blocksClean = [];

    blocks.forEach((c) => {
       
        let unique = true;
        for (var i = blocksClean.length - 1; i >= 0; i--) {
          if(blocksClean[i].id == c.id){
            console.log('oops')
            unique = false;
          } 
        }

        if(unique){
          blocksClean.push(c);
        }
    });
    let allBlocks = blocksClean.map( (block, index) => {

      if(block.class != "Channel"){
        let mew = null
        for (var i = records.length - 1; i >= 0; i--) {
          if(records[i].fields["BlockId"] == block.id){
            mew = records[i].fields["Tags"]
            if(mew == undefined){
              mew = ''
            }
          }
        }
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
           <em className="tags">{"tags: " + mew || "tags: " + block.description || "no existing tags"}</em>
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
