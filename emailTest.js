exports.email 	= require("emailjs/email");
exports.server  = email.server.connect({
    user:    "00509060", 
    password:"valleyforge", 
    host:    "plhoarray.ds.indianoil.in",
    tls: {ciphers: "SSLv3"}
 });
 
// send the message and get a callback with an error or details of the message that was sent
exports.server.send({
   text:    "i hope this works", 
   from:    "pradeepjain@indianoil.in", 
   to:      "NRPLBIJISADMIN@INDIANOIL.IN",
   cc:      "",
   subject: "testing emailjs"
}, function(err, message) { console.log(err); });

