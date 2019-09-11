import _ from "lodash";
import React, {Component} from "react";
import {connect} from 'react-redux';
import txt from '../../text/config';
import * as actions from '../../actions';
import {
  withRouter, 
  Link,
  Redirect
} from 'react-router-dom';
import { Button, Header, Icon, Modal, Image, Dropdown } from 'semantic-ui-react';
import './CustomersPage.css';
import TopMenu from '../../components/TopMenu/TopMenu';
import ProviderMenu from '../../components/ProviderMenu/ProviderMenu';
import EditCustomer from '../../components/EditCustomer/EditCustomer';
import Customer from '../../components/Customer/Customer';

class CustomersPage extends Component {
    constructor(props){
        super(props);
        this.state= {
            modalEditCustomerOpen : false,
            closeOnEscape : true,
            closeOnDimmerClick : false,
            selectedCustomerId : "0",
            modalNewCustomerOpen : false
        }
        this.loadCustomers();

    }

    loadCustomers(){
        this.props.getCustomers((error)=>{
            console.log("________get customers callback", error);
        });
    }

    buildExistingCustomersRows(){
        const {customers} = this.props.customers;
        const openCustomerModal = this.openCustomerModal;
        const result = _.map(customers, function(obj, key){
            const value = key;
            return(
                <tr key={key} className="center aligned">
                    <td>
                        <div className="ui right floated small brown basic labeled icon button"
                        onClick={openCustomerModal.bind(this, value)}>
                            <i className="edit icon"></i>{txt.EDIT}
                        </div></td>
                    <td className="">{obj.firstName}</td>
                    <td className="">{obj.lastName}</td>
                    <td className="">{obj.middleName}</td>
                    <td className=""></td>
                    <td className=""></td>
                </tr>
            )
        });
        return result;
    }

    openCustomerModal = (e) => {
        console.log("open Modal customer id", e);
        const selectedCustomerId = e;
        this.props.setSelectedCustomerEdit(selectedCustomerId);
        this.setState({ 
            modalEditCustomerOpen: true,
            selectedCustomerId
            });
    };
    handleEditCustomerModalClose = () => {
        this.setState({modalEditCustomerOpen : false});
    };

    handleNewCustomerModalOpen = () => {
        this.setState({modalNewCustomerOpen : true});
    };

    handleNewCustomerModalClose = () => {
        this.setState({modalNewCustomerOpen : false});
    };

    render(){
        const {customers} = this.props.customers;
        const {error, editCustomer, addNewCustomer} = this.props;
        const {closeOnEscape, closeOnDimmerClick, selectedCustomerId, modalNewCustomerOpen} = this.state;
        return(
            <div>
                <TopMenu />
                <ProviderMenu />
                <div className="ui stackable grid">
                    <div className="one wide column">
                    </div>
                    <div className="fourteen wide column">
                        <div className = "ui secondary basic icon labeled medium button"
                        onClick={this.handleNewCustomerModalOpen.bind(this)}>
                            {txt.NEW_CUSTOMER} <Icon name='user plus' />
                        </div>
                        <table className="ui selectable definition celled stackable structured table">
                        <thead>
                            <tr className="center aligned">
                                <th></th>
                                <th>{txt.FIRST_NAME}</th>
                                <th>{txt.LAST_NAME}</th>
                                <th>{txt.MIDDLE_NAME}</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.buildExistingCustomersRows()}
                        </tbody>
                        <tfoot className="full-width">
                            <tr>
                            <th colSpan="6">
                                <div className = "ui secondary basic icon labeled medium button"
                                onClick={this.handleNewCustomerModalOpen.bind(this)}>
                                    {txt.NEW_CUSTOMER} <Icon name='user plus' />
                                </div>
                            </th>
                            </tr>
                        </tfoot>
                        </table>
                    </div>
                    <div className="one wide column">
                    </div>
                </div>
                <Modal
                    open={this.state.modalEditCustomerOpen}
                    size='small'
                    closeOnEscape={closeOnEscape}
                    closeOnDimmerClick={closeOnDimmerClick}
                >
                    <Modal.Header>{txt.CUSTOMER}</Modal.Header>
                    <Modal.Content>
                        <EditCustomer 
                        editCustomer = {editCustomer}
                        customerErrors = {error.customerActions}
                        handleNewCustomerModalClose = {this.handleEditCustomerModalClose}
                        customers = {customers}
                        customerId = {selectedCustomerId}
                        />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button icon='close' content={txt.CLOSE} onClick={this.handleEditCustomerModalClose} />
                    </Modal.Actions>
                </Modal>

                <Modal
                    open={this.state.modalNewCustomerOpen}
                    onClose={this.handleNewCustomerModalClose}
                    size='small'
                    closeOnEscape={closeOnEscape}
                    closeOnDimmerClick={closeOnDimmerClick}
                >
                    <Modal.Header>{txt.NEW_CUSTOMER}</Modal.Header>
                    <Modal.Content>
                        <Customer 
                            addNewCustomer={addNewCustomer}
                            customerErrors = {error.customerActions}
                            handleNewCustomerModalClose = {this.handleNewCustomerModalClose}
                            customers = {customers.customers}
                        />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button icon='close' content={txt.CLOSE} onClick={this.handleNewCustomerModalClose} />
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}


function  mapStateToProps(state){
  return {auth: state.auth, branch: state.branch, customers: state.customers, error: state.error}
}
export default withRouter(
    connect(mapStateToProps, actions)(CustomersPage)
);
