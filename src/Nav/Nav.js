import React from 'react';
import {Link} from 'react-router-dom';

export default function Nav(props) {
  return (
    <nav className='Nav'>
      {/* <button onClick={() => props.history.push("/")}>
        Bookmark List
      </button>
      {' '}
      <button onClick={() => props.history.push("/add")}>
        Add Bookmark
      </button> */}

      <button>
        <Link 
        to="/"
        style={{"textDecoration": "none"}}>
          Bookmark List
        </Link>
      </button>
      {' '}
      <button>
        <Link
        to="/add"
        style={{"textDecoration": "none"}}>
          Add Bookmark
        </Link>
      </button>


    </nav>
  );
}
