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
import {Home,Create} from './components'
import Arena from "are.na"
import ReactMarkdown from "react-markdown"
import Airtable from "airtable";
const base = new Airtable({ apiKey: process.env.REACT_APP_AIRTABLE_API_KEY }).base('appCCIW2wLHB8NCYK');
let mew = [];
const NoMatchPage = () => {
  return (
    <div>
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
        nodes: [],
     
    };
   
  }

  componentDidMount() {
    


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


render() {
  const { nodes } = this.state;
 
  return (
    <Router>
    <div className="App">
      <Switch>
        <Route exact path="/">
          <Home nodes={nodes}/>
        </Route>
        <Route exact path="/create">
          <Create nodes={nodes}/>
        </Route>
        <Route component={NoMatchPage} />
      </Switch>
    </div>
    </Router>
  );
}

}

export default App;