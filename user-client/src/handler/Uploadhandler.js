import { message } from "antd";
import { HOST_URL } from "../helper/Const";

export const cloudUploadHandler = async (token, file) => {

    let signResponse;
    try {
        signResponse = await fetch(`${HOST_URL}/sign-s3?file-name=${file.name}&file-type=${file.type}`, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + token,
                'Accept': 'application/json'
            },
        })
    }
    catch (error) {
        message.error(error);
    }

    if (signResponse.ok) {
        const responseJson = await signResponse.json();
        const signedRequest = responseJson.signedRequest;
        const url = responseJson.url;

        let cloudUploadResponse;
        try {
            cloudUploadResponse = await fetch(signedRequest, {
                method: 'PUT',
                body: file
            })
        }
        catch (error) {
            message.error(error);
        }

        if (cloudUploadResponse.ok) {
            const uploadedFile = {
                url,
                filename: file.name
            }
            return uploadedFile;
        } else {
            message.error("Unable to upload file.");
        }

    } else {
        message.error("Unable to connect to the server.");
    }

};

export const uploadMediaHandler = async (token, file) => {

    let formData = new FormData();
    formData.append("media", file);

    let response;

    try {
        response = await fetch(`${HOST_URL}/mediaUpload`, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + token
            },
            body: formData
        })
    }
    catch (error) {
        message.error(error);
    }

    if (response.ok) {
        const responseJson = await response.json();
        return responseJson;
    } else {
        const responseJson = await response.json();
        message.error(responseJson.errors[0].message);
    }


};

export const uploadFileHandler = async (token, file) => {

    let formData = new FormData();
    formData.append("file", file);

    let response;

    try {
        response = await fetch(`${HOST_URL}/fileUpload`, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + token
            },
            body: formData
        })
    }
    catch (error) {
        message.error(error);
    }

    if (response.ok) {
        const responseJson = await response.json();
        return responseJson;
    } else {
        const responseJson = await response.json();
        message.error(responseJson.errors[0].message);
    }


};
