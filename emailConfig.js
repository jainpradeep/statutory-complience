email 	= require("emailjs/email");
exports.server  = email.server.connect({
    user:    "00509060", 
    password:"valleyforge", 
    host:    "plhoarray.ds.indianoil.in",
    tls: {ciphers: "SSLv3"}
 });