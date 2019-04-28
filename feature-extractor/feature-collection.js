const feature = {};
const config = require("../config.json");
const fs = require("fs");
const cheerio = require("cheerio");
const url = require("url");
const getUrls = require("get-urls");
const extension = config.tldsTable;

/*1. Total number of links 
Phishing emails usually contain multiple links to fake websites for readers to sign in.*/
feature.ZHANG01 = email => {
    let count = 0;
    if (email.content.html !== undefined) {
        const $ = cheerio.load(email.content.html);
        const htmlLinks = $("a");
        for (let i = 0; i < htmlLinks.length; i++) {
            try {
                if (url.parse(htmlLinks[i].attribs.href).host !== null) count += 1;
            } 
            catch (err) { if (err.name !== "TypeError [ERR_INVALID_ARG_TYPE]") console.error(err);}
        }
    } else if (email.content.text !== undefined) {
        count += getUrls(email.content.text).size;
    }
    return count;
}

/*2. Number of IP-based links
A legitimate website usually has a domain name for identiﬁcation
while phishers typically use multiple zombie systems to host phishing
sites. Besides, the use of IP address makes it difﬁcult for readers to
know exactly which site they are being directed to when they click
on the link. Therefore, the presence of IP-based links can be a good
indicator of phishing emails.*/
feature.ZHANG02 = email => {
    let count = 0;
    if (email.content.html !== undefined) {
        const $ = cheerio.load(email.content.html);
        const htmlLinks = $("a");
        for (let i = 0; i < htmlLinks.length; i++) {
            try {
                let hostname = url.parse(htmlLinks[i].attribs.href).hostname || "";
                if (hostname.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g) !== null) count += 1;
            } catch(err) { if (err.name !== "TypeError [ERR_INVALID_ARG_TYPE]") console.error(err);}
        }
    } else if (email.content.text !== undefined) {
        const textLinks = getUrls(email.content.text);
        for (let link of textLinks) {
            let hostname = url.parse(link).hostname;
            if (hostname.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g) !== null) count += 1;
        }
    }
    return count;
}

/*3. Number of deceptive links
Deceptive links are the ones with visible URLs different
from the URLs to which they are pointing. Some phishers use
this technique to fool email readers into clicking on the links.*/
feature.ZHANG03 = email => {
    let count = 0;
    if (email.content.html !== undefined) {
        const $ = cheerio.load(email.content.html);
        const htmlLinks = $("a");
        for (let i = 0; i < htmlLinks.length; i++) {
            try {
                let hostname = url.parse(htmlLinks[i].attribs.href).hostname;
                for (let j = 0; j < htmlLinks[i].children.length; j++) {
                    let textHostname = url.parse(htmlLinks[i].children[j].data).hostname;
                    if (hostname !== null && textHostname !== null) {
                        if (textHostname !== "") {
                            if (hostname !== textHostname) count += 1;
                        }
                    }
                }
            } catch(err) { if (err.name !== "TypeError [ERR_INVALID_ARG_TYPE]") console.error(err);}
        }
    }
    return count;
}

/*4. Number of links behind an image
In order to make the emails look authentic, phishers often
place in the emails images or banners linking to a legitimate website.
Thus, if URL-based images appear in an email, it is likely to be an phishing email.*/
feature.ZHANG04 = email => {
    let count = 0;
    if (email.content.html !== undefined) {
        const $ = cheerio.load(email.content.html);
        const htmlLinks = $("a");
        for (let i = 0; i < htmlLinks.length; i++) {
            try {
                if (url.parse(htmlLinks[i].attribs.href).hostname !== null) {
                    for (let j = 0; j < htmlLinks[i].children.length; j++) {
                        if (htmlLinks[i].children[j].type === "tag") {
                            if (htmlLinks[i].children[j].name == "img") {
                                count += 1;
                            }
                        }
                    }
                }
            } catch(err) { if (err.name !== "TypeError [ERR_INVALID_ARG_TYPE]") console.error(err);}
        }
    }
    return count;
}

feature.ZHANG05 = email => {
    let count = 0;
    if (email.content.html !== undefined) {
        const $ = cheerio.load(email.content.html);
        const htmlLinks = $("a");
        for (let i = 0; i < htmlLinks.length; i++) {
            try {
                if (url.parse(htmlLinks[i].attribs.href).hostname !== null) {
                   let hostname = url.parse(htmlLinks[i].attribs.href).hostname;
                   if (hostname.split(".").length - 1 > count) {
                       count = hostname.split(".").length - 1;
                   }
                }
            } 
            catch (err) { if (err.name !== "TypeError [ERR_INVALID_ARG_TYPE]") console.error(err);}
        }
    } else if (email.content.text !== undefined) {
        let urls = getUrls(email.content.text);
        for (let i of urls) {
            let hostname = url.parse(i).hostname;
            if (hostname.split(".").length - 1 > count) {
                count = hostname.split(".").length - 1;
            }
        }
    }
    return count;
}

feature.ZHANG06 = email => {
    let words = ["click", "here", "login", "update"]
    if (email.content.html !== undefined) {
        const $ = cheerio.load(email.content.html);
        const htmlLinks = $("a");
        for (let i = 0; i < htmlLinks.length; i++) {
            try {
                let hostname = url.parse(htmlLinks[i].attribs.href).hostname;
                for (let j = 0; j < htmlLinks[i].children.length; j++) {
                    let text = htmlLinks[i].children[j].data;
                    if (text !== undefined) {
                        let textArray = text.split(" ");
                        for (let k = 0; k < textArray.length; k++) {
                            if (words.includes(textArray[k])) {
                                return 1;
                            }
                        }
                    }
                    
                }
            } catch(err) { if (err.name !== "TypeError [ERR_INVALID_ARG_TYPE]") console.error(err);}
        }
    }
    return 0;
}

feature.ZHANG07 = email => {
    if (email.content.html !== undefined) {
        return 1;
    }
    return 0;
}

module.exports = feature;