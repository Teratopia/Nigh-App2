import LocationHelper from '../helpers/locationHelper';

const LocationTracker = props => {
    
    if(props.user && props.user._id){
        LocationHelper.trackLocation(props.user, props.onStatusUpdate);
    }
    return null;
}

export default LocationTracker;