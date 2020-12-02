import React from 'react';
import { Menu, Dropdown } from 'antd';
import {Link} from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';
import classes from './Dropdownui.module.css';
const Dropdownui = () => {

  return <Dropdown overlay={menu}>
    <span className={classes.dropdownui} onClick={e => e.preventDefault()}>
      Sections <DownOutlined />
    </span>
  </Dropdown>

}

const menu = (
  <Menu>
    <Menu.Item>
      <Link to="/All">
        All
        </Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/s/Books">
        Books
        </Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/s/Finance">
        Finance
        </Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/s/Programming">
        Programming
        </Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/s/Science">
        Science
        </Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/s/Space">
        Space
        </Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/s/Technology">
        Technology
        </Link>
    </Menu.Item>
  </Menu>
);


export default Dropdownui;