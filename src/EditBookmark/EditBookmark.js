import React, { Component } from  'react';
import config from '../config'
import './EditBookmark.css';

const Required = () => (
  <span className='EditBookmark__required'>*</span>
)

class EditBookmark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      title: '',
      url: '',
      description: '',
      rating: 1,
    };
    this.endpoint = config.API_ENDPOINT + "/" + this.props.match.params.id;
  }
  static defaultProps = {
    onEditBookmark: () => {}
  };

  componentDidMount() {
    fetch(this.endpoint, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${config.API_KEY}`
      }
    })
    .then(res => {
      if (!res.ok) {
        // get the error message from the response,
        return res.json().then(error => {
          // then throw it
          throw error
        })
      }
      return res.json()
    })
    .then(resJson => {
      this.setState({
        title: resJson.title,
        url: resJson.url,
        description: resJson.description,
        rating: resJson.rating,
      })
    })
    .catch(err => console.log(err))
  }

  handleChange = e => {
    const target = e.target;
    const name = target.name
    const value = target.value;
    this.setState({
      [name]: value
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    
    // get the form fields from the event
    const { title, url, description, rating } = this.state;
    const bookmark = {
      title,
      url,
      description,
      rating,
    }

    this.setState({ error: null })
    fetch(this.endpoint, {
      method: 'PATCH',
      body: JSON.stringify(bookmark),
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          // get the error message from the response,
          return res.then(error => {
            // then throw it
            throw error
          })
        }
        return res
      })
      .then(res => {
        const editedBookmark = {
          id: this.props.match.params.id,
          ...bookmark
        }
        this.props.onEditBookmark(editedBookmark)
        this.props.history.push("/");
        this.render();
      })
      .catch(error => {
        console.log(error)
        this.setState({ error })
      })
  }

  render() {
    const { error } = this.state
    const { onClickCancel } = this.props
    return (
      <section className='EditBookmark'>
        <h2>Edit a bookmark</h2>
        <form
          className='EditBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='EditBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
              {' '}
              <Required />
            </label>
            <input
              type='text'
              name='title'
              id='title'
              value={this.state.title}
              onChange={(e) => this.handleChange(e)}
              required
            />
          </div>
          <div>
            <label htmlFor='url'>
              URL
              {' '}
              <Required />
            </label>
            <input
              type='url'
              name='url'
              id='url'
              value={this.state.url}
              onChange={(e) => this.handleChange(e)}
              required
            />
          </div>
          <div>
            <label htmlFor='description'>
              Description
            </label>
            <textarea
              name='description'
              id='description'
              value={this.state.description}
              onChange={(e) => this.handleChange(e)}
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
              <Required />
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              min='1'
              max='5'
              value={this.state.rating}
              onChange={(e) => this.handleChange(e)}
              required
            />
          </div>
          <div className='EditBookmark__buttons'>
            <button type='button' onClick={onClickCancel}>
              Cancel
            </button>
            {' '}
            <button type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default EditBookmark;
