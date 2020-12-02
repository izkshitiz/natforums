import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { getMetaAction } from '../../store/actions/Threads'
import Frontpage from './Frontpage';

const mapStateToProps = state => ({
  getMetaRequestPending: state.Threads.getMetaRequestPending,
  meta: state.Threads.meta
});

const mapDispatchToProps = { getMetaAction };

const enhance = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
);

const Frontpagewrapper = enhance(Frontpage);

export default Frontpagewrapper;
