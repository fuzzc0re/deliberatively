module.exports = {
  headers: { "Access-Control-Allow-Origin": "http://localhost:8899" },
  devServer: {
    allowedHosts: ["all"],
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:8899",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  },
};
