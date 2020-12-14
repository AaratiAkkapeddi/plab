import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
  RouteComponentProps,
  useParams
} from "react-router-dom";
import './App.css';
import {Home} from './components'
import Arena from "are.na"
import ReactMarkdown from "react-markdown"
import Airtable from "airtable";
const base = new Airtable({ apiKey: process.env.REACT_APP_AIRTABLE_API_KEY }).base('appCCIW2wLHB8NCYK');
let mew = [];
const NoMatchPage = () => {
  return (
    <div>
      <img className='oops-image' src='https://dl.airtable.com/.attachmentThumbnails/e2a293ce9cca576fcb3cf35ebdda5302/f5780653'/>
      <h3 className='oops-message text-large'>Woops! This page does not exist. Maybe try going <a className='link' href='/'>Home</a>?</h3>
    </div>
  );
};
let arena = new Arena({ accessToken: process.env.REACT_APP_ARENA_ACCESS_TOKEN });

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        err : null,
        isLoaded : false,
        blocks: [],
        nesting: 0,
        records:[]
        
    };
    this.scrubChannel = this.scrubChannel.bind(this);
  }
  scrubChannel(slug){
    let that = this;
       arena.channel(slug,{ page: 1, per: 100 }).get()
      .then(chan => {
        chan.contents.map(item => {

          //what to do with block
          if(item.base_class == "Channel" && this.state.nesting < 2){
            let newNest = this.state.nesting + 1;
            this.setState({ nesting: newNest });
            that.scrubChannel(item.slug);
          }else{
            let joined = this.state.blocks.concat(item);
            this.setState({ blocks: joined });

          }

        });
      })
      .catch(err => console.log(err));
  }
  componentDidMount() {
    
    this.scrubChannel("poetics-lab-site")

base('TagIndex').select({view: 'Grid view'})
    .eachPage(
      (records, fetchNextPage) => {
        if(mew){
          mew = mew.concat(records)
          this.setState({
            records: mew
          });
        }
        

        fetchNextPage();
      }
    );
  }


render() {
  const { blocks, records } = this.state;
 
  return (
    <Router>
    <div className="App">
      <Switch>
        <Route exact path="/">
          <Home records={records} blocks={blocks}/>
        </Route>
        <Route component={NoMatchPage} />
      </Switch>
    </div>
    </Router>
  );
}

}

export default App;
