var helperFunctions = {
    previousURL : ''
}

helperFunctions.previousURL = function(previousURL){
    // console.log("referer: "+req.headers.referer)    req.header.referer contain the url from where the request to this route has come.
    // var previousURL         = req.headers.referer   // it will be like: https://www.<domain>.com/user/1234
    var indexOf3rdSlash     = previousURL.split("/", 3).join("/").length    // returns index of 3rd slash    
    previousURL             = previousURL.substring(indexOf3rdSlash, previousURL.length) // Now it becomes: /user/1234
    return previousURL
}

module.exports = helperFunctions