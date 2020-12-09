import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Popover, Dropdown, Menu, Spin } from 'antd';
import {
    MoreOutlined,
    StopOutlined,
    EditOutlined,
    DeleteOutlined,
    LinkedinFilled,
    ShareAltOutlined,
    TwitterOutlined,
    RedditCircleFilled,
    FacebookFilled,
    CommentOutlined,
    UserOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import { Point } from './point/Point'
import timeSince from '../../../helper/Timesince';
import './Individualthreadquill.css' //css to customize quill formatting.
import classes from './Individualthread.module.css';

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const socialIcons = (_id, section) => (
    <React.Fragment>
        <a target="_blank" rel="noopener noreferrer" href={"https://twitter.com/intent/tweet?url=" + window.location.hostname + ".com/s/" + section + "/" + _id}>
            <TwitterOutlined style={{ color: "#1da1f2" }} />
        </a>
        <a target="_blank" rel="noopener noreferrer" href={"https://reddit.com/submit?url=" + window.location.hostname + ".com/s/" + section + "/" + _id}>
            <RedditCircleFilled style={{ marginLeft: 20, color: "#ff4500" }} />
        </a>
        <a target="_blank" rel="noopener noreferrer" href={"https://www.facebook.com/sharer/sharer.php?u=" + window.location.hostname + ".com/s/" + section + "/" + _id}>
            <FacebookFilled style={{ marginLeft: 20, color: "#4267B2" }} />
        </a>
        <a target="_blank" rel="noopener noreferrer" href={"https://www.linkedin.com/shareArticle?mini=true&url=" + window.location.hostname + ".com/s/" + section + "/" + _id}>
            <LinkedinFilled style={{ marginLeft: 20, color: "#0073b1" }} />
        </a>
    </React.Fragment>
)

const threadOptions = (_id, token, myUsername, username, accessLevel, deleteThreadAction) => (
    <Menu>
        <Menu.Item className={classes.optionsmenutext}>
            <Link to="#">
                <StopOutlined />  Report
            </Link>
        </Menu.Item>

        { myUsername === username || accessLevel === 7 ? (
            <React.Fragment>
                <Menu.Item  >
                    <Link to={"/Editthread/" + _id} >
                        <EditOutlined />  Edit thread
        </Link>
                </Menu.Item>
                <Menu.Item danger>
                    <span onClick={() => deleteThreadAction(_id, token)}>
                        <DeleteOutlined />  Delete thread
        </span>
                </Menu.Item>
            </React.Fragment>
        ) :
            null
        }

    </Menu>
);

class Individualthread extends PureComponent {

    render() {
        const { _id,
            title,
            section,
            summary,
            content,
            createdAt,
            comments,
            compact,
            userpoints,
            totalpoints,
            token,
            myUsername,
            accessLevel,
            deleteThreadRequestPending,
            deleteThreadAction } = this.props;

        return (
            <div className={classes.individualthreadcontainer}>

                {   /*     Loading Modal    */
                    deleteThreadRequestPending === _id ?
                        <React.Fragment>
                            <Spin
                                indicator={loadingIcon}
                                style={{ zIndex: 100, position: "absolute", top: "50%", left: "50%" }}
                            />
                            <div className={classes.loading}>
                            </div>
                        </React.Fragment> :
                        null
                }

                <div className={classes.individualthreadtopbox}>
                    <span className={classes.leftwrapper}>
                        <span className={classes.name}><Link to={"/u/" + this.props.author.username}><UserOutlined /> {this.props.author.username} </Link></span>
                        <span className={classes.publishedtext}>published</span>
                        <span className={classes.date}>{timeSince(createdAt)}</span>
                        <span className={classes.sectiontext}>in </span>
                        <span className={classes.sectiontext}><Link to={"/s/" + section}>{section}</Link></span>
                    </span>
                    <span className={classes.threadoptionsmenu}> <Dropdown overlay={() => threadOptions(_id, token, myUsername, this.props.author.username, accessLevel, deleteThreadAction)}><MoreOutlined rotate="90" style={{ cursor: "pointer" }} /></Dropdown></span>
                </div>

                {/*Changing the style for content box depending where the component is rendered. */}
                <div className={!compact ? classes.individualthreadcontentbox : classes.individualthreadcontentboxcompact}>

                    {/* Render with link tag if list(compact==true) view */}
                    {compact ? <Link to={"/s/" + section + "/" + _id}>
                        <h2>{title}</h2>
                        <section dangerouslySetInnerHTML={{ __html: summary }} />
                    </Link> : (<React.Fragment><h2>{title}</h2>
                        <section dangerouslySetInnerHTML={{ __html: content }} /></React.Fragment>)}

                </div>

                <div className={classes.individualthreadoptionsbox}>
                    <Popover placement="bottom" content={socialIcons(_id, section)} >
                        <ShareAltOutlined style={{ cursor: "pointer" }} />
                    </Popover>
                    <span><CommentOutlined />{" "}{comments.length}</span>
                    <Point compact={compact} userpoints={userpoints} threadId={_id} charge="positive" />
                    <span style={{ color: "black", width: 30, backgroundColor: "rgb(255, 223, 223)", paddingBottom: 1, borderRadius: 5, textAlign: "center" }}>{" " + totalpoints}</span>
                    <Point compact={compact} userpoints={userpoints} threadId={_id} charge="negative" />
                </div>
            </div>
        )

    }

}

export default Individualthread;