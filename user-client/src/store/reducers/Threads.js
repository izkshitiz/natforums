import {
  PUBLISH_THREAD_REQUEST,
  PUBLISH_THREAD_SUCCESS,
  PUBLISH_THREAD_FAIL,
  UPDATE_THREAD_REQUEST,
  UPDATE_THREAD_SUCCESS,
  UPDATE_THREAD_FAIL,
  GET_THREAD_REQUEST,
  GET_THREAD_SUCCESS,
  GET_THREAD_FAIL,
  GET_THREADS_REQUEST,
  GET_THREADS_SUCCESS,
  GET_THREADS_FAIL,
  PUBLISH_COMMENT_REQUEST,
  PUBLISH_COMMENT_SUCCESS,
  PUBLISH_COMMENT_FAIL,
  CAST_POINT_REQUEST,
  CAST_POINT_SUCCESS,
  CAST_POINT_FAIL,
  DELETE_THREAD_REQUEST,
  DELETE_THREAD_SUCCESS,
  DELETE_THREAD_FAIL,
  DELETE_COMMENT_REQUEST,
  DELETE_COMMENT_SUCCESS,
  DELETE_COMMENT_FAIL,
  GET_META_REQUEST,
  GET_META_SUCCESS,
  GET_META_FAIL
} from '../actions/Threads';


const initialState = { requestPending: false, publishCommentRequestPending: false, threads: [] };

const updateThreads = (threads, updatedThread) =>
  threads.map(thread => (thread._id === updatedThread._id ? updatedThread : thread));

export default (state = initialState, action) => {

  let threads, threadsList;

  switch (action.type) {

    case GET_META_REQUEST:
      return { ...state, getMetaRequestPending: true, error: null };
    case GET_META_SUCCESS:
      return { ...state, getMetaRequestPending: false, meta: action.meta };
    case GET_META_FAIL:
      return { ...state, getMetaRequestPending: false, error: action.error };

    case PUBLISH_THREAD_REQUEST:
      return { ...state, publishThreadRequestPending: true, error: null };
    case PUBLISH_THREAD_SUCCESS:
      return { ...state, publishThreadRequestPending: false, publishedThread: action.newThreadData };
    case PUBLISH_THREAD_FAIL:
      return { ...state, publishThreadRequestPending: false, error: action.error };

    case UPDATE_THREAD_REQUEST:
      return { ...state, updateThreadRequestPending: true, error: null };
    case UPDATE_THREAD_SUCCESS:
      return { ...state, updateThreadRequestPending: false, updatedThread: action.newThreadData };
    case UPDATE_THREAD_FAIL:
      return { ...state, updateThreadRequestPending: false, error: action.error };

    case GET_THREAD_REQUEST:
      return { ...state, getThreadRequestPending: true, error: null };
    case GET_THREAD_SUCCESS:
      return { ...state, getThreadRequestPending: false, thread: action.thread };
    case GET_THREAD_FAIL:
      return { ...state, getThreadRequestPending: false, error: action.error };

    case GET_THREADS_REQUEST:
      if (action.anchor === 1) {
        return { ...state, getThreadsRequestPending: true, initRequestPending: true, threads: [], threadsData: [], error: null }
      }
      return { ...state, getThreadsRequestPending: true, threads: state.threads.concat([...new Array(5)].map(() => ({ loading: true }))), error: null }
    case GET_THREADS_SUCCESS:
      threadsList = state.threadsData.concat(action.threads.threads);
      return { ...state, getThreadsRequestPending: false, initRequestPending: false, threads: threadsList, threadsData: threadsList, totalThreads: action.threads.totalThreads };
    case GET_THREADS_FAIL:
      return { ...state, getThreadsRequestPending: false, initRequestPending: false, error: action.error };

    case PUBLISH_COMMENT_REQUEST:
      return { ...state, publishCommentRequestPending: true, error: null };
    case PUBLISH_COMMENT_SUCCESS:
      return { ...state, publishCommentRequestPending: false, thread: action.thread };
    case PUBLISH_COMMENT_FAIL:
      return { ...state, publishCommentRequestPending: false, error: action.error };

    case CAST_POINT_REQUEST:
      let castPointRequestPending = action.charge + action.threadId;
      return { ...state, castPointRequestPending, error: null };
    case CAST_POINT_SUCCESS:
      if (action.compact) {
        threads = updateThreads(state.threads, action.thread);
        return { ...state, castPointRequestPending: false, threads: threads };
      } else {
        return { ...state, castPointRequestPending: false, thread: action.thread };
      }
    case CAST_POINT_FAIL:
      return { ...state, castPointRequestPending: false, error: action.error };

    case DELETE_THREAD_REQUEST:
      return { ...state, deleteThreadRequestPending: action.threadId, error: null };
    case DELETE_THREAD_SUCCESS:
      threads = state.threads.filter(i => i._id !== action.threadId);
      return { ...state, deleteThreadRequestPending: false, threads, threadsData: threads, totalThreads: state.totalThreads - 1, thread: null, deletedThreadId: action.threadId };
    case DELETE_THREAD_FAIL:
      return { ...state, deleteThreadRequestPending: false, error: action.error };

    case DELETE_COMMENT_REQUEST:
      return { ...state, deleteCommentRequestPending: action.commentId, error: null };
    case DELETE_COMMENT_SUCCESS:
      let thread = { ...state.thread, comments: state.thread.comments.filter(i => i._id !== action.responseCommentId) };
      return { ...state, deleteCommentRequestPending: false, thread };
    case DELETE_COMMENT_FAIL:
      return { ...state, deleteCommentRequestPending: false, error: action.error };

    default:
      return state;
  }
}