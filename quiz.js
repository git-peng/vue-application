// Assuming you have already done "npm install fernet"
let fernet = require('fernet')
let secret = new fernet.Secret('TluxwB3fV_GWuLkR1_BzGs1Zk90TYAuhNMZP_0q4WyM=')
// Oh no! The code is going over the edge! What are you going to do?
let message = 'gAAAAABcUnGlVYs594wDYWul5KVFI2VH2zBuV9jLVBZ3qJrw0SqROvw1lFeCQfiARnCaNIl_lvYKtaC3oKbF-KgG7rqvgs9AiT1MPbyYKa-lwTSX3q5hrleoX_ySqG68Ta9XqnoLWZshXs4YWCBUxY5N-KiX9LFSCnnlqPqzbnfhrZy8yqTjP0wrlgE6CxIzTUVC9GEnup2U'
let token = new fernet.Token({secret: secret, token: message, ttl:0})
let truth = token.decode();
console.log(truth);