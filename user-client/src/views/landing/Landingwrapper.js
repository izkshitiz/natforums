import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import Landing from './Landing';
import { signoutUserAction } from '../../store/actions/Auth';

const mapStateToProps = state => ({
  username: state.Auth.username,
  token: state.Auth.token
});

const mapDispatchToProps = { signoutUserAction };
const enhance = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
);

const Landingwrapper = enhance(Landing);

export default Landingwrapper;
