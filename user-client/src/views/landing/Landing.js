import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import { Menu, Button } from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import Signinwrapper from '../signin/Signinwrapper';
import Signupwrapper from '../signup/Signupwrapper';
import Frontpagewrapper from '../frontpage/Frontpagewrapper';
import Publishthreadwrapper from '../publishthread/Publishthreadwrapper';
import Updatethreadwrapper from '../updatethread/Updatethreadwrapper';
import Threadfullviewwrapper from '../threadfullview/Threadfullviewwrapper';
import Threadslistwrapper from '../threadslistview/Threadslistwrapper';
import Dropdownui from '../shared/Dropdownui';
import logo from '../../resources/default-monochrome.svg';
import classes from './Landing.module.css';

const { SubMenu } = Menu;

class Landing extends Component {
  state = {
    current: '',
  }

  handleClick = e => {
    this.setState({ current: e.key });
  };

  Signout = () => {
    this.props.signoutUserAction();
  }

  render() {
    const current = this.props.history.location.pathname;
    return (
      <React.Fragment>
        <div className={classes.Container}>
          <div className={classes.navbarcontainer}>
            <div className={classes.logocol} ><Link to=""><img src={logo} alt="companay-logo" width="130" /></Link></div>
            <div className={classes.navlist}>

              {!this.props.username ?
                <Menu forceSubMenuRender="true" subMenuCloseDelay={0.4} onClick={this.handleClick} selectedKeys={[current]} mode="horizontal">
                  <SubMenu icon={<UserOutlined style={{ marginLeft: 10 }} />}>{/* Bug, using marginLeft to center icon */}
                    <Menu.Item key="/Signin" >
                      <Link to="/Signin">Sign in</Link>
                    </Menu.Item>
                    <Menu.Item key="/Signup" >
                      <Link to="/Signup">Signup</Link>
                    </Menu.Item>
                  </SubMenu>
                </Menu> :
                <Menu forceSubMenuRender="true" subMenuCloseDelay={0.4} onClick={this.handleClick} selectedKeys={[current]} mode="horizontal">
                  <SubMenu title={this.props.username}>
                    <Menu.Item onClick={this.Signout}>Logout</Menu.Item>
                  </SubMenu>
                </Menu>}

            </div>
          </div>

          <div className={classes.secondnavigation}>
            <div><span className={classes.secondnavigationsectiontext}><Dropdownui /></span></div>
            <div>
              <Link to={current === "/Signin" ? "/Signup" : (current === "/Signup" ? "/Signin" : "/Newthread")}>
                <Button
                  size="medium"
                  type="primary"
                  children={current === "/Signin" ? "Sign Up" : (current === "/Signup" ? "Sign In" : <span style={{fontWeight:500}}>New Thread</span>)}
                  icon={current === "/Signin" || current === "/Signup" ? null : <PlusOutlined />}
                ></Button>
              </Link>
            </div>
          </div>
          <div className={classes.contentcontainer}>
            <Switch>
              <Route path='/' exact render={() => <Frontpagewrapper />} />
              <Route path='/all' exact render={() => <Threadslistwrapper />} />
              <Route path='/Newthread' exact render={() => <Publishthreadwrapper />} />
              <Route path='/Editthread/:threadslug' exact render={() => <Updatethreadwrapper />} />
              <Route path='/Signin' exact render={() => <Signinwrapper />} />
              <Route path='/Signup' exact render={() => <Signupwrapper />} />
              <Route path='/s/:section' exact render={() => <Threadslistwrapper />} />
              <Route path='/s/:section/:threadslug' exact render={() => <Threadfullviewwrapper />} />
              <Route path='/u/:user' exact render={() => <Threadslistwrapper />} />
            </Switch>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Landing;