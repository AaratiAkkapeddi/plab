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

const NoMatchPage = () => {
  return (
    <div>
      <img className='oops-image' src='https://dl.airtable.com/.attachmentThumbnails/e2a293ce9cca576fcb3cf35ebdda5302/f5780653'/>
      <h3 className='oops-message text-large'>Woops! This page does not exist. Maybe try going <a className='link' href='/'>Home</a>?</h3>
    </div>
  );
};

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        err : null,
        isLoaded : false,
        records: [],
        announcements: [],
        info:[],
        events: []
    };
  }
  componentDidMount() {
      // fetch('https://api.airtable.com/v0/apprjbiiZGRAW9lxA/exhibitions?api_key='+process.env.REACT_APP_AIRTABLE_API_KEY)
      //   .then(res => res.json())
      //   .then(res => {
      //     this.setState({ records: res.records })
      //   })
      //   .catch(error => console.log(error))
      // fetch('https://api.airtable.com/v0/apprjbiiZGRAW9lxA/announcements?api_key='+process.env.REACT_APP_AIRTABLE_API_KEY)
      //   .then(res => res.json())
      //   .then(res => {
      //     this.setState({ announcements: res.records })
      //   })
      //   .catch(error => console.log(error))
      // fetch('https://api.airtable.com/v0/apprjbiiZGRAW9lxA/events?api_key='+process.env.REACT_APP_AIRTABLE_API_KEY)
      //   .then(res => res.json())
      //   .then(res => {
      //     this.setState({ events: res.records })
      //   })
      //   .catch(error => console.log(error))   
  }


render() {
  // const { records,info, announcements, events } = this.state;
 
  return (
    <Router>
    <div className="App">
      <Switch>
        <Route exact path="/">
          <Home/>
        </Route>
        <Route component={NoMatchPage} />
      </Switch>
    </div>
    </Router>
  );
}

}

export default App;
