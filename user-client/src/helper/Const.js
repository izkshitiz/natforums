export const HOST_URL = process.env.REACT_APP_HOST
  ? process.env.REACT_APP_HOST
  : "http://localhost:8080";

export const UPLOAD_TYPE =
  process.env.CLIENT_UPLOAD_TYPE === "cloud" ? "cloud" : "host";

export const UPLOAD_SUPPORT =
  process.env.REACT_APP_UPLOADS === "enabled" ? "enabled" : "disabled";
