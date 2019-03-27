const config = require("../config.json");
const dataSet = "../data-set" + config.dataSet;
let Email = require("../parser/Email.js");

let test = `From exchange-robot@paypal.com  Sun Nov 28 17:22:23 2004
Return-Path: <exchange-robot@paypal.com>
X-Original-To: username@domain.com
Delivered-To: username@domain.com
Received: from mail2.domain.com (mail2.domain.com [192.168.64.8])
	by spanky.domain.com (Postfix) with ESMTP id 9CE11537B7D
Content-Type: multipart/mixed;
	boundary="----=_NextPart_000_0000_01C4D5AE.9231CEA0"
X-Priority: 3
X-MSMail-Priority: Normal
X-Mailer: Microsoft Outlook Express 6.00.2600.0000

<p><i>Congratulations! PayPal has successfully charged $175 to your credit
card. Your order tracking number is A866DEC0, and your item will be shipped
within three business days. </i></p>
<p><i>Thank you for using PayPal.</i></p>
</body>
</html>

------=_NextPart_000_0000_01C4D5AE.9231CEA0--


From aw-confirm@ebay.com  Sun Nov 28 17:24:56 2004
Return-Path: <aw-confirm@ebay.com>
X-Original-To: username@domain.com
Delivered-To: username@domain.com
Received: from mail2.domain.com (mail2.domain.com [192.168.64.8])
Message-ID: <JDXSYRKPDISQIRUBXXMCHBC@goldenmail.ru>
From: "eBay.com" <aw-confirm@ebay.com>
Reply-To: "eBay.com" <aw-confirm@ebay.com>
X-Priority: 1
X-MSMail-Priority: High               
X-UID: 5


From aw-confirm@ebay.com  Sun Nov 28 20:08:58 2004
Return-Path: <aw-confirm@ebay.com>
X-Original-To: username@domain.com
Delivered-To: username@domain.com
Received: from mail2.domain.com (mail2.domain.com [192.168.64.8])
	by spanky.domain.com (Postfix) with ESMTP id 61054538CD9
	for <username@domain.com>; Sun, 28 Nov 2004 20:08:53 -0500 (EST)
Received: from 62.193.237.52 (wpc0865.amenworld.com [62.193.237.52])
	by mail2.domain.com (Postfix) with SMTP id 13EF318CBCB
	for <username@domain.com>; Sun, 28 Nov 2004 13:12:35 -0500 (EST)
Received: from 112.76.224.216 by ; Sun, 28 Nov 2004 21:18:05 -0200`


let parser = {};


parser.seperateEmails = function(str) {
    let rawEmailArray = 
        str.match(/(From\s.*\s\d{4}\n)(.|\n)*?(?=(From\s.*\s\d{4}\n|$(?![\r\n])))/g);
    return rawEmailArray;
}


parser.init = function() {
    let results = parser.seperateEmails(test);
    let email = new Email(results[0]);

    console.log(email);
};





module.exports = parser;