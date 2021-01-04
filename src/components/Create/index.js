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

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title:"",
      text: "",
      resonances:"",
      node:""
    };
    this.handleNew = this.handleNew.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeText = this.handleChangeText.bind(this);
    this.handleChangeResonances = this.handleChangeResonances.bind(this);
   }
  componentDidMount(){

  }

  handleChangeTitle(event) {
    this.setState({ title: event.target.value });
  }

  handleChangeText(event) {
    this.setState({ text: event.target.value });
  }

  handleChangeResonances(event) {
    this.setState({ resonances: event.target.value });
  }

  handleNew() {
     //save roses in cloudinary
    //const dataURI = document.getElementsByTagName("canvas")[0].getAttribute("data-uri");
    //const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/upload`;
    const {title, text, resonances} = this.state
    const submissionArray = [
      {
        fields: {
          Title: title,
          Text: text,
          Resonances: resonances
        },
      },
    ];
    const that = this;
    base("nodes").create(submissionArray, function(err, records){
      console.log(records)
      let messg = document.getElementById("message")
      let title = document.getElementById("node-title")
      title.value = ""
      let text = document.getElementById("node-text")
      text.value = ""
      let tags = document.getElementById("node-resonances")
      tags.value = ""
      messg.innerHTML = "submitted"
      that.setState({node: records[0]})

    });


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
    base("nodes").update(submissionArray, function(err,records){
      console.log(records)
      let messg = document.getElementById("message").innerHtml = "submitted"
    });


  }




   render() {

    const {node} = this.state
    let tags = ""
    let resonances = ""
    if(node){
      let tags = node.fields.Resonances ? node.fields.Resonances.split(", ") : []
      let resonances = tags.map( (tag, index) => {
        return(
          <span key={node.id + "-" + tag} className="node-tag">{tag}</span>
          )
      })

    } 
    

    return (

     <header className="App-header Create">
     <nav><a href="/">all nodes</a></nav>
          <div className="makeNode">
          <h1>Test Creating a Node Here:</h1>
            <input
              id="node-title"
              className="medium-text"
              type="text"
              onChange={this.handleChangeTitle}
              placeholder="Title"
            /> 
            <input
              id="node-text"
              className="medium-text"
              type="text"
              onChange={this.handleChangeText}
              placeholder="Text"
            /> 
            <input
              id="node-resonances"
              className="medium-text"
              type="text"
              onChange={this.handleChangeResonances}
              placeholder="Tags"
            /> <br></br>
            <button onClick={this.handleNew}>Create Node</button>
            <span id='message'></span>
            <div id="node-preview">

      
      {node &&
        <div key={node.id} className="node-wrapper">
        <div className="node">
          { node.fields.Title &&
            <h1 className="node-title">{node.fields.Title}</h1>
          }
          { node.fields.Image &&
            <img className="node-img" src={node.fields.Image[0].url}/>
          }
          { node.fields.Embed &&
            <div className="node-embed-code">{ReactHtmlParser(node.fields.Embed)}</div>
          }
          { node.fields.Attachment &&
            <div className="node-download">
              <a href={node.fields.Attachment[0].url} download>Download</a>
            </div>
          }
          { node.fields.Link &&
            <div className="node-link">
              <a href={node.fields.Link} download>{node.fields.Link}</a>
            </div>
          }
          { node.fields.Text &&
            <div className="node-text">
              <ReactMarkdown>{node.fields.Text}</ReactMarkdown>
            </div>
          }

        </div>
        <div id={"node-tags-"+node.id} className="node-tags">
          {resonances}
        </div>
 
        </div>
    
}

            </div>
          </div>
         
      </header>




    );
  }
}

export default Create