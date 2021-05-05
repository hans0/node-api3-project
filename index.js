// require your server and launch it
const server = require('./api/server.js');

const portNumber = 5000;

server.listen(portNumber, () => {
  console.log(`\n* Server Running on http://localhost:${portNumber} *\n`)
})