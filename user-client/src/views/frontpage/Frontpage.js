import React, { Component } from 'react';
import Sectioncard from './Sectioncard';
import all from '../../resources/images/all.svg';
import booksImage from '../../resources/images/books.svg';
import financeImage from '../../resources/images/finance.svg';
import programmingImage from '../../resources/images/programming.svg';
import scienceImage from '../../resources/images/science.svg';
import spaceImage from '../../resources/images/space.svg';
import techImage from '../../resources/images/tech.svg';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import classes from './Frontpage.module.css';

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

let sections = ["Books", "Finance", "Programming", "Science", "Space", "Technology"];

class Frontpage extends Component {

    componentDidMount() {
        //Get title of threads with most points.- "All" - three 
        //Get title of latest threads of each section. - three
        this.props.getMetaAction(sections)
    }

    render() {
        if (this.props.getMetaRequestPending || !this.props.meta) {
            return <Spin indicator={loadingIcon} style={{ marginTop: 20, gridColumn: "8" }} />
        }
        return (
            <React.Fragment>
                <div className={classes.contentwrapper}>
                    <Sectioncard
                        image={all}
                        title={"All"}
                        description={"Best of everything."}
                        meta={this.props.meta.All} />
                    <Sectioncard
                        image={booksImage}
                        title={"Books"}
                        description={"Recommend, review and discuss your favourite books."}
                        meta={this.props.meta.Books} />
                    <Sectioncard
                        image={financeImage}
                        title={"Finance"}
                        description={"Discuss anything from your personal finance to economy of the state."}
                        meta={this.props.meta.Finance} />
                    <Sectioncard
                        image={programmingImage}
                        title={"Programming"}
                        description={"Share your projects and other intersting stuff in the world of programming."}
                        meta={this.props.meta.Programming} />
                    <Sectioncard
                        image={scienceImage}
                        title={"Science"}
                        description={"Science in making new breakthrough everyday. What are you excited about?"}
                        meta={this.props.meta.Science} />
                    <Sectioncard
                        image={spaceImage}
                        title={"Space"}
                        description={"Everything from your telescope to spacex setting new record."}
                        meta={this.props.meta.Space} />
                    <Sectioncard
                        image={techImage}
                        title={"Technology"}
                        description={"Artifical intelligence, blockchain, cloud computing, biotechnology and everything in between."}
                        meta={this.props.meta.Technology} />
                </div>
            </React.Fragment>
        )
    }
}
export default Frontpage;