import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import AddBookmark from './AddBookmark/AddBookmark';
import EditBookmark from './EditBookmark/EditBookmark';
import BookmarkList from './BookmarkList/BookmarkList';
import Nav from './Nav/Nav';
import config from './config';
import './App.css';

// const bookmarks = [
  // {
  //   id: 0,
  //   title: 'Google',
  //   url: 'http://www.google.com',
  //   rating: '3',
  //   desc: 'Internet-related services and products.'
  // },
  // {
  //   id: 1,
  //   title: 'Thinkful',
  //   url: 'http://www.thinkful.com',
  //   rating: '5',
  //   desc: '1-on-1 learning to accelerate your way to a new high-growth tech career!'
  // },
  // {
  //   id: 2,
  //   title: 'Github',
  //   url: 'http://www.github.com',
  //   rating: '4',
  //   desc: 'brings together the world\'s largest community of developers.'
  // }
// ];

class App extends Component {
  state = {
    bookmarks: [],
    error: null,
  };

  changePage = (push) => {
    push();
  }

  setBookmarks = bookmarks => {
    this.setState({
      bookmarks,
      error: null,
    })
  }

  addBookmark = bookmark => {
    this.setState({
      bookmarks: [ ...this.state.bookmarks, bookmark ],
    })
  }

  editBookmark = (bookmark) => {
    const editedBookmarkArr = [...this.state.bookmarks].map(bm => 
      bookmark.id === bm.id 
        ? bookmark
        : bm
    )

    this.setState({
      bookmarks: editedBookmarkArr
    });

    // // you can put setState in a Promise which will allow us to do
    // // this.props.onEditBookmark(editedBookmark).then() in EditBookmark.js
    // // but we won't use this
    // return new Promise(resolve => {
    //   this.setState({
    //     bookmarks: editedBookmarkArr
    //   }, () => {
    //     resolve(editedBookmarkArr);
    //   });
    // });
  }

  componentDidMount() {
    fetch(config.API_ENDPOINT, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status)
        }
        return res.json()
      })
      .then(this.setBookmarks)
      .catch(error => this.setState({ error }))
  }

  render() {
    const { bookmarks } = this.state
    return (
      <main className='App'>
        <h1>Bookmarks!</h1>
        <Nav clickPage={this.changePage} />
        <div className='content' aria-live='polite'>
          <Switch>
            <Route path="/add" render={() =>
                <AddBookmark
                  onAddBookmark={this.addBookmark}
                  onClickCancel={() => this.changePage()}
                />
            } />  
            <Route path="/edit/:id" render={(props) =>
                <EditBookmark
                  {...props}
                  onEditBookmark={this.editBookmark}
                  onClickCancel={() => this.changePage()}
                />
            } />  
            <Route exact path="/" render={(props) =>
              <BookmarkList
                {...props}
                bookmarks={bookmarks}
              />
            } /> 
          </Switch>
        </div>
      </main>
    );
  }
}

export default App;
