import React, { Component } from 'react'
import { Button, Input } from 'antd';
import classes from './Publishcomment.module.css';

const { TextArea } = Input;

class Publishcomment extends Component {

    state = {
        comment: "",
    }

    componentDidUpdate(prevProp) {

        if (this.props.updatedAt > prevProp.updatedAt) {// If comment is published clear the text.
            this.setState({ comment: "" })
        }

    }

    onTextChange = (e) => {
        this.setState({ comment: e.target.value })
    }

    render() {
        return (
            <div className={classes.publishcommentcontainer}>
                <TextArea onChange={this.onTextChange} value={this.state.comment} showCount maxLength={400} autoSize={{ minRows: 3, maxRows: 6 }} allowClear />
                <Button
                    style={{ marginTop: 10 }}
                    loading={this.props.publishCommentRequestPending}
                    onClick={() => this.props.publishCommentAction
                        (
                            this.props.token,
                            this.props.threadId,
                            this.state.comment
                        )
                    }
                >Publish</Button>
            </div>
        );
    }
}

export default Publishcomment;