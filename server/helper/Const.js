// Don't use capital letters for admin username
exports.ADMIN_USERNAME =
    process.env.NODE_ENV === "production" ? process.env.HOST_ADMIN_USERNAME : "superadmin";

exports.UPLOAD_SUPPORT =
    process.env.NODE_ENV === "production" ? process.env.HOST_UPLOADS : "enabled";