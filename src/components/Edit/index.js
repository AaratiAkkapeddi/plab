import React, { Component } from 'react';
import './style.css';
import { BrowserRouter as Router, withRouter } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import ReactHtmlParser from "react-html-parser";
import Airtable from "airtable";
let mew = [];
const base = new Airtable({ apiKey: process.env.REACT_APP_AIRTABLE_API_KEY }).base("appCCIW2wLHB8NCYK");

// TODO convert this class to a pure function, w/o local state, its not necessary to be a class
class Edit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id : 'hello',
      nodes: [],
      text: null,
      title: null,
      embed:null,
    }
    this.handleUpdate = this.handleUpdate.bind(this);
    this.refreshNodes = this.refreshNodes.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeText = this.handleChangeText.bind(this);
    this.handleChangeEmbed = this.handleChangeEmbed.bind(this);
   }
handleChangeTitle(event) {
    this.setState({ title: event.target.value });
  }
 handleChangeText(event) {
    this.setState({ text: event.target.value });
  }
 handleChangeEmbed(event) {
    this.setState({ embed: event.target.value });
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
     let {title, text, embed} = this.state
     if(!title){
     	title = document.getElementById("node-title") ? document.getElementById("node-title").value : null
     }
     if(!text){
     	text = document.getElementById("node-text") ? document.getElementById("node-text").value : null
     }
     if(!embed){
     	embed = document.getElementById("node-embed-code") ? document.getElementById("node-embed-code").value : null
     }
     const submissionArray = [
      {
        id: airtableId,
        fields: {
          Resonances: old + ", " + newresonances,
          Title: title,
          Text: text,
          Embed: embed
        },
      },
    ];

    base("nodes").update(submissionArray, function(err,records){
      let messg = document.getElementById("message")
      messg.innerHTML = "submitted"

      //let tag = document.getElementById("node-tags-" + airtableId)
      //tag.innerHTML = tag.innerHTML + "<span class='node-tag'>"+newresonances+"</span>"
      
      that.refreshNodes()
    });
let num = Math.floor(Math.random() * (100 - 2) + 2);
// this.refreshNodes()
    
  }

     componentDidMount() {
     	const {nodes} = this.props
     	for (var i = nodes.length - 1; i >= 0; i--) {
     		if(nodes[i].id == this.props.match.params.id){
			this.setState({title: nodes[i].fields.Title})
      		this.setState({text: nodes[i].fields.Text})
      		this.setState({embed: nodes[i].fields.Embed})
     		}
     	}
        
 	  
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
  renderNode(){
      const {nodes} = this.state
      const records = [];
      const that = this;
      let node = ''
      for (var i = nodes.length - 1; i >= 0; i--) {
        console.log(this.props.match.params.id)
        if(nodes[i].id == this.props.match.params.id){
         
          node = nodes[i];
          	
  
            let tags = node.fields.Resonances ? node.fields.Resonances.split(", ") : []
            let resonances = tags.map( (tag, index) => {
              return(
                <span key={node.id + "-" + tag} className="node-tag">{tag}</span>
                )
            })
            
          records.push(
            <div key={node.id} className="node-wrapper">
        <div className="node">
          { node.fields.Title &&
            <input type="text" id="node-title" defaultValue={node.fields.Title}/>
          }
          { node.fields.Image &&
            <img className="node-img" src={node.fields.Image[0].url}/>
          }
          { node.fields.Embed &&
            <textarea type="text" id="node-embed-code" defaultValue={node.fields.Embed}/>
          }
          { node.fields.Attachment &&
            <div className="node-download">
              <a href={node.fields.Attachment[0].url} download>Download</a>
            </div>
          }
          { node.fields.Link &&
            <input type="text" id="node-link" defaultValue={node.fields.Link}/>

          }
          { node.fields.Text &&
            <textarea type="text" id="node-text" defaultValue={node.fields.Text}/>
             
          }

        </div>
        <div id={"node-tags-"+node.id} className="node-tags">
          {resonances}
        </div>
 Add Resonances
          <input id={node.id} type="text"/>
          <button onClick={()=>this.handleUpdate(node.id, node.fields.Resonances)} >Submit</button>
          <div id={"message"}></div>
        </div>
            )
        }

      }

      // this.setState({title: node.fields.Title})
      // 		this.setState({text: node.fields.Text})
      // 		this.setState({embed: node.fields.Embed})

      return <div>{records}</div>
      
   }

   render() {
    return (
      <div>
        <div>{this.renderNode()}</div>
      </div>
    )
  }
}

export default withRouter(Edit)