import _ from 'lodash';
import {
    FIND_COORD_BY_ADDRESS,
    FIND_COORD_BY_LOCATION_NAME,
    SET_BRANCHES_COORDS,
    } from '../actions/types';

const defaultState = {
    branchesCoord : {
    },
    mapCentreCoord : [49.9622881, 36.1239316],
    mapZoom : 10,
    foundLocationName : "",
    foundLocationType : "",
    searchBounds: [[50.15, 36], [49.85, 36.45]],
    latAreaDiff : 0.150,
    lonAreaDiff : 0.225

}

export default function(state=defaultState, action){
    let selectedClinic, branchCoord, newCoords = {}, newState, branchId, coord, branchesCoord, address, type;
    switch(action.type){
        case SET_BRANCHES_COORDS:
            newState = _.cloneDeep(state);
            action.payload.forEach(function(item, i){
                newCoords[item.id] = {coord : [item.lat, item.lon], address : item.address, name : item.name };
            });
            newState.branchesCoord = newCoords;
            return newState;
        case FIND_COORD_BY_ADDRESS:
            coord = action.payload.coord;
            address = action.payload.address;
            branchId = action.payload.branchId;
            newState = _.cloneDeep(state);
            newState.branchesCoord[branchId] = {"coord" : coord, address }; 
            return newState;
        case FIND_COORD_BY_LOCATION_NAME:
            coord = action.payload.coord;
            address = action.payload.address;
            type = action.payload.type;
            newState = _.cloneDeep(state);
            newState.foundLocationName = address;
            newState.mapCentreCoord = coord; 
            newState.foundLocationType = type;
            const startBoundsCoord = [+state.mapCentreCoord[0] + state.latAreaDiff, +state.mapCentreCoord[1] - state.lonAreaDiff]; 
            const endBoundsCoord = [+state.mapCentreCoord[0] - state.latAreaDiff, +state.mapCentreCoord[1] + state.lonAreaDiff]; 
            newState.searchBounds = [startBoundsCoord, endBoundsCoord];
            if(type === "city"){
                newState.mapZoom = 11;
            }
            else if(type==="administrative"){
                newState.mapZoom = 10;
            }
            else if(type==="convenience"){
                newState.mapZoom = 9;
            }
            else if(type==="yes"){
                newState.mapZoom = 8;
            }
            return newState;
        default:
            return {...state};
    }
}

