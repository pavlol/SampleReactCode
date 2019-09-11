import _ from "lodash";
import React, {Component} from "react";
import { Button, Header, Icon, Modal, Image, Dropdown } from 'semantic-ui-react'
import * as txt from '../../text/EN';

class NewCustomerModal extends Component{
    render(){
        return(
            <Modal
                open={this.state.modalNewCustomerOpen}
                onOpen={this.handleNewCustomerModalOpen}
                onClose={this.handleNewCustomerModalClose}
                size='small'
                closeOnEscape={closeOnEscape}
                closeOnDimmerClick={closeOnDimmerClick}
                trigger={
                <Button secondary basic icon>
                    {txt.NEW_CUSTOMER} <Icon name='user plus' />
                </Button>
                }
            >
                <Modal.Header>{txt.NEW_CUSTOMER}</Modal.Header>
                <Modal.Content>
                    {props.children}
                    <Customer 
                        addNewCustomer={addNewCustomer}
                        customerErrors = {error.customerActions}
                        handleNewCustomerModalClose = {this.handleNewCustomerModalClose}
                        customers = {customersList}
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button icon='close' content={txt.CLOSE} onClick={this.handleNewCustomerModalClose} />
                </Modal.Actions>
            </Modal>
        )
    }
}

