import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { signupUserAction } from '../../store/actions/Auth';
import Signup from './Signup';

const mapStateToProps = state => ({
  requestPending: state.Auth.requestPending,
  token: state.Auth.token
});

const mapDispatchToProps = { signupUserAction };

const enhance = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
);

const SignupFormContainer = enhance(Signup);

export default SignupFormContainer;
