import {
  castPointHandler,
  publishThreadHandler,
  updateThreadHandler,
  getThreadHandler,
  getThreadsHandler,
  publishCommentHandler,
  deleteThreadHandler,
  deleteCommentHandler,
  getMetaHandler
} from '../../handler/Queryhandler';

export const GET_META_REQUEST = 'GET_META_REQUEST';
export const GET_META_SUCCESS = 'GET_META_SUCCESS';
export const GET_META_FAIL = 'GET_META_FAIL';

export const PUBLISH_THREAD_REQUEST = 'PUBLISH_THREAD_REQUEST';
export const PUBLISH_THREAD_SUCCESS = 'PUBLISH_THREAD_SUCCESS';
export const PUBLISH_THREAD_FAIL = 'PUBLISH_THREAD_FAIL';

export const UPDATE_THREAD_REQUEST = 'UPDATE_THREAD_REQUEST';
export const UPDATE_THREAD_SUCCESS = 'UPDATE_THREAD_SUCCESS';
export const UPDATE_THREAD_FAIL = 'UPDATE_THREAD_FAIL';

export const GET_THREAD_REQUEST = 'GET_THREAD_REQUEST';
export const GET_THREAD_SUCCESS = 'GET_THREAD_SUCCESS';
export const GET_THREAD_FAIL = 'GET_THREAD_FAIL';

export const GET_THREADS_REQUEST = 'GET_THREADS_REQUEST';
export const GET_THREADS_SUCCESS = 'GET_THREADS_SUCCESS';
export const GET_THREADS_FAIL = 'GET_THREADS_FAIL';

export const PUBLISH_COMMENT_REQUEST = 'PUBLISH_COMMENT_REQUEST';
export const PUBLISH_COMMENT_SUCCESS = 'PUBLISH_COMMENT_SUCCESS';
export const PUBLISH_COMMENT_FAIL = 'PUBLISH_COMMENT_FAIL';

export const CAST_POINT_REQUEST = 'CAST_POINT_REQUEST';
export const CAST_POINT_SUCCESS = 'CAST_POINT_SUCCESS';
export const CAST_POINT_FAIL = 'CAST_POINT_FAIL';

export const DELETE_THREAD_REQUEST = 'DELETE_THREAD_REQUEST';
export const DELETE_THREAD_SUCCESS = 'DELETE_THREAD_SUCCESS';
export const DELETE_THREAD_FAIL = 'DELETE_THREAD_FAIL';

export const DELETE_COMMENT_REQUEST = 'DELETE_COMMENT_REQUEST';
export const DELETE_COMMENT_SUCCESS = 'DELETE_COMMENT_SUCCESS';
export const DELETE_COMMENT_FAIL = 'DELETE_COMMENT_FAIL';

const getMetaRequest = { type: GET_META_REQUEST };
const getMetaSuccess = meta => ({ type: GET_META_SUCCESS, meta });
const getMetaFail = error => ({ type: GET_META_FAIL, error });
export const getMetaAction = (sections) => async dispatch => {
  dispatch(getMetaRequest);
  try {
    const meta = await getMetaHandler(sections);
    dispatch(getMetaSuccess(meta));
  } catch (error) {
    dispatch(getMetaFail(error));
  }
};

const publishThreadRequest = { type: PUBLISH_THREAD_REQUEST };
const publishThreadSuccess = newThreadData => ({ type: PUBLISH_THREAD_SUCCESS, newThreadData });
const publishThreadFail = error => ({ type: PUBLISH_THREAD_FAIL, error });
export const publishThreadAction = (threadData, token) => async dispatch => {
  dispatch(publishThreadRequest);
  try {
    const newThreadData = await publishThreadHandler(threadData, token);
    dispatch(publishThreadSuccess(newThreadData));
  } catch (error) {
    dispatch(publishThreadFail(error));
  }
};

const updateThreadRequest = { type: UPDATE_THREAD_REQUEST };
const updateThreadSuccess = newThreadData => ({ type: UPDATE_THREAD_SUCCESS, newThreadData });
const updateThreadFail = error => ({ type: UPDATE_THREAD_FAIL, error });
export const updateThreadAction = (threadData, token) => async dispatch => {
  dispatch(updateThreadRequest);
  try {
    const newThreadData = await updateThreadHandler(threadData, token);
    dispatch(updateThreadSuccess(newThreadData));
  } catch (error) {
    dispatch(updateThreadFail(error));
  }
};

const getThreadRequest = { type: GET_THREAD_REQUEST };
const getThreadSuccess = thread => ({ type: GET_THREAD_SUCCESS, thread });
const getThreadFail = error => ({ type: GET_THREAD_FAIL, error });
export const getThreadAction = (slug, token) => async dispatch => {
  dispatch(getThreadRequest);
  try {
    const thread = await getThreadHandler(slug, token);
    dispatch(getThreadSuccess(thread));
  } catch (error) {
    dispatch(getThreadFail(error));
  }
};

const getThreadsRequest = anchor => ({ type: GET_THREADS_REQUEST, anchor });
const getThreadsSuccess = threads => ({ type: GET_THREADS_SUCCESS, threads });
const getThreadsFail = error => ({ type: GET_THREADS_FAIL, error });
export const getThreadsAction = (classifier, parameter, anchor, token) => async dispatch => {
  dispatch(getThreadsRequest(anchor));
  try {
    const threads = await getThreadsHandler(token, classifier, parameter, anchor);
    dispatch(getThreadsSuccess(threads));
  } catch (error) {
    dispatch(getThreadsFail(error));
  }
};

const publishCommentRequest = { type: PUBLISH_COMMENT_REQUEST };
const publishCommentSuccess = thread => ({ type: PUBLISH_COMMENT_SUCCESS, thread });
const publishCommentFail = error => ({ type: PUBLISH_COMMENT_FAIL, error });
export const publishCommentAction = (token, threadId, comment) => async (dispatch) => {
  dispatch(publishCommentRequest);
  try {
    const thread = await publishCommentHandler(token, threadId, comment);
    dispatch(publishCommentSuccess(thread));
  } catch (error) {
    dispatch(publishCommentFail(error));
  }
};

const castPointRequest = (charge, threadId) => ({ type: CAST_POINT_REQUEST, charge, threadId });
const castPointSuccess = (compact, thread) => ({ type: CAST_POINT_SUCCESS, compact, thread });
const castPointFail = error => ({ type: CAST_POINT_FAIL, error });
export const castPointAction = (compact, token, threadId, charge) => async (dispatch) => {
  dispatch(castPointRequest(charge, threadId));
  try {
    const thread = await castPointHandler(compact, token, threadId, charge);
    dispatch(castPointSuccess(compact, thread));
  } catch (error) {
    dispatch(castPointFail(error));
  }
};

const deleteThreadRequest = threadId => ({ type: DELETE_THREAD_REQUEST, threadId });
const deleteThreadSuccess = threadId => ({ type: DELETE_THREAD_SUCCESS, threadId });
const deleteThreadFail = error => ({ type: DELETE_THREAD_FAIL, error });
export const deleteThreadAction = (threadId, token) => async (dispatch) => {
  dispatch(deleteThreadRequest(threadId));
  try {
    await deleteThreadHandler(threadId, token);
    dispatch(deleteThreadSuccess(threadId));
  } catch (error) {
    dispatch(deleteThreadFail(error));
  }
};

const deleteCommentRequest = commentId => ({ type: DELETE_COMMENT_REQUEST, commentId });
const deleteCommentSuccess = responseCommentId => ({ type: DELETE_COMMENT_SUCCESS, responseCommentId });
const deleteCommentFail = error => ({ type: DELETE_COMMENT_FAIL, error });
export const deleteCommentAction = (token, threadId, commentId) => async (dispatch) => {
  dispatch(deleteCommentRequest(commentId));
  try {
    const responseCommentId = await deleteCommentHandler(token, threadId, commentId);
    dispatch(deleteCommentSuccess(responseCommentId));
  } catch (error) {
    dispatch(deleteCommentFail(error));
  }
};

