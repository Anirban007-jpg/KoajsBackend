// app.js
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const ledgerRoutes = require('./routes/ledgerRoutes');
const ratelimit = require('koa-ratelimit');
const Redis = require('ioredis');
const cors = require('@koa/cors');
const { bearerToken } = require('koa-bearer-token');
// apply rate limit
const db = new Map();

const app = new Koa();

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser());
app.use(cors());
app.use(bearerToken());
app.use(ratelimit({
    driver: 'memory',
    db: db,
    duration: 60000,
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
app.use(userRoutes.routes()).use(userRoutes.allowedMethods());
app.use(ledgerRoutes.routes()).use(ledgerRoutes.allowedMethods());


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});