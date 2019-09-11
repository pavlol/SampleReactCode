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
import { Button, Header, Icon, Image, Dropdown } from 'semantic-ui-react';
import axios from "axios";

import './TestMap.css';
import L from 'leaflet';

let map;
let markersRefs = [];
let searchAreaRectangle = {};

class TestMap extends Component{
    constructor(props) {
        super(props);

        this.mapRef = null;
        this.setMapIdRef = (element) => {
            this.mapRef = element;
        }

        const address = `г.Харьков, Пісочин, Кушнарьова вулиця, 1A`;
        const searchValues = {address, branchId : "0"};

        this.attachLeafletToMapElement = () => {
        // Focus the text input using the raw DOM API
            if (this.mapRef) {
                const mapCenterCoord = this.props.mapRedux.mapCentreCoord;
                map = window.L.map('mapid').setView(mapCenterCoord, this.props.mapRedux.mapZoom);

                window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', 
                {
                    foo: 'bar', 
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                }).addTo(map);
                // const initialSearchBounds = [[50.15, 36], [49.85, 36.45]];
                const startBoundsCoord = [+this.props.mapRedux.mapCentreCoord[0]+this.props.mapRedux.latAreaDiff, +this.props.mapRedux.mapCentreCoord[1]-this.props.mapRedux.lonAreaDiff]; 
                const endBoundsCoord = [+this.props.mapRedux.mapCentreCoord[0]-this.props.mapRedux.latAreaDiff, +this.props.mapRedux.mapCentreCoord[1]+this.props.mapRedux.lonAreaDiff]; 
                const searchBounds = [startBoundsCoord, endBoundsCoord];
                
                searchAreaRectangle = window.L.rectangle(searchBounds, {color: "#ff7800", weight: 1}).addTo(map);
                map.fitBounds(searchBounds);

                this.props.getBranchesByArea(searchBounds, (err, message) => {
                    if(err){
                        console.log("getInitialSearchCoords failed getting coords", message);
                    }
                    else{
                        _.map(this.props.mapRedux.branchesCoord, (obj, key) => {
                            var marker = L.marker(obj.coord).addTo(map);
                            marker.bindPopup(`<b>${obj.name}</b><br><p>${obj.address}</p><br><a href="/myaccount">${txt.SHOW_CLINIC}</a>`);//.openPopup();
                            marker.on('click', (e)=>{
                                if(e.openPopup){
                                    e.openPopup();
                                };                        
                            });
                            markersRefs.push(marker);
                        });
                    }
                });

            }
        };
    }

    reactFunction = (e, key) => {
        alert("react function triggered", key);
    }

    componentDidUpdate(prevProps) {

        //found branches compare
        const curentBranches = Object.keys(this.props.mapRedux.branchesCoord);
        const prevBranches = Object.keys(prevProps.mapRedux.branchesCoord);
        const compareBranchArrays = _.isEqual(curentBranches.sort(), prevBranches.sort()); //true
        if (!compareBranchArrays) {
            markersRefs.map(function(marker, i){
                map.removeLayer(marker);
            });
            markersRefs = [];
            _.map(this.props.mapRedux.branchesCoord, (obj, key) => {
                var marker = L.marker(obj.coord).addTo(map);
                marker.bindPopup(`<b>${obj.name}</b><br><p>${obj.address}</p><br><a href="/myaccount">${txt.SHOW_CLINIC}</a>`);//.openPopup();
                marker.on('click', (e)=>{
                    if(e.openPopup){
                        e.openPopup();
                    };                        
                });
                markersRefs.push(marker);
            });
        }
        // marked searched area compare
        const thisMapCentreCoord = this.props.mapRedux.mapCentreCoord;
        const prevMapCentreCoord = prevProps.mapRedux.mapCentreCoord;
        const compareCentreCoord = _.isEqual(thisMapCentreCoord, prevMapCentreCoord);
        if(!compareCentreCoord){
            map.removeLayer(searchAreaRectangle);
            const startBoundsCoord = [+this.props.mapRedux.mapCentreCoord[0] + this.props.mapRedux.latAreaDiff, +this.props.mapRedux.mapCentreCoord[1] - this.props.mapRedux.lonAreaDiff];
            const endBoundsCoord = [+this.props.mapRedux.mapCentreCoord[0] - this.props.mapRedux.latAreaDiff, +this.props.mapRedux.mapCentreCoord[1] + this.props.mapRedux.lonAreaDiff]; 
            const searchBounds = [startBoundsCoord, endBoundsCoord];
            searchAreaRectangle = window.L.rectangle(searchBounds, {color: "#ff7800", weight: 1}).addTo(map);
            map.fitBounds(searchBounds);
        }
    }

    componentDidMount() {
        this.attachLeafletToMapElement();
    }


    render(){
        if(map){
            map.setView(this.props.mapRedux.mapCentreCoord, this.props.mapRedux.mapZoom);
        }
        
        return(
            <div>
                <div id="mapid" ref={this.setMapIdRef}></div>
            </div> 
        )
    }
}

export default TestMap;