import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { uploadImageAction, uploadVideoAction, uploadFileAction } from '../../store/actions/Composethread';
import { publishThreadAction } from '../../store/actions/Threads';
import Publishthread from './Publishthread';

const mapStateToProps = state => ({
  token: state.Auth.token,
  publishThreadRequestPending: state.Threads.publishThreadRequestPending,
  threadPublishedAt: state.Threads.publishedThread && state.Threads.publishedThread.createdAt,
  slug: state.Threads.publishedThread && state.Threads.publishedThread._id,
  section: state.Threads.publishedThread && state.Threads.publishedThread.section,
  uploadedImage: state.Composethread.image && state.Composethread.image,
  uploadedVideo: state.Composethread.video && state.Composethread.video,
  uploadedFile: state.Composethread.file && state.Composethread.file,
  uploadPending: state.Composethread.uploadPending && state.Composethread.uploadPending,
});

const mapDispatchToProps = {
  uploadImageAction,
  uploadVideoAction,
  uploadFileAction,
  publishThreadAction
};

const enhance = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
);

const Publishthreadwrapper = enhance(Publishthread);

export default Publishthreadwrapper;
