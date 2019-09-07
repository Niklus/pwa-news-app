import React from 'react';
import { MDCTemporaryDrawer } from '@material/drawer';
import { MDCSimpleMenu } from '@material/menu';
import list from './list';

class Nav extends React.Component {

  state = { list: list, title: '' }

  componentDidMount(){
    this.updateTitle();
    this.appDrawer = new MDCTemporaryDrawer(document.querySelector('.mdc-temporary-drawer'));     
    this.simpleMenu = new MDCSimpleMenu(document.querySelector('.mdc-simple-menu'));

    /** Temporary Hack... onclick does not work on the jsx template*/
    const list = Array.from(document.querySelectorAll('.switch'));
    list.forEach(item => item.addEventListener('click', e => this.reset(e)));
  }
  
  toggleDrawer(){
    this.appDrawer.open = !this.appDrawer.open;
  }

  toggleMenu(){
    this.simpleMenu.open = !this.simpleMenu.open;
  }

  updateTitle(){
     
    let sectionId;
    
    if(window.location.pathname !== '/detail'){
      sectionId = window.location.hash.slice(1) || 'world';
    }else{
      let str = window.location.hash.slice(1);
      let n = str.indexOf('/');
      sectionId = str.substring(0, n !== -1 ? n : str.length);
    }

    const obj = this.state.list.find(el => el['id'] === sectionId)
    this.setState({title : obj.webTitle.toUpperCase()})
  }

  reset(e){
    this.toggleDrawer();
    this.setState({title : e.target.innerText.toUpperCase()})
    window.scrollTo(0, 0);
  }

  render() {

    const listItems = this.state.list.map((item) => {
      return (
        <div key={item.id}> 
          <a className="mdc-list-item switch" href={`#${item.id}`}>
            {item.webTitle}
          </a>
          <hr className="mdc-list-divider"/>
        </div>
      );
    });

    return (
      <div>
        <header className="mdc-toolbar mdc-toolbar--fixed mdc-toolbar--waterfall">
          <div className="mdc-toolbar__row">
            <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
              
              <span className="menu mdc-toolbar__icon mdc-toolbar__icon--menu" onClick={() => this.toggleDrawer()} >
                <svg xmlns="http://www.w3.org/2000/svg" fill="#fff"  width="24" height="24" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
              </span>
              
              <span className="back mdc-toolbar__icon mdc-toolbar__icon--menu" onClick={() => window.history.back()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="24" height="24" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
              </span>
              
              <span className="title mdc-toolbar__title">{this.state.title}</span>
            </section>
            <section className="mdc-toolbar__section mdc-toolbar__section--align-end" role="toolbar">
              <div className="mdc-menu-anchor">
                <span className="mdc-toolbar__icon mdc-toolbar__icon--menu simpleMenu" aria-label="Simple menu"  onClick={() => this.toggleMenu()}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="24" height="24" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                </span>
                <div className="mdc-simple-menu">
                  <ul className="mdc-simple-menu__items mdc-list" role="menu" aria-hidden="true">
                    <li className="mdc-list-item update" role="menuitem">Update</li>
                    <li className="mdc-list-item" role="menuitem"  onClick={() => document.location.reload(true)} >Reload</li>
                    {/*<li className="mdc-list-item" role="menuitem" >Delete</li>
                    <li className="mdc-list-divider" role="separator"></li>
                    <li className="mdc-list-item" role="menuitem">Share...</li>*/}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </header>
        <aside className="mdc-temporary-drawer">
          <nav className="mdc-temporary-drawer__drawer">
            
            <header className="mdc-temporary-drawer__header">
              <div className="mdc-temporary-drawer__header-content mdc-theme--primary-bg mdc-theme--text-primary-on-primary">
                NEWS
              </div>
            </header>

            <nav className="mdc-temporary-drawer__content mdc-list-group">
              <div className="mdc-list">
                {listItems}
              </div>
            </nav>
          </nav>
        </aside>
      </div>
    );
  }

}

export default Nav;