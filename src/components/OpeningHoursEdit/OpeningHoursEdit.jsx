import _ from "lodash";
import React, {Component} from "react";
import {reduxForm, Field} from 'redux-form';
import { Button, Header, Icon, Modal, Image, Dropdown, Radio } from 'semantic-ui-react'
import txt from '../../text/config';
import {
    UPDATE_BRANCH,
    } from '../../actions/types';
import './OpeningHoursEdit.css';
import spinnerGif from '../../img/spinner_770.gif';
import OpeningHoursView from '../OpeningHoursView/OpeningHoursView';


class OpeningHoursEdit extends Component {
    constructor(props){
        super(props);
        const ddlOptionsStartTime = this.buildStartTimeDdlOptons();
        const branchOpeningHours = this.props.branchOpeningHours;
        this.state = {
            ddlOptionsStartTime,
            branchOpeningHours,
            showWaitingSpinner : false,
            error : false,
            showSavedConfirmation : false,
            errorMessage : "",
            sundayOpen : (!branchOpeningHours[0].from || !branchOpeningHours[0].to) ? false : true,
            mondayOpen : (!branchOpeningHours[1].from || !branchOpeningHours[1].to) ? false : true,
            tuesdayOpen :(!branchOpeningHours[2].from || !branchOpeningHours[2].to) ? false : true,
            wednesdayOpen : (!branchOpeningHours[3].from || !branchOpeningHours[3].to) ? false : true,
            thursdayOpen : (!branchOpeningHours[4].from || !branchOpeningHours[4].to) ? false : true,
            fridayOpen : (!branchOpeningHours[5].from || !branchOpeningHours[5].to) ? false : true,
            saturdayOpen : (!branchOpeningHours[6].from || !branchOpeningHours[6].to) ? false : true,
        }
    }



    renderAddressError(){
        if(this.state.error && this.state.errorMessage){
            return(
                <div className="ui large red basic label">
                    {txt.ERROR_SAVING_OPENING_HOURS} {this.state.errorMessage}
                </div>
            )
        }
    }

    renderSuccessConfirmation(){
        if(!this.state.error && this.state.showSavedConfirmation){
            return(
                <div className="ui large green basic label">
                    {txt.OPENING_HOURS_SAVED_SUCCESSFULLY}
                </div>
            )
        }
    }


    handleCloseModal = () => {
        this.props.handleModalClose();
        this.setState({error : false, showSavedConfirmation:false });
    }

    buildStartTimeDdlOptons = () => {
        const ddlOptions = this.props.startTimes.map(function(item, key){
        return { key, text : item, value : item }
        });
        return ddlOptions;
    }
    
    handleSundayFromChange = (e, data) => {
        let branchOpeningHours = _.cloneDeep(this.state.branchOpeningHours);
        branchOpeningHours["0"]["from"] = data.value;
        this.setState({branchOpeningHours});
    }
    handleSundayToChange = (e, data) => {
        let branchOpeningHours = _.cloneDeep(this.state.branchOpeningHours);
        branchOpeningHours["0"]["to"] = data.value;
        this.setState({branchOpeningHours});
    }

    handleMondayFromChange = (e, data) => {
        let branchOpeningHours = _.cloneDeep(this.state.branchOpeningHours);
        branchOpeningHours["1"]["from"] = data.value;
        this.setState({branchOpeningHours});
    }
    handleMondayToChange = (e, data) => {
        let branchOpeningHours = _.cloneDeep(this.state.branchOpeningHours);
        branchOpeningHours["1"]["to"] = data.value;
        this.setState({branchOpeningHours});
    }

    handleTuesdayFromChange = (e, data) => {
        let branchOpeningHours = _.cloneDeep(this.state.branchOpeningHours);
        branchOpeningHours["2"]["from"] = data.value;
        this.setState({branchOpeningHours});
    }
    handleTuesdayToChange = (e, data) => {
        let branchOpeningHours = _.cloneDeep(this.state.branchOpeningHours);
        branchOpeningHours["2"]["to"] = data.value;
        this.setState({branchOpeningHours});
    }
    
    handleWednesdayFromChange = (e, data) => {
        let branchOpeningHours = _.cloneDeep(this.state.branchOpeningHours);
        branchOpeningHours["3"]["from"] = data.value;
        this.setState({branchOpeningHours});
    }
    handleWednesdayToChange = (e, data) => {
        let branchOpeningHours = _.cloneDeep(this.state.branchOpeningHours);
        branchOpeningHours["3"]["to"] = data.value;
        this.setState({branchOpeningHours});
    }

    handleThursdayFromChange = (e, data) => {
        let branchOpeningHours = _.cloneDeep(this.state.branchOpeningHours);
        branchOpeningHours["4"]["from"] = data.value;
        this.setState({branchOpeningHours});
    }
    handleThursdayToChange = (e, data) => {
        let branchOpeningHours = _.cloneDeep(this.state.branchOpeningHours);
        branchOpeningHours["4"]["to"] = data.value;
        this.setState({branchOpeningHours});
    }
        
    handleFridayFromChange = (e, data) => {
        let branchOpeningHours = _.cloneDeep(this.state.branchOpeningHours);
        branchOpeningHours["5"]["from"] = data.value;
        this.setState({branchOpeningHours});
    }
    handleFridayToChange = (e, data) => {
        let branchOpeningHours = _.cloneDeep(this.state.branchOpeningHours);
        branchOpeningHours["5"]["to"] = data.value;
        this.setState({branchOpeningHours});
    }

    handleSaturdayFromChange = (e, data) => {
        let branchOpeningHours = _.cloneDeep(this.state.branchOpeningHours);
        branchOpeningHours["6"]["from"] = data.value;
        this.setState({branchOpeningHours});
    }
    handleSaturdayToChange = (e, data) => {
        let branchOpeningHours = _.cloneDeep(this.state.branchOpeningHours);
        branchOpeningHours["6"]["to"] = data.value;
        this.setState({branchOpeningHours});
    }

    toggleSundayOpen = () => {
        this.setState({sundayOpen : !this.state.sundayOpen});
    }
    toggleMondayOpen = () => {
        this.setState({mondayOpen : !this.state.mondayOpen});
    }
    toggleTuesdayOpen = () => {
        this.setState({tuesdayOpen : !this.state.tuesdayOpen});
    }
    toggleWednesdayOpen = () => {
        this.setState({wednesdayOpen : !this.state.wednesdayOpen});
    }
    toggleThursdayOpen = () => {
        this.setState({thursdayOpen : !this.state.thursdayOpen});
    }
    toggleFridayOpen = () => {
        this.setState({fridayOpen : !this.state.fridayOpen});
    }
    toggleSaturdayOpen = () => {
        this.setState({saturdayOpen : !this.state.saturdayOpen});
    }

    saveOpeningHours = () => {
        this.props.saveOpeningHours(this.state.branchOpeningHours, this.props.branchId, (err, message) => {
            if(err){
                this.setState({error : err, errorMessage : message})
            }
            else{
                this.setState({showSavedConfirmation : true, error: err});
            }
        });
    }


    render(){
        const { showWaitingSpinner, fullName, showCustomerSavedConfirmation } = this.state;
        const { handleSubmit, error, handleModalClose, startTimes } = this.props;
        return(
    <div>
        <table>
        <tbody>
            <tr>
                <td>{txt.SUNDAY}</td>
                <td><Radio toggle onChange={this.toggleSundayOpen} checked={this.state.sundayOpen}/></td>
                <td>
                    {!this.state.sundayOpen ? txt.CLOSED : (
                    <Dropdown
                        onChange={this.handleSundayFromChange}
                        fluid
                        selection
                        value = {this.state.branchOpeningHours[0].from}
                        options={this.state.ddlOptionsStartTime}
                        clearable = {true}
                        floating = {true}
                    />)}
                </td>
                <td>
                {(!this.state.sundayOpen) ? "" : (
                    <Dropdown
                        onChange={this.handleSundayToChange}
                        fluid
                        selection
                        value = {this.state.branchOpeningHours[0].to}
                        options={this.state.ddlOptionsStartTime}
                        clearable = {true}
                        floating = {true}
                    />
                )}
                </td>
            </tr>
            <tr>
                <td>{txt.MONDAY}</td>
                <td><Radio toggle onChange={this.toggleMondayOpen} checked={this.state.mondayOpen}/></td>
                <td>
                {!this.state.mondayOpen ? txt.CLOSED : (
                    <Dropdown
                        onChange={this.handleMondayFromChange}
                        fluid
                        selection
                        value = {this.state.branchOpeningHours[1].from}
                        options={this.state.ddlOptionsStartTime}
                        clearable = {true}
                        floating = {true}
                    />)}
                </td>
                <td>
                {!this.state.mondayOpen ? `` : (
                    <Dropdown
                        onChange={this.handleMondayToChange}
                        fluid
                        selection
                        value = {this.state.branchOpeningHours[1].to}
                        options={this.state.ddlOptionsStartTime}
                        clearable = {true}
                        floating = {true}
                    />
                    )}
                </td>
            </tr>
            <tr>
                <td>{txt.TUESDAY}</td>
                <td><Radio toggle onChange={this.toggleTuesdayOpen} checked={this.state.tuesdayOpen}/></td>
                <td>
                {!this.state.tuesdayOpen ? txt.CLOSED : (
                    <Dropdown
                        onChange={this.handleTuesdayFromChange}
                        fluid
                        selection
                        value = {this.state.branchOpeningHours[2].from}
                        options={this.state.ddlOptionsStartTime}
                        clearable = {true}
                        floating = {true}
                    />
                    )}
                </td>
                <td>
                {!this.state.tuesdayOpen ? `` : (
                    <Dropdown
                        onChange={this.handleTuesdayToChange}
                        fluid
                        selection
                        value = {this.state.branchOpeningHours[2].to}
                        options={this.state.ddlOptionsStartTime}
                        clearable = {true}
                        floating = {true}
                    />
                )}
                </td>
            </tr>
            <tr>
                <td>{txt.WEDNESDAY}</td>
                <td><Radio toggle onChange={this.toggleWednesdayOpen} checked={this.state.wednesdayOpen}/></td>
                <td>
                {!this.state.wednesdayOpen ? txt.CLOSED : (
                    <Dropdown
                        onChange={this.handleWednesdayFromChange}
                        fluid
                        selection
                        value = {this.state.branchOpeningHours[3].from}
                        options={this.state.ddlOptionsStartTime}
                        clearable = {true}
                        floating = {true}
                    />
                )}
                </td>
                <td>
                {!this.state.wednesdayOpen ? `` : (
                    <Dropdown
                        onChange={this.handleWednesdayToChange}
                        fluid
                        selection
                        value = {this.state.branchOpeningHours[3].to}
                        options={this.state.ddlOptionsStartTime}
                        clearable = {true}
                        floating = {true}
                    />
                )}
                </td>
            </tr>
            <tr>
                <td>{txt.THURSDAY}</td>
                <td><Radio toggle onChange={this.toggleThursdayOpen} checked={this.state.thursdayOpen}/></td>
                <td>
                {!this.state.thursdayOpen ? txt.CLOSED : (
                    <Dropdown
                        onChange={this.handleThursdayFromChange}
                        fluid
                        selection
                        value = {this.state.branchOpeningHours[4].from}
                        options={this.state.ddlOptionsStartTime}
                        clearable = {true}
                        floating = {true}
                    />
                )}
                </td>
                <td>
                {!this.state.thursdayOpen ? `` : (
                    <Dropdown
                        onChange={this.handleThursdayToChange}
                        fluid
                        selection
                        value = {this.state.branchOpeningHours[4].to}
                        options={this.state.ddlOptionsStartTime}
                        clearable = {true}
                        floating = {true}
                    />
                )}
                </td>
            </tr>
            <tr>
                <td>{txt.FRIDAY}</td>
                <td><Radio toggle onChange={this.toggleFridayOpen} checked={this.state.fridayOpen}/></td>
                <td>
                {!this.state.fridayOpen ? txt.CLOSED : (
                    <Dropdown
                        onChange={this.handleFridayFromChange}
                        fluid
                        selection
                        value = {this.state.branchOpeningHours[5].from}
                        options={this.state.ddlOptionsStartTime}
                        clearable = {true}
                        floating = {true}
                    />
                )}
                </td>
                <td>
                {!this.state.fridayOpen ? `` : (
                <Dropdown
                    onChange={this.handleFridayToChange}
                    fluid
                    selection
                    value = {this.state.branchOpeningHours[5].to}
                    options={this.state.ddlOptionsStartTime}
                    clearable = {true}
                    floating = {true}
                />
                )}
                </td>
            </tr>
            <tr>
                <td>{txt.SATURDAY}</td>
                <td><Radio toggle onChange={this.toggleSaturdayOpen} checked={this.state.saturdayOpen}/></td>
                <td>
                {!this.state.saturdayOpen ? txt.CLOSED : (
                    <Dropdown
                        onChange={this.handleSaturdayFromChange}
                        fluid
                        selection
                        value = {this.state.branchOpeningHours[6].from}
                        options={this.state.ddlOptionsStartTime}
                        clearable = {true}
                        floating = {true}
                    />
                )}
                </td>
                <td>
                {!this.state.saturdayOpen ? `` : (
                    <Dropdown
                        onChange={this.handleSaturdayToChange}
                        fluid
                        selection
                        value = {this.state.branchOpeningHours[6].to}
                        options={this.state.ddlOptionsStartTime}
                        clearable = {true}
                        floating = {true}
                    />
                )}
                </td>
            </tr>
        </tbody>
        </table>
        <div>
            <button className="ui primary button" onClick={this.saveOpeningHours}>{txt.SAVE}</button>
            {this.renderSuccessConfirmation()}
        </div>
        <Modal
            open={showWaitingSpinner}
            size='mini'
            dimmer='inverted'
            closeOnEscape={false}
            closeOnDimmerClick={false}
            basic
        >
            <Modal.Content>
            <div className="ui one column centered grid">
                <Image src={spinnerGif}/>
            </div>
            <div className="ui one column centered grid">
                <h3>
                    {txt.SAVING}
                </h3>
            </div>
            </Modal.Content>
        </Modal>
    </div>
        )
    }
}

export default OpeningHoursEdit;