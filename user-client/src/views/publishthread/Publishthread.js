import React, { Component } from 'react'
import Editor from '../shared/editor/Editor';
import { Button, Input, Radio } from 'antd';
import classes from './Publishthread.module.css';

let now;

class Publishthread extends Component {

    state = {
        title: "",
        section: "Books",    //Default value
        content: ""
    }

    componentDidMount() {
        now = + new Date();
        this.redirectIfNotSignedIn();
    }

    componentDidUpdate() {
        this.redirectIfNotSignedIn();
        this.redirectIfThreadSuccessfullySaved();
    }

    redirectIfNotSignedIn() {
        if (!this.props.token) this.props.history.push('/Signin');
    }

    redirectIfThreadSuccessfullySaved() {
        if (this.props.threadPublishedAt && this.props.threadPublishedAt) {
            // if creation time of thread in redux store is later than the component mount time, redirect to the new thread page.
            let redirect = Boolean(this.props.threadPublishedAt > now);
            if (redirect) this.props.history.push('/s/' + this.props.section + '/' + this.props.slug);
        }

    }

    onTitleChange = (e) => {
        this.setState({ title: e.target.value });
    }

    onEditorChange = (content) => {
        this.setState({ content });
    }

    handleSectionChange = (e) => {
        this.setState({ section: e.target.value });
    }

    onSubmit = (e) => {
        e.preventDefault();
        let threadData = {
            title: this.state.title,
            section: this.state.section,
            content: this.state.content,
        };
        this.props.publishThreadAction(threadData, this.props.token);
    }

    render() {
        return (
            <div className={classes.contentwrapper}>
                <div className={classes.publishthreadcontainer}>
                    <h3>Title</h3>
                    <Input placeholder={"Tip : use keywords early in your tagline."} onChange={this.onTitleChange}></Input>
                    <h3>Section</h3>
                    <Radio.Group defaultValue="Books" size="small" buttonStyle="outline" onChange={this.handleSectionChange}>
                        <Radio.Button style={{ margin: 5 }} value="Books">Books</Radio.Button>
                        <Radio.Button style={{ margin: 5 }} value="Finance">Finance</Radio.Button>
                        <Radio.Button style={{ margin: 5 }} value="Programming">Programming</Radio.Button>
                        <Radio.Button style={{ margin: 5 }} value="Science">Science</Radio.Button>
                        <Radio.Button style={{ margin: 5 }} value="Space">Space</Radio.Button>
                        <Radio.Button style={{ margin: 5 }} value="Technology">Technology</Radio.Button>
                    </Radio.Group>
                    <h3 >Content</h3>
                    <Editor
                        placeholder={"Write here..."}
                        onEditorChange={this.onEditorChange}
                        token={this.props.token}
                        uploadImageAction={this.props.uploadImageAction}
                        uploadVideoAction={this.props.uploadVideoAction}
                        uploadFileAction={this.props.uploadFileAction}
                        uploadedImage={this.props.uploadedImage}
                        uploadedVideo={this.props.uploadedVideo}
                        uploadedFile={this.props.uploadedFile}
                        uploadPending={this.props.uploadPending}

                    />
                    <div className={classes.options}>
                        <div style={{ textAlign: 'right', margin: '2rem', }}>
                            <Button disabled={this.props.uploadPending} size="large" loading={this.props.publishThreadRequestPending} onClick={this.onSubmit}>Publish</Button>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default Publishthread;