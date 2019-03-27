const config = require("../config.json");

let Email = function(str) {
    for (func in config.emailObject) {
        if (config.emailObject[func]) Email.attributes[func](this, str);
    }
}

Email.attributes = {};

Email.attributes.returnPath = function(email, str) {
    let match = str.match(/(?=Return-Path:\s)(.*)/g);
    if (match.length > 1) console.error("FOUND MULTIPLE FOR RETURN PATH");
    else email["Return-Path"] = match[0].split(": ")[1];
}

Email.attributes.xOriginalTo = function(email, str) {

}

Email.attributes.deliveredTo = function(email, str) {
    
}

Email.attributes.received = function(email, str) {
    
}

Email.attributes.from = function(email, str) {
    
}

Email.attributes.subject = function(email, str) {
    
}

Email.attributes.to = function(email, str) {
    
}

Email.attributes.contentType = function(email, str) {
    
}

Email.attributes.mimeVersion = function(email, str) {
    
}

Email.attributes.replyTo = function(email, str) {
    
}

Email.attributes.date = function(email, str) {
    
}

Email.attributes.messageId = function(email, str) {
    
}

Email.attributes.status = function(email, str) {
    
}

Email.attributes.xStatus = function(email, str) {
    
}

Email.attributes.xKeywords = function(email, str) {
    
}

Email.attributes.xUid = function(email, str) {
    
}

module.exports = Email;