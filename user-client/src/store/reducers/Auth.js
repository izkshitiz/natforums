import jwtDecode from 'jwt-decode';
import {
  SIGNIN_USER_REQUEST,
  SIGNIN_USER_SUCCESS,
  SIGNIN_USER_FAIL,
  SIGNUP_USER_REQUEST,
  SIGNUP_USER_SUCCESS,
  SIGNUP_USER_FAIL,
  SIGNOUT_USER_SUCCESS
} from '../actions/Auth';

const token = localStorage.getItem('token');
const username = token && jwtDecode(token).username;
const weightage = token && jwtDecode(token).weightage;

const initialState = {
  token,
  username,
  weightage
};

export default (state = initialState, action) => {
  
  let username, weightage;

  switch (action.type) {

    case SIGNIN_USER_REQUEST:
      return { ...state, requestPending: true };
    case SIGNIN_USER_SUCCESS:
      username = jwtDecode(action.token).username;
      weightage = jwtDecode(action.token).weightage;
      localStorage.setItem('token', action.token);
      return {
        ...state, token: action.token, username, weightage, requestPending: false
      };
    case SIGNIN_USER_FAIL:
      return { ...state, error: action.error, requestPending: false };

    case SIGNUP_USER_REQUEST:
      return { ...state, requestPending: true }
    case SIGNUP_USER_SUCCESS:
      username = jwtDecode(action.token).username;
      weightage = jwtDecode(action.token).weightage;
      localStorage.setItem('token', action.token);
      return {
        ...state, token: action.token, newUser: true, username, weightage, requestPending: false
      };
    case SIGNUP_USER_FAIL:
      return { ...state, error: action.error, requestPending: false };

    case SIGNOUT_USER_SUCCESS:
      localStorage.removeItem('token');
      return { ...state, token: null, username: null, weightage: null };

    default:
      return state;
  }
};
