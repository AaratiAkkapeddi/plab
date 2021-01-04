import React, { Component } from 'react';
import './style.css';
import { BrowserRouter as Router, withRouter } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import ReactHtmlParser from "react-html-parser";
import Airtable from "airtable";
let mew = [];
const base = new Airtable({ apiKey: process.env.REACT_APP_AIRTABLE_API_KEY }).base("appCCIW2wLHB8NCYK");

// TODO convert this class to a pure function, w/o local state, its not necessary to be a class
class Node extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id : 'hello',
      nodes: []
    }
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
  renderNode(){
      const {nodes} = this.state
      const records = [];
      for (var i = nodes.length - 1; i >= 0; i--) {
        console.log(this.props.match.params.id)
        if(nodes[i].id == this.props.match.params.id){
         
          let node = nodes[i];
 
  
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
            <><h1 className="node-title">{node.fields.Title}</h1> <a href={'/edit/'+node.id}>edit</a></>
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
            )
        }

      }

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

export default withRouter(Node)