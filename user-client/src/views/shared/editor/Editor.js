//https://quilljs.com/docs/modules/toolbar/
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { FileAddOutlined, PictureOutlined, VideoCameraAddOutlined, YoutubeOutlined, LinkOutlined, LoadingOutlined } from '@ant-design/icons';
import ReactQuill, { Quill } from 'react-quill';
import { message, Spin } from 'antd';
import { HOST_URL } from '../../../helper/Url';
import ImageBlot from '../elements/Imageblot';
import VideoBlot from '../elements/Videoblot';
import FileBlot from '../elements/Fileblot';
import "react-quill/dist/quill.snow.css";
import classes from './Editor.module.css';

const maxMediaSize = 500000 //in Bytes ~ 500 KB
const maxFileSize = 1000000 //in Bytes ~ 1 MB
const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
// Level of  debug log
Quill.debug('error');

// Register custom elements with quill
Quill.register(ImageBlot);
Quill.register(VideoBlot);
Quill.register(FileBlot);

// Add or modify icons of toolbar
const icons = Quill.import('ui/icons');
const fileIcon = ReactDOMServer.renderToString(<FileAddOutlined />);
const imageIcon = ReactDOMServer.renderToString(<PictureOutlined />);
const videoIcon = ReactDOMServer.renderToString(<VideoCameraAddOutlined />);
const ytIcon = ReactDOMServer.renderToString(<YoutubeOutlined />);
const linkIcon = ReactDOMServer.renderToString(<LinkOutlined />);
icons.uploadFile = fileIcon;
icons.uploadImage = imageIcon;
icons.uploadVideo = videoIcon;
icons.video = ytIcon;
icons.link = linkIcon;

// Formating and toolbar options 
const options = [
    ['bold', 'italic', 'underline', 'strike'],
    ['link', 'video', 'uploadImage', 'uploadVideo', 'uploadFile'],

    ['blockquote', 'code-block'],

    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],

    [{ 'align': [] }],

    ['clean']
];



class Editor extends React.Component {

    constructor(props) {
        super(props);
        this.reactQuillRef = null;
        this.ImageRef = React.createRef();
        this.VideoRef = React.createRef();
        this.FileRef = React.createRef();
    }

    state = {
        editorHtml: (this.props.thread && this.props.thread.content) || ""
    };

    componentDidUpdate(prevProps) {
        if (this.props.uploadedImage && (prevProps.uploadedImage !== this.props.uploadedImage)) {
            this.addImage(this.props.uploadedImage);
        }
        if (this.props.uploadedVideo && (prevProps.uploadedVideo !== this.props.uploadedVideo)) {
            this.addVideo(this.props.uploadedVideo);
        }
        if (this.props.uploadedFile && (prevProps.uploadedFile !== this.props.uploadedFile)) {
            this.addFile(this.props.uploadedFile);
        }
    }

    handleChange = async (html) => {
        this.setState({
            editorHtml: html
        }, () => {
            this.props.onEditorChange(this.state.editorHtml);
        });
    };

    imageHandler = () => {
        this.ImageRef.current.click();
    };

    videoHandler = () => {
        this.VideoRef.current.click();
    };

    fileHandler = () => {
        this.FileRef.current.click();
    };

    // Media and files are uploaded to the server first and then added to the editor

    uploadImage = (e) => {
        if (e.currentTarget.files.length > 0) {
            if (process.env.NODE_ENV === "production") {
                message.warn("Feature has been disabled temporarily in production environment. Read the docs for more info.");
                return;
            }
            if (e.currentTarget.files[0].size > maxMediaSize) {
                message.warn("Image exceeds max file size of " + maxMediaSize / 1000 + " KB");
                return;
            }
            const file = e.currentTarget.files[0];
            const token = this.props.token;
            let formData = new FormData();
            formData.append("media", file);
            this.props.uploadImageAction(token, formData);
        } else {
            message.error("No image selected");
        }
    }

    addImage = (uploadedImage) => {
        const quill = this.reactQuillRef.getEditor();
        quill.focus();
        let range = quill.getSelection();
        //Get the position of text cursor
        let position = range ? range.index : 0;
        quill.insertEmbed(position, "image", { src: HOST_URL + "/" + uploadedImage.filePath.substring(7), alt: uploadedImage.alt.replace(/\.[^/.]+$/, "") });
        quill.setSelection(position + 1);
    }

    uploadVideo = (e) => {
        if (e.currentTarget.files.length > 0) {
            if (process.env.NODE_ENV === "production") {
                message.warn("Feature has been disabled temporarily in production environment. Read the docs for more info.");
                return;
            }
            if (e.currentTarget.files[0].size > maxMediaSize) {
                message.warn("Video exceeds max file size of " + maxMediaSize / 1000 + " KB");
                return;
            }
            const file = e.currentTarget.files[0];
            const token = this.props.token;
            let formData = new FormData();
            formData.append("media", file);
            this.props.uploadVideoAction(token, formData)
        }
        else {
            message.error("No video selected");
        }
    }

    addVideo = (uploadedVideo) => {
        const quill = this.reactQuillRef.getEditor();
        quill.focus();
        let range = quill.getSelection();
        //Get the position of text cursor
        let position = range ? range.index : 0;
        quill.insertEmbed(position, "video", { src: HOST_URL + "/" + uploadedVideo.filePath.substring(7), title: uploadedVideo.alt.replace(/\.[^/.]+$/, "") });
        quill.setSelection(position + 1);
    }

    uploadFile = (e) => {
        if (e.currentTarget.files.length > 0) {
            if (process.env.NODE_ENV === "production") {
                message.warn("Feature has been disabled temporarily in production environment. Read the docs for more info.");
                return;
            }
            if (e.currentTarget.files[0].size > maxFileSize) {
                message.warn("File exceeds max file size of " + maxFileSize / 1000000 + " MB");
                return;
            }
            const file = e.currentTarget.files[0];
            const token = this.props.token;
            let formData = new FormData();
            formData.append("file", file);
            this.props.uploadFileAction(token, formData);
        }
        else {
            message.error("No File Selected");
        }
    }

    addFile = (uploadedFile) => {
        const quill = this.reactQuillRef.getEditor();
        quill.focus();
        let range = quill.getSelection();
        //Get the position of text cursor
        let position = range ? range.index : 0;
        quill.insertEmbed(position, "file", { href: HOST_URL + "/" + uploadedFile.filePath.substring(7), name: uploadedFile.name.replace(/\.[^/.]+$/, "") });
        quill.setSelection(position + 1);
    };


    modules = {
        syntax: true,
        toolbar: {
            container: options,
            handlers: {
                'uploadImage': this.imageHandler,
                'uploadVideo': this.videoHandler,
                'uploadFile': this.fileHandler,
            }
        },

    };

    render() {

        return (
            <div className={classes.editorcontainer}>

                {   /*     Loading Modal    */
                    this.props.uploadPending ?
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

                <ReactQuill
                    ref={(el) => { this.reactQuillRef = el }}
                    // theme={'snow'}
                    onChange={this.handleChange}
                    modules={this.modules}
                    value={this.state.editorHtml}
                    placeholder={this.props.placeholder}
                />
                {/*onChange will also prevent same media from being added twice*/}
                <input hidden type="file" accept="image/*" ref={this.ImageRef} onChange={this.uploadImage} />
                <input hidden type="file" accept="video/*" ref={this.VideoRef} onChange={this.uploadVideo} />
                <input hidden type="file" accept="*" ref={this.FileRef} onChange={this.uploadFile} />
            </div>
        )
    }


}

export default Editor;