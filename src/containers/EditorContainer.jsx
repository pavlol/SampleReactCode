import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions';
import * as text from '../text/EN';
import EditorComponent from '../components/EditorComponent';
import TopMenu from '../components/TopMenu/TopMenu';


class EditorContainer extends Component{

  render(){
    return(
      <div>
      <TopMenu />
      <h2>{text.EDITOR}</h2>
      <EditorComponent />
      </div>
    )
  }
}
function mapStateToProps(state){
  return {}
}
export default connect(mapStateToProps, actions)(EditorContainer);
