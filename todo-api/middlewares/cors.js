function enableCors(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Replace with your desired domain or "*" for all domains
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS'); // Replace with the allowed HTTP methods for your API endpoint 
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Replace with the allowed headers for your API endpoint
  next();
}

module.exports = enableCors;