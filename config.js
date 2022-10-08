const fs = require('fs');
var key = fs.readFileSync('E:/Tugasnodejs/task2/certs/key.pem');

module.exports = {
	secret: key
}