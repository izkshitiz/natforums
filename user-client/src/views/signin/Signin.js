import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import classes from './Signin.module.css'

class Signin extends React.Component {
  componentDidMount() {
    this.redirectIfLoggedIn();
  }

  componentDidUpdate() {
    this.redirectIfLoggedIn();
  }

  redirectIfLoggedIn() {
    if (this.props.token) this.props.history.push('/');
  }

  onFinish = values => {
    const { email, password } = values
    this.props.signinUserAction(email, password);
  };

  render() {
    return (
      <div className={classes.contentwrapper}>
        <div className={classes.signinformcontainer}>
          <Form
            name="SignIn"
            initialValues={{ remember: true }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            validateTrigger="onSubmit"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, type: "email", message: 'Please input your Email!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button loading={this.props.requestPending} type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default Signin;
