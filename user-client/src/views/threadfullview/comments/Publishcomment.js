import React, { Component } from 'react'
import { Button, Input } from 'antd';
import classes from './Publishcomment.module.css';
import { Link } from 'react-router-dom';

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

                {   /*     Loading Modal    */
                    !this.props.token ?
                        <React.Fragment>
                            <Link to="/signin"><span
                                style={{ zIndex: 100, position: "absolute", bottom: "10%", left: "5%" }}

                            >Sign in to leave a comment.</span></Link>
                            <div className={classes.loading}>
                            </div>
                        </React.Fragment> :
                        null
                }

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