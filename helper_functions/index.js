var helperFunctions = {
    previousURL : '',
    startDate : '' ,
    sortPostsByDate : ''
}

helperFunctions.previousURL = function(previousURL){
    // console.log("referer: "+req.headers.referer)    req.header.referer contain the url from where the request to this route has come.
    // var previousURL         = req.headers.referer   // it will be like: https://www.<domain>.com/user/1234
    var indexOf3rdSlash     = previousURL.split("/", 3).join("/").length    // returns index of 3rd slash    
    previousURL             = previousURL.substring(indexOf3rdSlash, previousURL.length) // Now it becomes: /user/1234
    return previousURL
}

helperFunctions.startDate = function(){
    var startDate = new Date() // current date
    startDate.setDate(startDate.getDate()-2)    // subtracting 2 days from current date
    startDate.setHours(0)
    startDate.setMinutes(0)
    startDate.setSeconds(0)
    return startDate
}

helperFunctions.sortPostsByDate = function(Posts){
    Posts = Posts.sort(function(b,a){   // if a,b is passed, it would sort into ascending order
        return a.created - b.created
    })
    return Posts
    
    // Explanation: 
    //     Assume, Posts = [{'data': 'k', created: 25.6.18}, {'data': 'a', created: 26.6.18}]
    //     It would return Posts = [{'data': 'a', created: 26.6.18}, {'data': 'k', created: 25.6.18}]
    //     It sorted the array by descending order of created
    
}

module.exports = helperFunctions