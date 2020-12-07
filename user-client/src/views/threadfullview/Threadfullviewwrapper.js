import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { getThreadAction, deleteThreadAction, publishCommentAction, deleteCommentAction } from '../../store/actions/Threads';
import Threadfullview from './Threadfullview';

const mapStateToProps = state => ({
  myUsername: state.Auth.username,
  accessLevel: state.Auth.accessLevel,
  token: state.Auth.token,
  publishCommentRequestPending: state.Threads.publishCommentRequestPending,
  deleteThreadRequestPending:state.Threads.deleteThreadRequestPending,
  deleteCommentRequestPending: state.Threads.deleteCommentRequestPending,
  deletedThreadId: state.Threads.deletedThreadId,
  thread: state.Threads.thread && state.Threads.thread
});

const mapDispatchToProps = {
  getThreadAction,
  deleteThreadAction,
  publishCommentAction,
  deleteCommentAction
};

const enhance = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
);

const Threadfullviewwrapper = enhance(Threadfullview);

export default Threadfullviewwrapper;
