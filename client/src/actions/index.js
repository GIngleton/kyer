import axios from 'axios';
import { browserHistory } from 'react-router';
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_MESSAGE
  } from './types';

const ROOT_URL = 'http://localhost:3090'

export function signinUser({ email, password }) {
  return function(dispatch) {
    // Submit email/password to the server
    axios.post(`${ROOT_URL}/signin`, { email, password })
        // If request is good...
        .then(response => {
        // - Update state to indicate user is authenticated
        dispatch({ type: AUTH_USER });
        // - Save the JWT token
        localStorage.setItem('token', response.data.token);
        // - Redirect to the route '/feature'
        browserHistory.push('/feature');
      })
        // If request is bad...
      .catch(() => {
        // - Show an error to the user
        dispatch(authError('Bad Login Info'));
      });
  }
}

export function signupUser({ email, password }) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/signup`, { email, password })
      .then(response => {
        dispatch({ type: AUTH_USER });
        localStorage.setItem('token', response.data.token);
        browserHistory.push('/feature');
      })
      .catch ( error => dispatch(authError(error.response.data.error)));
      //.catch(response => dispatch(authError(response.response.data.error)));
  }
}

// export function signupDetails({ name, is_Student, verification, school_id }) {
//   return function(dispatch) {
//     axios.post(`{ROOT_URL}/signupDetails`, { name, is_Student, verification, school_id })
//
//   }
// }

export function authError(error){
  return {
    type:AUTH_ERROR,
    payload: error
  };
}

export function signoutUser() {
  localStorage.removeItem('token');

  return { type: UNAUTH_USER };
}

export function fetchMessage() {
  return function(dispatch) {
    axios.get(ROOT_URL, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        console.log(response);
        dispatch({
          type: FETCH_MESSAGE,
          payload: response.data.message
        });
      });
  }
}