import React from 'react';
import { Link } from 'react-router-dom';
import classes from './Sectioncards.module.css';
import timeSince from '../../helper/Timesince';
import Dimensions from '../../helper/Dimensions';


const renderTitles = (i) => {
    return <Link key={i._id} className={classes.summarytext} to={"s/" + i.section + "/" + i._id}>
        <p>
            {i.title.replace(/^(.{110}[^\s]*).*/, "$1")}
            <span>
                {i.title.length > 110 ? "..." : null}
            </span>
            <span className={classes.time}>
                {" -" + timeSince(i.createdAt)}
            </span>
        </p>
    </Link>
}

const Sectioncard = (props) => {
    const { width } = Dimensions();
    const { image, title, description, meta } = props;
    let bgImage = (width > 991 ?
        null :
        `linear-gradient( 130deg, rgb(255, 255, 255,1) 0%, rgba(255, 255, 255, 0.8) 100%),url(${image})`
    );

    return (
        <div className={classes.cardcontainer}>

            {width >= 992 ?
                <div className={classes.imagesection}>
                    <img src={image} alt="" />
                </div> :
                null}

            {width >= 992 ?
                <div className={classes.textsection}>
                    <Link to={title === "All" ? "/All" : "/s/" + title}>
                        <h2>{title}</h2>
                    </Link>
                    <p>{description}</p>
                </div> :
                null}

            <div className={classes.summarysection} style={{ backgroundImage: bgImage }}>

                {width < 992 ?
                    <span className={classes.summarytitle}>
                        <Link to={title === "All" ? "/All" : "/s/" + title}>
                            <h2>{title}</h2>
                        </Link>
                    </span> :
                    null}

                <span className={classes.summarysubtext}>
                    {title !== "All" ? "Latest Threads" : "Top Threads"}
                </span>
                {meta.map(i => renderTitles(i))}
            </div>
        </div>
    )
}
export default Sectioncard;