import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import txt from '../../text/config';
import {
  withRouter, 
  Link,
  Redirect
} from 'react-router-dom';
import { Button, Header, Icon, Modal, Image, Dropdown } from 'semantic-ui-react'
import TopMenu from '../../components/TopMenu/TopMenu';
import ProviderMenu from '../../components/ProviderMenu/ProviderMenu';
import BranchCreate from '../../components/BranchCreate/BranchCreate';
import BranchUpdate from '../../components/BranchUpdate/BranchUpdate';
import OpeningHoursView from '../../components/OpeningHoursView/OpeningHoursView';
import './BranchManagement.css';

class BranchManagement extends Component{
    constructor(props){
        super(props);
        this.state= {
            modalEditBranchOpen : false,
            closeOnEscape : true,
            closeOnDimmerClick : false,
            selectedBranchId : "0",
            modalNewBranchOpen : false,
            modalEditOpeningHoursOpen : false,
        }
        this.loadBranches();
    }

    loadBranches(){
        this.props.getBranches((error)=>{
        });
    }

    buildExistingBranchesRows(){
        const {branches} = this.props.branch;
        const openBranchModal = this.openBranchModal;
        const openViewOpeningHoursModal = this.openViewOpeningHoursModal;
        const result = _.map(branches, function(obj, key){
            const value = key;
            const openingHours = (
                    <table>
                        <tr><td>{txt.MONDAY}</td><td>{obj.openingHours["1"].from} - {obj.openingHours["1"].to}</td></tr>
                        <tr><td>{txt.TUESDAY}</td><td>{obj.openingHours["2"].from} - {obj.openingHours["2"].to}</td></tr>
                        <tr><td>{txt.WEDNESDAY}</td><td>{obj.openingHours["3"].from} - {obj.openingHours["3"].to}</td></tr>
                        <tr><td>{txt.THURSDAY}</td><td>{obj.openingHours["4"].from} - {obj.openingHours["4"].to}</td></tr>
                        <tr><td>{txt.FRIDAY}</td><td>{obj.openingHours["5"].from} - {obj.openingHours["5"].to}</td></tr>
                        <tr><td>{txt.SATURDAY}</td><td>{obj.openingHours["6"].from} - {obj.openingHours["6"].to}</td></tr>
                        <tr><td>{txt.SUNDAY}</td><td>{obj.openingHours["0"].from} - {obj.openingHours["0"].to}</td></tr>
                    </table>
                )
            
            return(
                <tr key={key} className="center aligned">
                    <td>
                        <div className="ui right floated small brown basic labeled icon button"
                        onClick={openBranchModal.bind(this, value)}>
                            <i className="edit icon"></i>{txt.EDIT}
                        </div>
                    </td>
                    <td className="">{obj.name}</td>
                    <td className="">{obj.phoneNumber}</td>
                    <td className="">{obj.email}</td>
                    <td className="">{obj.address}</td>
                    <td className="">Web link</td>
                </tr>
            )
        });
        return result;
    }

    openBranchModal = (e) => {
        const selectedBranchId = e;
        this.props.setBranch(selectedBranchId, (e) => {
            //TODO show errors
        });
        this.setState({ 
            modalEditBranchOpen: true,
            selectedBranchId
            });
    };
    
    handleEditBranchModalClose = () => {
        this.setState({modalEditBranchOpen : false});
    };

    handleNewBranchModalOpen = () => {
        this.setState({modalNewBranchOpen : true});
    };

    handleNewBranchModalClose = () => {
        this.setState({modalNewBranchOpen : false});
    };

    render(){
        const {branches} = this.props.branch;
        const {error, updateBranch, addNewBranch, findCoordByAddress, calendar, saveOpeningHours} = this.props;
        const {closeOnEscape, closeOnDimmerClick, selectedBranchId, modalNewBranchOpen} = this.state;
        console.log("BranchMnagement Calendar ", calendar);
        return(
            <div>
                <TopMenu />
                <ProviderMenu />
                <div className="ui stackable grid">
                    <div className="one wide column">
                    </div>
                    <div className="fourteen wide column">
                        <div className = "ui secondary basic icon labeled medium button"
                        onClick={this.handleNewBranchModalOpen.bind(this)}>
                            {txt.ADD_BRANCH} <Icon name='building' />
                        </div>
                        <table className="ui selectable definition celled stackable structured table">
                        <thead>
                            <tr className="center aligned">
                                <th></th>
                                <th>{txt.BRANCH_NAME}</th>
                                <th>{txt.PHONE_NUMBER}</th>
                                <th>{txt.BRANCH_EMAIL}</th>
                                <th>{txt.ADDRESS}</th>
                                <th>Web Page</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.buildExistingBranchesRows()}
                        </tbody>
                        <tfoot className="full-width">
                            <tr>
                            <th colSpan="6">
                            </th>
                            </tr>
                        </tfoot>
                        </table>
                    </div>
                    <div className="one wide column">
                    </div>
                </div>
                <Modal
                    open={this.state.modalEditBranchOpen}
                    size='small'
                    closeOnEscape={closeOnEscape}
                    closeOnDimmerClick={closeOnDimmerClick}
                >
                    <Modal.Header><i className="building outline icon"></i>{txt.BRANCH}
                        <Button icon='close' style={{float:"right"}} onClick={this.handleEditBranchModalClose} />
                    </Modal.Header>
                    <Modal.Content>
                        <BranchUpdate 
                        updateBranch = {updateBranch}
                        findCoordByAddress = {findCoordByAddress}
                        branchErrors = {error.branchActions}
                        branches = {branches}
                        branchId = {selectedBranchId}
                        calendar = {calendar}
                        saveOpeningHours = {saveOpeningHours}
                        />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button icon='close' content={txt.CLOSE} onClick={this.handleEditBranchModalClose} />
                    </Modal.Actions>
                </Modal>

                <Modal
                    open={this.state.modalNewBranchOpen}
                    onClose={this.handleNewBranchModalClose}
                    size='small'
                    closeOnEscape={closeOnEscape}
                    closeOnDimmerClick={closeOnDimmerClick}
                >
                    <Modal.Header>{txt.NEW_BRANCH}</Modal.Header>
                    <Modal.Content>
                        <BranchCreate 
                            addNewBranch={addNewBranch}
                            branchErrors = {error.branchActions}
                            handleModalClose = {this.handleNewBranchModalClose}
                            branches = {branches}
                        />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button icon='close' content={txt.CLOSE} onClick={this.handleNewBranchModalClose} />
                    </Modal.Actions>
                </Modal>   

                
            </div>
        )
    }
}

function  mapStateToProps(state){
  return {auth: state.auth, branch: state.branch, error: state.error, calendar : state.calendar}
}
export default withRouter(
    connect(mapStateToProps, actions)(BranchManagement)
);
