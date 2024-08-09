const http = require('http');
const port = process.env.PORT || 80;
const interval = process.env.INTERVAL || 'default interval';

const requestHandler = (req, res) => {
  res.end(`Hello from Node.js! Interval is set to: ${interval}`);
};

const server = http.createServer(requestHandler);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

