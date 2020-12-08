export const HOST_URL =
    process.env.NODE_ENV === "production" ? process.env.REACT_APP_HOST : "http://localhost:8080";

export const UPLOAD_TYPE =
    process.env.NODE_ENV === "production" ? "cloud" : "host";

export const UPLOAD_SUPPORT =
    process.env.NODE_ENV === "production" ? process.env.REACT_APP_UPLOADS : "enabled";