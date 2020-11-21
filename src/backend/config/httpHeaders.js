export default {
    'Access-Control-Allow-Origin': (req, res, next) => req.headers.origin || req.headers.host,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Set-Cookie, X-Requested-With, Content-Type, Accept, X-CSRF-TOKEN',
    'Access-Control-Allow-Credentials': true,
    'Content-Security-Policy': (req, res, next) => `connect-src 'self' ${req.headers.origin || req.headers.host}`,
    // 'Content-Security-Policy': 'default-src *; connect-src *',
    // 'X-Content-Security-Policy': 'default-src *; connect-src *',
};