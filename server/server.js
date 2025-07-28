const server = require('./app'); // Remove destructuring
const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Socket.io is now listening for connections`);
});