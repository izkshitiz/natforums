import { connect } from 'react-redux';
import { compose } from 'redux';
import { updateThreadAction, getThreadAction } from '../../store/actions/Threads';
import { uploadImageAction, uploadVideoAction, uploadFileAction } from '../../store/actions/Composethread';
import Updatethread from './Updatethread';
import { withRouter } from 'react-router-dom';


const mapStateToProps = state => ({
  token: state.Auth.token,
  thread: state.Threads.thread,
  updateThreadRequestPending: state.Threads.updateThreadRequestPending,
  threadUpdatedAt: state.Threads.updatedThread && state.Threads.updatedThread.updatedAt,
  slug: state.Threads.updatedThread && state.Threads.updatedThread._id,
  section: state.Threads.updatedThread && state.Threads.updatedThread.section,
  uploadedImage: state.Composethread.image && state.Composethread.image,
  uploadedVideo: state.Composethread.video && state.Composethread.video,
  uploadedFile: state.Composethread.file && state.Composethread.file,
  uploadPending: state.Composethread.uploadPending && state.Composethread.uploadPending
});

const mapDispatchToProps = {
  getThreadAction,
  uploadImageAction,
  uploadVideoAction,
  uploadFileAction,
  updateThreadAction
};

const enhance = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
);

const Updatethreadwrapper = enhance(Updatethread);

export default Updatethreadwrapper;
