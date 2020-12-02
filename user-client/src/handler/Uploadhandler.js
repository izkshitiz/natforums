import { message } from "antd";
import { HOST_URL } from "../helper/Url";

export const uploadMediaHandler = async (token, formData) => {

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

export const uploadVideoHandler = async (token, formData) => {

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

export const uploadFileHandler = async (token, formData) => {

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
