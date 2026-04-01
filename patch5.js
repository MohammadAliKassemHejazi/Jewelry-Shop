const fs = require('fs');
const file = 'server/src/middlewares/error.middleware.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `  // Log error for debugging
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });`,
  `  // Log error for debugging (skip verbose logging for expected 401s like missing auth headers)
  if (statusCode !== 401) {
    console.error('Error:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  }`
);

fs.writeFileSync(file, code);
