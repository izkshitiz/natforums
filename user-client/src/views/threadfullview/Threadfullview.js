import React, { Component } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, List } from 'antd';
import Individualthread from '../shared/individualthread/Individualthread';
import Individualcomment from './comments/Individualcomment';
import Publishcomment from './comments/Publishcomment';
import classes from './Threadfullview.module.css';

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

class Threadfullview extends Component {
    state = {
        loading: true
    }

    componentDidMount() {
        this.props.getThreadAction(this.props.match.params.threadslug, this.props.token);
    }

    componentDidUpdate() {
        this.redirectIfThreadDeleted();
    }

    redirectIfThreadDeleted = () => {
        if (this.props.deletedThreadId && (this.props.deletedThreadId === this.props.match.params.threadslug)) {
            this.props.history.push('/');
        }
    }

    renderIndividualComments(item) {
        return <Individualcomment key={item._id}
            deleteCommentAction={this.props.deleteCommentAction}
            deleteCommentRequestPending={this.props.deleteCommentRequestPending}
            token={this.props.token}
            myUsername={this.props.myUsername}
            accessLevel={this.props.accessLevel}
            threadId={this.props.thread._id}
            compact={true}
            {...item} />
    }

    render() {

        if (!this.props.thread || this.props.thread._id !== this.props.match.params.threadslug) {
            return <Spin indicator={loadingIcon} style={{ marginTop: 20, gridColumn: "8" }} />

        }

        return (
            <div className={classes.contentwrapper}>
                <Individualthread
                    {...this.props.thread}
                    token={this.props.token}
                    myUsername={this.props.myUsername}
                    accessLevel={this.props.accessLevel}
                    deleteThreadAction={this.props.deleteThreadAction}
                    deleteThreadRequestPending={this.props.deleteThreadRequestPending} />

                {this.props.token ? <Publishcomment
                    publishCommentRequestPending={this.props.publishCommentRequestPending}
                    publishCommentAction={this.props.publishCommentAction}
                    token={this.props.token}
                    threadId={this.props.thread._id}
                    updatedAt={this.props.thread.updatedAt} /> :
                    null
                }

                <List
                    dataSource={this.props.thread.comments}
                    renderItem={item => this.renderIndividualComments(item)}
                >
                </List>
            </div>
        )

    }
}

export default Threadfullview;