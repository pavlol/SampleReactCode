import React, {Component} from 'react';
import {connect} from 'react-redux';
import Comment from '../components/Comment';
import '../index.css';

class CommentsList extends Component{

  render(){
     const { currentView } = this.props.comments;
     let listOfComments;
      if (currentView.length===0) {
        listOfComments = <div>No Comments to Show</div>
        return listOfComments;
      }

      listOfComments = currentView.map((item) => {
      return(<Comment key={item.name}>{item}</Comment>)
    })
    return(
      <div className="comments-list">
        <p>List of Comments</p>
        {listOfComments}
      </div>
    );
  };
}
function mapStatetoProps(state){
  return {comments: state.comments};
}

export default connect(mapStatetoProps, null)(CommentsList);
