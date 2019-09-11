import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions';
import * as text from '../text/EN';
import Blog from '../components/Blog';
import TopMenu from '../components/TopMenu/TopMenu';




class BlogPage extends Component{
  render(){
    return(
      <div>
        <TopMenu />
        <div style={styles.blogContainer}>
        </div>
        <div className="ui grid">
            <div className="four wide column">
                Side panel
            </div>
            <div className="nine wide column">
                <h4>{text.BLOG}</h4>
                <Blog />
            </div>
            <div className="three wide column">
                <p>Right Panel</p>
            </div>
        </div>
      </div>
    )
  }
}

const styles = {
    blogContainer : {
    },
    semBlogContainer : {

    }

}
function mapStateToProps(state){
  return {}
}
export default connect(mapStateToProps, actions)(BlogPage);
