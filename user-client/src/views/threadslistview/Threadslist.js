import React, { PureComponent } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Button, List, Skeleton} from 'antd';
import Individualthread from '../shared/individualthread/Individualthread';
import classes from './Threadlist.module.css';

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
let classifier, parameter, anchor;

class Threadslist extends PureComponent {
  componentDidMount() {
    anchor = 1;
    this.getThreads(anchor);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.url !== prevProps.match.url) {
      anchor = 1;
      this.getThreads(anchor);
    }
  }

  getThreads = (anchor) => {

    if (this.props.match.path === "/all") {
      classifier = "indexPage"
      parameter = "all";
      this.props.getThreadsAction(classifier, parameter, anchor, this.props.token)
    }
    if (this.props.match.params.section) {
      classifier = "section"
      parameter = this.props.match.params.section;
      this.props.getThreadsAction(classifier, parameter, anchor, this.props.token)
    }
    if (this.props.match.params.user) {
      classifier = "user"
      parameter = this.props.match.params.user;
      this.props.getThreadsAction(classifier, parameter, anchor, this.props.token)
    }

  }

  onLoadMore = () => {
    anchor = this.props.threads.length > 0 ?
      this.props.threads[this.props.threads.length - 1].createdAt :
      1;

    this.getThreads(anchor);
  }

  renderIndividualThreads(item) {
    return (
      <React.Fragment>
        <div style={{ margin: item.loading ? 30 : null }}>
          <Skeleton avatar={{ shape: "square", size: "small" }} paragraph={{ rows: 3 }} loading={item.loading} active >
            <Individualthread
              key={item._id}
              compact={true}
              {...item}
              token={this.props.token}
              myUsername={this.props.myUsername}
              accessLevel= {this.props.accessLevel}
              deleteThreadAction={this.props.deleteThreadAction}
              deleteThreadRequestPending={this.props.deleteThreadRequestPending} />
          </Skeleton>
        </div>
      </React.Fragment>
    )
  }

  render() {
    const threads = this.props.threads;
    const totalThreads = this.props.totalThreads;
    const loadMore =
      !this.props.getThreadsRequestPending ? (
        <div
          style={{
            textAlign: 'center',
            marginBottom: 5,
          }}
        >
          <Button disabled={threads.length === totalThreads} onClick={this.onLoadMore} >{threads.length === totalThreads ? "That's all folks :)" : "Loading More"}</Button>
        </div>
      ) : null;

    if (this.props.threads) {
      return (
        <div className={classes.contentwrapper}>
          <List
            loading={{ spinning: this.props.initRequestPending, indicator: loadingIcon }}
            loadMore={loadMore}
            dataSource={threads}
            renderItem={item => this.renderIndividualThreads(item)}
          >
          </List>
        </div>
      )
    }
  }
}

export default Threadslist;