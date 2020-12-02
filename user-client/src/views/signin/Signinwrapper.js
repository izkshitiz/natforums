import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { signinUserAction } from '../../store/actions/Auth';
import Signin from './Signin';

const mapStateToProps = state => ({
  requestPending: state.Auth.requestPending,
  token: state.Auth.token
});

const mapDispatchToProps = { signinUserAction };

const enhance = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
);

const Signinwrapper = enhance(Signin);

export default Signinwrapper;
