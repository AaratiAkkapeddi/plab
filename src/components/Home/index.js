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
import Airtable from "airtable";
import Arena from "are.na"
const base = new Airtable({ apiKey: process.env.REACT_APP_AIRTABLE_API_KEY }).base("appCCIW2wLHB8NCYK");
let mew = [];


let arena = new Arena({ accessToken: process.env.REACT_APP_ARENA_ACCESS_TOKEN });

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resonances:"",
      nodes:[],
      key:1
    };

    this.handleChangeResonances = this.handleChangeResonances.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
   }

refreshNodes() {
    let mew = []
console.log('refreshing')

base('nodes').select({view: 'Grid view'})
    .eachPage(
      (records, fetchNextPage) => {
        if(mew){
          mew = mew.concat(records)
          this.setState({
            nodes: mew
          });
        }
        

        fetchNextPage();
      }
    );
  }

   handleUpdate(airtableId, old) {
    //save roses in cloudinary
   // const dataURI = document.getElementsByTagName("canvas")[0].getAttribute("data-uri");
   // const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/upload`;
     const newresonances = document.getElementById(airtableId).value
     const that = this
     const submissionArray = [
      {
        id: airtableId,
        fields: {
          Resonances: old + ", " + newresonances
        },
      },
    ];
    base("nodes").update(submissionArray, function(err,records){
      let messg = document.getElementById("message-" + airtableId)
      messg.innerHTML = "submitted"
      document.getElementById(airtableId).value = ""
      //let tag = document.getElementById("node-tags-" + airtableId)
      //tag.innerHTML = tag.innerHTML + "<span class='node-tag'>"+newresonances+"</span>"
      
      that.refreshNodes()
    });
let num = Math.floor(Math.random() * (100 - 2) + 2);
// this.refreshNodes()
    
  }
  componentDidMount() {
    
console.log('mounting')

base('nodes').select({view: 'Grid view'})
    .eachPage(
      (records, fetchNextPage) => {
        if(mew){
          mew = mew.concat(records)
          this.setState({
            nodes: mew
          });
        }
        

        fetchNextPage();
      }
    );
  }


   handleChangeResonances(event) {
    this.setState({ resonances: event.target.value });
   }

   render() {
    let {nodes, key} = this.state;
    let allNodes = nodes.map( (node, index) => {

      let tags = node.fields.Resonances ? node.fields.Resonances.split(", ") : []
      let resonances = tags.map( (tag, index) => {
        return(
          <span key={node.id + "-" + tag} className="node-tag">{tag}</span>
          )
      })
      return(
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
        <div className="node-form">
          <input id={node.id} type="text"/>
          <button onClick={()=>this.handleUpdate(node.id, node.fields.Resonances)} >Submit</button>
          <div id={"message-"+node.id}></div>
        </div>
        </div>)
    
    });
    return (

     <header key={key} className="App-header Homepage">
     
     <nav><a href="/create">create node</a></nav>
          {allNodes}
      </header>




    );
  }
}

export default Home
