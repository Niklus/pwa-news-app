import React from 'react';
import { Link } from 'react-router-dom';
import { MDCSnackbar } from '@material/snackbar';
import './NewsList.css';
import config from '../../api/config'; // create config json file with your key { "API_KEY":"your key here"}

class NewsList extends React.Component {

  state = { list: [] };

  componentDidMount() {

    this.getFromDb = this.getFromDb.bind(this);
    this.updateArticles = this.updateArticles.bind(this);

    // Get news from db
    this.getFromDb();

    // Add event Listeners
    this.addEventListeners()

    this.toggleIcons();

    this.snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
  }

  componentWillUnmount() {
    console.log("Clean Up")
    this.removeEventListeners();
  }

  addEventListeners() {
    window.addEventListener('hashchange', this.getFromDb);
    this.updateBtn = document.querySelector('.update')
    this.updateBtn.addEventListener('click', this.updateArticles);
  }

  removeEventListeners() {
    window.removeEventListener('hashchange', this.getFromDb);
    this.updateBtn.removeEventListener('click', this.updateArticles);
  }

  getFromDb() {

    const sectionId = window.location.hash.slice(1) || 'world';

    this.props.db.transaction("r", this.props.db.articles, () => {
      this.props.db.articles.where('sectionId')
        .equalsIgnoreCase(sectionId)
        .toArray(items => {
          if (items.length === 0) {
            console.log('getting ' + sectionId + ' from network');
            this.getFromNetwork(sectionId);
          } else {
            console.log('getting ' + sectionId + ' from db');
            this.setState({ list: this.sortByDate(items) });
          }
        });
    }).catch(err => {
      console.error(err.stack);
    });
  }

  getFromNetwork(sectionId) {
    this.getJson(sectionId)
      .then(this.readAsJson)
      .then(res => res.response.results)
      .then(items => this.setListState(items))
      .then(items => this.addToDb(items))
      .then(() => this.updateTime(sectionId))
      .catch(this.logError);
  }

  getJson(section) {
    const key = config.API_KEY;
    const url = "https://content.guardianapis.com/";
    return fetch(`${url}${section}?&show-fields=all&api-key=${key}`);
  }

  readAsJson(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  }

  setListState(items) {
    this.setState({ list: this.sortByDate(items) });
    return items;
  }

  addToDb(items) {
    this.props.db.transaction("rw", this.props.db.articles, () => {
      items.forEach(item => {
        item.timeStamp = Date.now();
        this.props.db.articles.put(item);
      });
    }).then(() => {
      this.showToast('Articles Downloaded');
    }).catch(function (err) {
      console.error(err.stack);
    });
  }

  // Update download time
  updateTime(sectionId) {

    let dataObj;

    if (!window.localStorage.downloadTimes) {
      dataObj = {};
    } else {
      dataObj = JSON.parse(window.localStorage.downloadTimes);
    }

    dataObj[sectionId] = Date.now();
    window.localStorage.downloadTimes = JSON.stringify(dataObj);
  }

  // Update articles
  updateArticles() {

    if (!window.navigator.onLine) {
      this.showToast('OFFLINE');
      return;
    }

    let sectionId = window.location.hash.slice(1) || 'world';

    if (window.localStorage.downloadTimes) {

      let obj = JSON.parse(window.localStorage.downloadTimes);
      let downloadTime = obj[sectionId];

      if (!downloadTime) {
        this.getFromNetwork(sectionId)
      } else if ((Date.now() - downloadTime) > 3600000) {
        this.getFromNetwork(sectionId)
      } else {
        this.showToast('Articles Up To Date');
      }
    } else {
      this.getFromNetwork(sectionId)
    }

  }


  logError(error) {
    console.log('Looks like there was a problem: \n', error);
  }

  showToast(msg) {
    const dataObj = { message: msg };
    this.snackbar.show(dataObj);
  }

  // Sort list by web publication date
  sortByDate(arr) {
    return arr.sort((a, b) => {
      let dateA = a.webPublicationDate;
      let dateB = b.webPublicationDate;
      if (dateA > dateB) {
        return -1;
      } else if (dateA < dateB) {
        return 1;
      }
      return 0;
    });
  }

  toggleIcons() {
    let menuIcon = document.querySelector(".menu");
    let backIcon = document.querySelector(".back");
    let simpleMenuIcon = document.querySelector(".simpleMenu");
    menuIcon.style.display = '';
    backIcon.style.display = 'none';
    simpleMenuIcon.style.display = '';
  }

  render() {

    let listItems;

    if (this.state.list) {
      listItems = this.state.list.map((item, i) => {
        const styles = { backgroundImage: `url(${item.fields.thumbnail})` };
        return (
          <div className="mdc-layout-grid__cell" key={i}>
            <Link to={`/detail#${item.id}`}>
              <div className="mdc-card">
                <section className="mdc-card__media card__16-9-media" style={styles}></section>
                <section className="mdc-card__primary">
                  <h1 className="mdc-card__title mdc-card__title--medium">{item.webTitle}</h1>
                  <h2 className="mdc-card__subtitle">{item.webPublicationDate.slice(0, 10)}</h2>
                </section>
              </div>
            </Link>
          </div>
        )
      })
    }
    return (
      <div id="list">
        <div className="grid mdc-layout-grid">
          <div className="mdc-layout-grid__inner">
            {listItems}
          </div>
        </div>
      </div>
    );
  }

}

export default NewsList;