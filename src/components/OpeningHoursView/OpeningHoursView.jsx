import _ from "lodash";
import React, {Component} from "react";
import {reduxForm, Field} from 'redux-form';
import { Button, Header, Icon, Modal, Image, Dropdown } from 'semantic-ui-react'
import txt from '../../text/config';
import {
    UPDATE_BRANCH,
    } from '../../actions/types';
import './OpeningHoursView.css';
import spinnerGif from '../../img/spinner_770.gif';
import OpeningHoursEdit from '../OpeningHoursEdit/OpeningHoursEdit';

class OpeningHoursView extends Component {
    constructor(props){
        super(props);
        this.state = {
            showWaitingSpinner : false,
            error : true,
            showSavedConfirmation : true,
            addressError : false,
            addressErrorMessage : "",
            modalEditOpeningHoursOpen : false
        }
    }

    handleEditBranchModalClose = () => {
        this.setState({modalEditOpeningHoursOpen : false});
    }

    handleCloseEditModal = () => {
        this.setState({error : false, modalEditOpeningHoursOpen:false });
    }

    handleOpenEditModal = () => {
        this.setState({error : false, modalEditOpeningHoursOpen:true });
    }
        
    render(){
        const { branches, branchId, calendar, saveOpeningHours} = this.props;
        const openingHours = branches[branchId].openingHours;
        return(
<div>
    <hr />
    <h3><i className="clock outline icon"></i>{txt.OPENING_HOURS}</h3>
    
    <div className="weekday-container">
        <div className="weekday-row"><span className="weekday-column">{txt.SUNDAY}</span>
            <span className="weekday-time-column">{!openingHours[0].from || !openingHours[0].to ? txt.CLOSED : `${openingHours[0].from} - ${openingHours[0].to}`}</span></div>
        <div className="weekday-row"><span className="weekday-column">{txt.MONDAY}</span>
            <span className="weekday-time-column">{!openingHours[1].from || !openingHours[1].to ? txt.CLOSED : `${openingHours[1].from} - ${openingHours[1].to}`}</span></div>
        <div className="weekday-row"><span className="weekday-column">{txt.TUESDAY}</span>
            <span className="weekday-time-column">{!openingHours[2].from || !openingHours[2].to ? txt.CLOSED : `${openingHours[2].from} - ${openingHours[2].to}`}</span></div>
        <div className="weekday-row"><span className="weekday-column">{txt.WEDNESDAY}</span>
            <span className="weekday-time-column">{!openingHours[3].from || !openingHours[3].to ? txt.CLOSED : `${openingHours[3].from} - ${openingHours[3].to}`}</span></div>
        <div className="weekday-row"><span className="weekday-column">{txt.THURSDAY}</span>
            <span className="weekday-time-column">{!openingHours[4].from || !openingHours[4].to ? txt.CLOSED : `${openingHours[4].from} - ${openingHours[4].to}`}</span></div>
        <div className="weekday-row"><span className="weekday-column">{txt.FRIDAY}</span>
            <span className="weekday-time-column">{!openingHours[5].from || !openingHours[5].to ? txt.CLOSED : `${openingHours[5].from} - ${openingHours[5].to}`}</span></div>
        <div className="weekday-row"><span className="weekday-column">{txt.SATURDAY}</span>
            <span className="weekday-time-column">{!openingHours[6].from || !openingHours[6].to ? txt.CLOSED : `${openingHours[6].from} - ${openingHours[6].to}`}</span></div>
    </div>
    <button className="ui basic button" onClick={this.handleOpenEditModal}>
        <i className="edit outline icon"></i>
        {txt.CHANGE_OPENING_TIMES}
    </button>
    
        <Modal
            open={this.state.modalEditOpeningHoursOpen}
            size='small'
            closeOnEscape={true}
            closeOnDimmerClick={true}
        >
            <Modal.Header>{txt.OPENING_HOURS}</Modal.Header>
            <Modal.Content>
                <OpeningHoursEdit 
                branches = {branches}
                branchId = {branchId}
                startTimes = {calendar.startTimes}
                branchOpeningHours = {openingHours}
                saveOpeningHours = {saveOpeningHours}
                />
            </Modal.Content>
            <Modal.Actions>
                <Button icon='close' content={txt.CLOSE} onClick={this.handleCloseEditModal} />
            </Modal.Actions>
        </Modal>

</div>
        )
    }
}


export default OpeningHoursView;