import {
    UPLOAD_IMAGE_REQUEST,
    UPLOAD_IMAGE_SUCCESS,
    UPLOAD_IMAGE_FAIL,
    UPLOAD_VIDEO_REQUEST,
    UPLOAD_VIDEO_SUCCESS,
    UPLOAD_VIDEO_FAIL,
    UPLOAD_FILE_REQUEST,
    UPLOAD_FILE_SUCCESS,
    UPLOAD_FILE_FAIL
} from '../actions/Composethread';

const initialState = {
    image: null,
    video: null,
    file: null
}

export default (state = initialState, action) => {
    switch (action.type) {

        case UPLOAD_IMAGE_REQUEST:
            return { ...state, uploadPending: true, image: null }
        case UPLOAD_IMAGE_SUCCESS:
            return { ...state, uploadPending: false, image: action.uploadedImage }
        case UPLOAD_IMAGE_FAIL:
            return { ...state, uploadPending: false, error: action.error }

        case UPLOAD_VIDEO_REQUEST:
            return { ...state, uploadPending: true, video: null }
        case UPLOAD_VIDEO_SUCCESS:
            return { ...state, uploadPending: false, video: action.uploadedVideo }
        case UPLOAD_VIDEO_FAIL:
            return { ...state, uploadPending: false, error: action.error }

        case UPLOAD_FILE_REQUEST:
            return { ...state, uploadPending: true, file: null }
        case UPLOAD_FILE_SUCCESS:
            return { ...state, uploadPending: false, file: action.uploadedFile }
        case UPLOAD_FILE_FAIL:
            return { ...state, uploadPending: false, error: action.error }

        default:
            return state;
    }
};