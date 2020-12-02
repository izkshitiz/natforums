import React, { Component } from 'react'
import Editor from '../shared/editor/Editor';
import { Button, Spin, Input, Radio } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import classes from './Updatethread.module.css';

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
let now;

class Updatethread extends Component {

    state = {
        id: "",
        title: "",
        section: "",
        content: ""
    }

    componentDidMount() {
        now = + new Date();
        this.redirectIfNotLoggedIn();
        this.getThreadToEdit()
    }

    componentDidUpdate(prevProp, prevState) {
        this.redirectIfNotLoggedIn();
        if (this.props.thread) {
            if (prevState.id !== this.props.thread._id) { this.loadEditorWithThread() }
        }
        this.redirectIfThreadSuccessfullySaved();
    }

    loadEditorWithThread() {
        this.setState({
            id: this.props.thread._id,
            title: this.props.thread.title,
            section: this.props.thread.section,
            content: this.props.thread.content
        })
    }

    getThreadToEdit() {
        this.props.getThreadAction(this.props.match.params.threadslug, this.props.token)
    }

    redirectIfNotLoggedIn() {
        if (!this.props.token) this.props.history.push('/Signin');
    }

    redirectIfThreadSuccessfullySaved() {
        if (this.props.threadUpdatedAt && this.props.threadUpdatedAt) {
            // if thread updation time is after the component mount time, redirect to the new thread page.
            let redirect = Boolean(this.props.threadUpdatedAt > now);
            if (redirect) this.props.history.push('/s/' + this.props.section + '/' + this.props.slug);
        }
    }

    onTitleChange = (e) => {
        this.setState({ title: e.target.value })
    }

    onEditorChange = (value) => {
        this.setState({ content: value });
    }

    onFilesChange = (files) => {
        this.setState({ files });
    }

    handleSectionChange = (e) => {
        this.setState({ section: e.target.value })
    }
    onSubmit = (e) => {
        e.preventDefault();
        let threadData = {
            id: this.state.id,
            title: this.state.title,
            section: this.state.section,
            content: this.state.content,
        }
        this.props.updateThreadAction(threadData, this.props.token)
    }

    render() {
        if (!this.props.thread || this.props.thread._id !== this.props.match.params.threadslug) {
            return <Spin indicator={loadingIcon} style={{ marginTop: 20, gridColumn: "8" }} />
        }

        return (
            <div className={classes.contentwrapper}>
                <div className={classes.updatethreadcontainer}>
                    <h3>Title</h3>
                    <Input placeholder="Tip: use keyword early in your title " value={this.state.title} onChange={this.onTitleChange}></Input>
                    <h3>Section</h3>
                    <Radio.Group value={this.state.section} size="small" buttonStyle="outline" onChange={this.handleSectionChange}>
                        <Radio.Button style={{ margin: 5 }} value="Books">Books</Radio.Button>
                        <Radio.Button style={{ margin: 5 }} value="Finance">Finance</Radio.Button>
                        <Radio.Button style={{ margin: 5 }} value="Programming">Programming</Radio.Button>
                        <Radio.Button style={{ margin: 5 }} value="Science">Science</Radio.Button>
                        <Radio.Button style={{ margin: 5 }} value="Space">Space</Radio.Button>
                        <Radio.Button style={{ margin: 5 }} value="Technology">Technology</Radio.Button>
                    </Radio.Group>
                    <h3 >Content</h3>
                    <Editor
                        placeholder={"Hey! You. write here."}
                        onEditorChange={this.onEditorChange}
                        onFilesChange={this.onFilesChange}
                        user={this.props.token}
                        thread={this.props.thread}
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
                            <Button size="large" disabled={this.props.uploadPending} loading={this.props.updateThreadRequestPending} onClick={this.onSubmit}>Update</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Updatethread;