import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { getThreadsAction, deleteThreadAction } from '../../store/actions/Threads';
import Threadslist from './Threadslist';

export const mapStateToProps = state => ({
  myUsername: state.Auth.username,
  accessLevel: state.Auth.accessLevel,
  token: state.Auth.token,
  threads: state.Threads.threads,
  totalThreads: state.Threads.totalThreads&&state.Threads.totalThreads,
  deleteThreadRequestPending:state.Threads.deleteThreadRequestPending,
  getThreadsRequestPending: state.Threads.getThreadsRequestPending,
  initRequestPending: state.Threads.initRequestPending
});

const mapDispatchToProps = { getThreadsAction, deleteThreadAction };

const enhance = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

const Threadslistwrappper = enhance(Threadslist);

export default Threadslistwrappper;
