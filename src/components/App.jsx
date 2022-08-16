import React from 'react';

const App = () => (
    <>
      <div className="jumbotron">
        <div className="form-group">
            <h1>RSS Reader</h1>
        </div>
        <form id="rss-form">
            <div className="input-group flex-column mb-3">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <button type="submit" className="btn btn-primary" id="submit-btn" disabled="disabled">Add Feed</button>
                    </div>
                    <input type="text" name="input" className="form-control" id="input" placeholder="url" aria-label="url"/>
                    </div>
                <small id="message" className="form-text text-muted">
                    Please, be sure your URL is valid
                </small>
            </div>
        </form>
    </div>
      <div className="container">
            <div className="row">
                <div className="col-sm-3 feedList"></div>
                <div className="col-sm-9 feed"></div>
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
    </>
)

export default App;