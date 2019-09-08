import React from 'react';
import Nav from './Nav/Nav';
import SnackBar from './SnackBar/SnackBar';
import { MDCSnackbar } from '@material/snackbar';
import Dexie from 'dexie';
import NewsList from './NewsList/NewsList';
import NewsDetail from './NewsDetail/NewsDetail';
import { BrowserRouter as Router, Route} from "react-router-dom";

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = { db : new Dexie('news-database') };
    this.state.db.version(1).stores({ articles: 'id, sectionId, timeStamp' });
  }

  componentDidMount(){
    
    const snackBar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
    const networkMsg = window.navigator.onLine ? 'ONLINE' : 'OFFLINE';
    
    snackBar.show({ message: networkMsg });
   
    window.addEventListener('online', () => snackBar.show({ message: 'ONLINE' }));
    window.addEventListener('offline',() => snackBar.show({ message: 'OFFLINE'}));
  }

  render() {
    return (
      <div className="mdc-typography">
        <Nav/>
        <div className="mdc-toolbar-fixed-adjust"> 
          <Router>
            <Route path="/" exact render={(props) => <NewsList {...props} db={this.state.db} />}/>
            <Route path="/detail" render={(props) => <NewsDetail {...props} db={this.state.db} />} />
          </Router>
          <SnackBar/>
        </div>
      </div>
    );
  }
}

export default App;
