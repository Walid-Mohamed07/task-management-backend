const { io } = require('socket.io-client');

// Example usage:
// node examples/chat-client.js <serverUrl> <jwtToken> <conversationId>

const serverUrl = process.argv[2] || 'http://localhost:3000';
console.log({ serverUrl });

const token = process.argv[3] || '';
if (!token) console.warn('⚠ No token provided; socket may not authenticate.');
console.log({ token: token ? 'SET' : 'MISSING' });

const conversationId = process.argv[4] || 'conversation-id-sample';
console.log({ conversationId });

const socket = io(serverUrl, {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
});

socket.on('connect', () => {
    console.log('✓ connected', socket.id);
    socket.emit('join', { conversationId });
});

socket.on('connect_error', (err) => {
    console.error('✗ connect_error:', err.message);
});

socket.on('disconnect', (reason) => {
    console.log('✗ disconnected:', reason);
});

socket.on('joined', (data) => console.log('→ joined', data));
socket.on('message', (msg) => console.log('← message received', msg));
socket.on('read', (r) => console.log('← read receipt', r));
socket.on('sent', (data) => console.log('✓ sent', data));
socket.on('error', (err) => console.error('✗ socket error', err));

// send a message via socket every 5 seconds (if authenticated)
setInterval(() => {
    if (socket.connected && token) {
        socket.emit('message', { conversationId, content: 'ping ' + Date.now() });
    }
}, 5000);

// keep process alive
setTimeout(() => {
    console.log('\nClosing in 30 seconds...');
    setTimeout(() => {
        socket.disconnect();
        process.exit(0);
    }, 30000);
}, 1000);
