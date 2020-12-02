const timeSince = (dateAndTime) => {
    let seconds = Math.floor((new Date() - dateAndTime) / 1000);
    let instant = seconds / 31536000;

    if (instant > 1) {
        if (instant >= 2) {
            return Math.floor(instant) + " years ago";
        }
        return Math.floor(instant) + " year ago";
    }

    instant = seconds / 2592000;
    if (instant > 1) {
        if (instant >= 2) {
            return Math.floor(instant) + " months ago";
        }
        return Math.floor(instant) + " month ago";
    }

    instant = seconds / 86400;
    if (instant > 1) {
        if (instant >= 2) {
            return Math.floor(instant) + " days ago";
        }
        return Math.floor(instant) + " day ago";
    }

    instant = seconds / 3600;
    if (instant > 1) {
        if (instant >= 2) {
            return Math.floor(instant) + " hours ago";
        }
        return Math.floor(instant) + " hour ago";
    }

    instant = seconds / 60;
    if (instant > 1) {
        if (instant >= 2) {
            return Math.floor(instant) + " minutes ago";
        }
        return Math.floor(instant) + " minute ago";
    }
    if (seconds <= 1) {
        return Math.floor(seconds) + " second ago";
    }
    return Math.floor(seconds) + " seconds ago";
}

export default timeSince;

