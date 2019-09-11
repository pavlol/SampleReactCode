import React, {Component} from 'react';

class Modal extends Component{

  render(){
    return(
      <div className="pl-modal">
        <div id="pl-modal-header">
          <h3 id="pl-modal-title"></h3>
          <div id="pl-modal-close">
            <span className="ui-icon ui-icon-closethink"></span>
          </div>
        </div>
        <div id="pl-modal-body">
          {this.props.children.modalBody}
        </div>
        <div id="pl-modal-footer">
          {this.props.children.modalFooter}
        </div>
      </div>
    )
  }
}
