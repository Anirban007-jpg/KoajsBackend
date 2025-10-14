// app.js
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const ledgerRoutes = require('./routes/ledgerRoutes');
const debtorRoutes= require('./routes/debtorRoutes');
const assetRoutes= require('./routes/assetRoutes');
const creditorRoutes = require('./routes/creditorRoutes')
const http = require('http');
const { Server } = require('socket.io');
const journalRoutes = require('./routes/journalRoutes');
const ratelimit = require('koa-ratelimit');
const Redis = require('ioredis');
const cors = require('@koa/cors');
const { bearerToken } = require('koa-bearer-token');
// apply rate limit
const db = new Map();

const app = new Koa();
const httpServer = http.createServer(app.callback()); // Koa exposes its application as a request handler via app.callback()

// Initialize Socket.IO with the HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Allow all origins for development
    methods: ['GET', 'POST']
  }
});

// Define your Socket.IO connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listen for 'chat message' events from the client
  socket.on('chat message', (msg) => {
    console.log(`Message from ${socket.id}: ${msg}`);
    // Broadcast the message to all connected clients
    io.emit('chat message', msg);
  });

  // Handle client disconnections
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser());
app.use(cors());
app.use(bearerToken());
app.use(ratelimit({
    driver: 'memory',
    db: db,
    duration: 12*60*1000,
    errorMessage: 'Sometimes You Just Have to Slow Down.',
    id: (ctx) => ctx.ip,
    headers: {
      remaining: 'Rate-Limit-Remaining',
      reset: 'Rate-Limit-Reset',
      total: 'Rate-Limit-Total'
    },
    max: 100,
    disableHeader: false,
    whitelist: (ctx) => {
      // some logic that returns a boolean
      
    },
    blacklist: (ctx) => {
      // some logic that returns a boolean
    }
}));
  
  
// Routes
app.use(journalRoutes.routes()).use(journalRoutes.allowedMethods());
app.use(userRoutes.routes()).use(userRoutes.allowedMethods());
app.use(ledgerRoutes.routes()).use(ledgerRoutes.allowedMethods());
app.use(debtorRoutes.routes()).use(debtorRoutes.allowedMethods());
app.use(assetRoutes.routes()).use(assetRoutes.allowedMethods());
app.use(creditorRoutes.routes()).use(creditorRoutes.allowedMethods());


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});