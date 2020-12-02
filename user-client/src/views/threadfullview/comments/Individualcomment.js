import React, { Component } from 'react';
import { Spin, Dropdown, Menu } from 'antd';
import { StopOutlined, DeleteOutlined, MoreOutlined, LoadingOutlined, UserOutlined } from '@ant-design/icons';
import timeSince from '../../../helper/Timesince';
import classes from './Individualcomment.module.css';
import { Link } from 'react-router-dom';
const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const commentOptions = (deleteCommentAction, token, _id, threadId, myUsername, username, deleteCommentRequestPending) => (
    <Menu>

        <Menu.Item className={classes.optionsmenutext}>
            <Link to="#">
                <StopOutlined />  Report
            </Link>
        </Menu.Item>

        { myUsername === username ?
            (<Menu.Item disabled={deleteCommentRequestPending} danger>
                <span onClick={() => deleteCommentAction(token, threadId, _id)} >
                    <DeleteOutlined />Delete comment
                </span>
            </Menu.Item>
            ) :
            null}

    </Menu>
);

class Individualcomment extends Component {

    render() {
        const { deleteCommentAction, deleteCommentRequestPending, token, _id, threadId, content, createdAt, myUsername } = this.props;
        //_id is commentId, myUsername is username decoded from token

        return (
            <div className={classes.individualcommentcontainer}>
                <div className={classes.individualcommenttopbox}>

                    <span className={classes.individualcommenttopboxleftwrapper}>
                        <span className={classes.username}><UserOutlined />{this.props.commentauthor.username} </span>
                        <span className={classes.date}>{timeSince(createdAt)}</span>
                    </span>
                    <span className={classes.commentoptionsmenu}>
                        {deleteCommentRequestPending === _id ?
                            <React.Fragment>
                                <Spin
                                    indicator={loadingIcon}
                                    style={{ zIndex: 100, position: "absolute", top: "50%", left: "50%" }}
                                />
                                <div className={classes.loading}>
                                </div>
                            </React.Fragment> :
                            null}
                        <Dropdown overlay={() => commentOptions(deleteCommentAction, token, _id, threadId, myUsername, this.props.commentauthor.username, deleteCommentRequestPending)}>
                            <MoreOutlined rotate="90" style={{ cursor: "pointer" }} />
                        </Dropdown>
                    </span>

                </div>

                <div className={classes.individualcommentcontentbox}>
                    <p>{content}</p>
                </div>
                <div className={classes.individualcommentoptionsbox}>
                </div>

            </div>
        )

    }

}

export default Individualcomment;