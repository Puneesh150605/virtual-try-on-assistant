const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for logging requests in production
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Enable CORS and secure headers for static resources and face-api models
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Serve static files from the root directory
app.use(express.static(path.join(__dirname), {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
            // Do not cache html files so updates are immediate
            res.setHeader('Cache-Control', 'no-cache');
        } else if (filePath.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
            // Cache assets for 7 days
            res.setHeader('Cache-Control', 'public, max-age=604800');
        }
    }
}));

// Route for health check (useful for Railway zero-downtime deployments)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Fallback route to serve index.html for any SPA/unmatched requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`==================================================`);
    console.log(`🚀 Virtual Try-On Assistant Server running!`);
    console.log(`🌐 Local URL: http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'production'}`);
    console.log(`==================================================`);
});
