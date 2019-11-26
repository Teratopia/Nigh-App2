const geolib = require('geolib');

function reformatMatches(users, activity, phoneLong, phoneLat){
    //console.log('reformat matches 1');
    var matches = [];
    users.forEach(function(user){
        var match = {};
        match.user = user;
        
        user.statuses.forEach(function(status){
            if(status.activityName === activity){
                match.event = status;
                match.event.distanceAway = getDist(user, phoneLat, phoneLong);
            }
        });
        matches.push(match);
    });
    //console.log('reformat matches 2, matches = ');
    //console.log(matches);
    return matches;
}

function makeEventForAll(status){
    /*
    {
    activityName : String,
    activityDescription : String,
    active : Boolean,
    passive : Boolean,
    lastModified : Date,
    description : String
   }
    */

}

function getDist(user, phoneLat, phoneLong, fuzzy){
    //console.log('getDist 1, user = ');
    //console.log(user);
    var meters = geolib.getDistance(
        {latitude : user.location.coordinates[1], longitude : user.location.coordinates[0]},
        {latitude : phoneLat, longitude : phoneLong});
    var feet = meters*3.28084;
    //console.log('getDist 2 feet = ');
    //console.log(feet);
    if(fuzzy){
         if(feet < 250){
            return '< 250 Feet';
         }
    }
    return Math.round(feet) + ' Feet';
}

function filterOnLatLong(latLng, matches){
    var lat = latLng.coordinate.latitude;
    var long = latLng.coordinate.longitude;
    console.log('filterOnLatLong latLng = ');
    console.log(latLng);
    var retVal;
    matches.forEach(function(match){
        if(match.user.location.coordinates[1] === lat && match.user.location.coordinates[0] === long){
            retVal = match;
        }
    });
    return retVal;
}

export default { reformatMatches, filterOnLatLong, getDist };