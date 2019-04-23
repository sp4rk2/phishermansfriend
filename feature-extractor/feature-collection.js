const feature = {};
const config = require("../config.json");
const fs = require("fs");

const extension = config.tldsTable;

/*
    "This is a binary feature take a value 1 if there is HTML code  
    embedded within the email and 0 otherwise."
    If the email contains HTML content, then return 1.
*/
feature.IRAQ01 = email => email.content.html !== undefined ? 1 : 0;

/*
    "This feature takes a value 1 if the number of pictures used as  
    link is more than 2 otherwise it takes 0 value [7]."
    If the email contains HTML content, check for any <a><img/></a> links.
    If there are more than 2, return 1.
*/
feature.IRAQ02 = email => {
    if (email.content.html !== undefined) {
        let result = email.content.html.match(/\<a(\s|\\n)[^\<]*\>(?!.*\<a(\s|\\n)[^\<]*\>)[(*\s\S]?\<img[^\<]*(\>|\/\>)(?!.*\<a(\s|\\n)[^\<]*\>)[.*\s\S]*?\<\/a\>/igm) || [];
        // console.log(result);
        return result.length > 2 ? 1 : 0;
    } else return 0;
}

/*
    "This feature takesa value of 1 if the number of different domains

    in the email is more than 3 and 0 otherwise [7]."
    This checks both the text content and the html content. It retrives all domain-
    like strings, removes any 'www.' prefixes, and compares the domain extension with
    a valid list. If its not a valid domain, its removed. Duplicates are removed.
    If there are more than 2 unique domains, return 1.
*/
feature.IRAQ03 = email => {
    let domainTable = [];
    let result = [];

    if (email.content.text !== undefined) {

        result = result.concat(email.content.text.match(/([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}/igm) || []);
 
    } else if (email.content.html !== undefined) {

        result = result.concat(email.content.html.match(/([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}/igm) || []);

    } else return 0;

    //Remove www domains.
    for (let i = 0; i < result.length; i++) {
        if (result[i].split(".")[0] === "www") {
            result[i] = result[i].replace("www.", "");
        }
    }

    //Remove any domains without correct extension.
    extensions = JSON.parse(fs.readFileSync(extension, "utf8"));
    for (let i = result.length - 1; i >= 0; i--) {
        let domainArray = result[i].split(".");
        if (!(extensions.includes(domainArray[domainArray.length - 1]))) {
            result.splice(result.indexOf(result[i]), 1);
        }
    }

    //Remove duplicates.
    result = result.filter((v, i, a) => a.indexOf(v) === i);

    return result.length > 2 ? 1 : 0;
}

/*
    "This feature takes a value 1 if the number of embedded links in the email
    is more than 3 otherwise, its value set 0 [7]."
    If the email contains HTML, it checks for any links (including protocol, directory,
    file, and queries). Duplicates are removed (Should they be?). If there are more than 3
    links, it returns a 1. As alot of the emails are based of shopping websites, 
    the likely hood of there being more than 3 links is almost guarenteed. Some have 75
    unique links.
*/
// feature.IRAQ04 = email => {
//     if (email.content.html !== undefined) {
//         let result = email.content.html.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/igm) || [];
//         result = result.filter((v, i, a) => a.indexOf(v) === i);
//         return result.length > 3 ? 1 : 0;
//     } else return 0;
// }

/*Looks for forms in the html*/
feature.IRAQ05 = email => {
    if(email.content.html !== undefined) {
        let result = email.content.html.match(/\<form(\s|\\n)[^\<]*\>(?!.*\<form(\s|\\n)[^\<]*\>)[.*\s\S]*?\<\/form\>/igm) || [];
        return result.length > 0 ? 1 : 0;
    } else return 0;
}

/*FROM does not equal REPLYTO*/
feature.IRAQ06 = email => {
    // console.log(email.)
}

feature.IRAQ07 = email => {
    
}

feature.IRAQ08 = email => {
    
}

feature.IRAQ09 = email => {
    
}

/*IP address links*/
feature.IRAQ10 = email => {
    let result = [];
    if (email.content.text !== undefined) {
        result = result.concat(email.content.text.match(/(http|https):\/\/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/igm) || []);
    } else if (email.content.html !== undefined) {
        result = result.concat(email.content.html.match(/(http|https):\/\/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/igm) || [])
    } else {
        return 0;
    }

    return result.length > 0 ? 1 : 0;
    
}

feature.IRAQ11 = email => {
    
}

feature.IRAQ12 = email => {
    
}

feature.IRAQ13 = email => {
    
}

feature.IRAQ14 = email => {
    
}

feature.IRAQ15 = email => {
    
}

feature.IRAQ16 = email => {
    
}

feature.IRAQ17 = email => {
    
}

feature.IRAQ18 = email => {
    
}

module.exports = feature;