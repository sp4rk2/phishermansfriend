const config = require("../config.json");

let Email = function(str) {
    for (func in config.emailObject) {
        if (config.emailObject[func]) Email.attributes[func](this, str);
    }
}

Email.attributes = {};

Email.attributes.returnPath = function(email, str) {
    let match = str.match(/Return-Path: .(.*[\n\r](\t.*[\n\r])*)/g);
    if (match == null) console.log("NONE FOUND FOR Return-Path ATTRIBUTE");
    if (match.length > 1) console.error("FOUND MULTIPLE FOR Return-Path ATTRIBUTE");
    else email["Return-Path"] = match[match.length - 1].split(": ")[1];
}

Email.attributes.xOriginalTo = function(email, str) {
    let match = str.match(/X-Original-To: .(.*[\n\r](\t.*[\n\r])*)/g);
    if (match == null) console.log("NONE FOUND FOR X-Original-To Attribute");
    if (match.length > 1) {
        console.error("FOUND MULTIPLE FOR X-Original-To ATTRIBUTE");
        // console.log(str);
    } else email["X-Original-To"] = match[match.length - 1].split(": ")[1];
}

Email.attributes.deliveredTo = function(email, str) {
    let match = str.match(/Delivered-To: .(.*[\n\r](\t.*[\n\r])*)/g);
    if (match == null) console.log("NONE FOUND FOR Delivered-To ATTRIBUTE");
    if (match.length > 1) {
        console.error("FOUND MULTIPLE FOR Delivered-To ATTRIBUTE");
        // console.log(str);
    } else email["Delivered-To"] = match[match.length - 1].split(": ")[1]; 
}

Email.attributes.received = function(email, str) {

}

Email.attributes.from = function(email, str) {
    let match = str.match(/From: .(.*[\n\r](\t.*[\n\r])*)/g);
    if (match == null) console.log("NONE FOUND FOR From Attribute");
    if (match.length > 1) {
        console.error("FOUND MULTIPLE FOR From ATTRIBUTE");
        // console.log(str);
    } else email["From"] = match[match.length - 1].split(": ")[1];
}

Email.attributes.subject = function(email, str) {
    let match = str.match(/Subject: .(.*[\n\r](\t.*[\n\r])*)/g);
    if (match == null) console.log("NONE FOUND FOR Subject Attribute");
    if (match.length > 1) {
        console.error("FOUND MULTIPLE FOR Subject ATTRIBUTE");
        // console.log(str);
    } else email["Subject"] = match[match.length - 1].split(": ")[1];
}

Email.attributes.to = function(email, str) {
    let match = str.match(/To: .(.*[\n\r](\t.*[\n\r])*)/g);
    if (match == null) console.log("NONE FOUND FOR To Attribute");
    if (match.length > 1) {
        console.error("FOUND MULTIPLE FOR To ATTRIBUTE");
        console.log(str);
    } else email["To"] = match[match.length - 1].split(": ")[1];
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