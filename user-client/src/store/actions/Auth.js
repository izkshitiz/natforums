//Naming convention : verb-noun-info
import { signupUserHandler, signinUserHandler } from '../../handler/Queryhandler';

export const SIGNIN_USER_REQUEST = 'SIGNIN_USER_REQUEST';
export const SIGNIN_USER_SUCCESS = 'SIGNIN_USER_SUCCESS';
export const SIGNIN_USER_FAIL = 'SIGNIN_USER_FAIL';

export const SIGNUP_USER_REQUEST = 'SIGNUP_USER_REQUEST';
export const SIGNUP_USER_SUCCESS = 'SIGNUP_USER_SUCCESS';
export const SIGNUP_USER_FAIL = 'SIGNUP_USER_FAIL';

export const SIGNOUT_USER_SUCCESS = 'SIGNOUT_USER_SUCCESS';

const signinUserRequest = { type: SIGNIN_USER_REQUEST };
const signinUserSuccess = token => ({ type: SIGNIN_USER_SUCCESS, token });
const signinUserFail = error => ({ type: SIGNIN_USER_FAIL, error });
export const signinUserAction = (email, password) => async dispatch => {
  dispatch(signinUserRequest);
  try {
    const token = await signinUserHandler(email, password);
    dispatch(signinUserSuccess(token));
  } catch (error) {
    dispatch(signinUserFail(error));
  }
};

const signupUserRequest = { type: SIGNUP_USER_REQUEST };
const signupUserSuccess = token => ({ type: SIGNUP_USER_SUCCESS, token });
const signupUserFail = error => ({ type: SIGNUP_USER_FAIL, error });
export const signupUserAction = (username, email, password) => async dispatch => {
  dispatch(signupUserRequest);
  try {
    const token = await signupUserHandler(username, email, password);
    dispatch(signupUserSuccess(token));
  } catch (error) {
    dispatch(signupUserFail(error));
  }
};

export const signoutUserAction = () => ({ type: SIGNOUT_USER_SUCCESS });
