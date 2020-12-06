import React, { Component } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import classes from './Signup.module.css'

class Signup extends Component {
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
    const { username, email, password } = values
    this.props.signupUserAction(username, email, password);
  };

  onFinishFailed = errorInfo => {
  };

  render() {
    return (
      <div className={classes.contentwrapper}>
        <div className={classes.signupformcontainer}>
          <Form
            name="basic"
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
              label="Username"
              name="username"
              rules={[{ required: true, pattern: "^[A-Za-z0-9]{1,16}$", message: 'Please use alphabets or numbers only. Max 16 characters' }]}
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
              <Button type="primary" htmlType="submit" loading={this.props.requestPending}>
                Submit
        </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default Signup;
