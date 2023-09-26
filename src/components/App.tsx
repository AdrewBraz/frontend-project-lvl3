import React, { FC } from 'react';
import Form from './Form'
import { useTypedSelector } from '../hooks/useTypeSelector';
import Feed from './Feed';
import FeedList from './FeedList';
import { IFeed } from '../types';

const App: FC = () => {
  const { feed } = useTypedSelector(state => state.feedState);
  const { list, activeId } = useTypedSelector(state => state.listSlice)
  console.log(list, feed)
  
  const getFeed = () => {
    if(activeId){
        const activeFeed = feed.find((item: IFeed) => item.id === activeId)
        return activeFeed
    }
    return feed[feed.length - 1]
  }


  return (
    <div>
      <div className="jumbotron">
        <div className="form-group">
            <h1>RSS reader
            </h1>
        </div>
        <Form />
    </div>
      <div className="container" id='app'>
            <div className="row">
                <div className="col-sm-3 feedList">
                { list.length > 0  ? <FeedList/> : null}
                </div>
                <div className="col-sm-9 feed">
                   { feed.length > 0  ? <Feed feed={getFeed()}/> : null}
                </div>
            </div>
        </div><div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">Description</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
)
  }

export default App;