const convertToMeters = value => {
    if(value.includes('Feet')){
        return parseInt(value)*0.3048;
    } else {
        return parseInt(value)*1609.34;
    }
}

export default { convertToMeters };