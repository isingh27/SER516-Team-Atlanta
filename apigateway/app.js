const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware")
require('dotenv').config()

// const MICROSERVICES = {
//     'auth': process.env.AUTH_URL,
//     'cycleTime': process.env.CYCLE_TIME_URL,
//     'leadTime': process.env.LEAD_TIME_URL,
//     'throughput': process.env.THROUGHPUT_URL,
//     'cumulativeFlowDiagram': process.env.CFD_URL,
//     'wip': process.env.WIP_URL,
// }
const services = [
    {
      route: "/auth",
      target: process.env.AUTH_URL,
    },
    {
      route: "/cycleTime",
      target: process.env.CYCLETIME_URL,
    },
    {
      route: "/leadTime",
      target: process.env.LEADTIME_URL,
    },
    {
      route: "/throughput",
      target: process.env.THROUGHPUT_URL,
    },
    {
      route: "/cumulativeFlowDiagram",
      target: process.env.CFD_URL,
    },
    {
      route: "/wip",
      target: process.env.WIP_URL,
    },
    {
      route: "/burndown",
      target: process.env.BURNDOWN_URL,
    },
    // {
    //   route: "/impedimentTracker",
    //   target: process.env.IMPEDIMENT_TRACKER
  
    {
      route: "/sbpbcoupling",
      target: process.env.SBPBCOUPLING_URL
    },
    {
      route: "/engagement",
      target: process.env.ENGAGEMENT_URL
    },
    {
      route: "/taskcoupling",
      target: process.env.TASKCOUPLING_URL
    },
    {
      route: "/costofdelay",
      target: process.env.COSTOFDELAY_URL
    }
   ];

   const app = express();


app.use(cors()); // Enable CORS
app.use(helmet()); // Add security headers
app.use(morgan("combined")); // Log HTTP requests
app.disable("x-powered-by"); // Hide Express server information

services.forEach(({ route, target }) => {
    // Proxy options
    const proxyOptions = {
      target,
      changeOrigin: true,
      pathRewrite: {
        [`^${route}`]: "",
      },
    };
  
    // Apply rate limiting and timeout middleware before proxying
    app.use(route, createProxyMiddleware(proxyOptions));
  });

  app.use((_req, res) => {
    res.status(404).json({
      code: 404,
      status: "Error",
      message: "Route not found.",
      data: null,
    });
  });
  
  // Define port for Express server
  const PORT = process.env.PORT || 5050;
  
  // Start Express server
  app.listen(PORT, () => {
    console.log(`Gateway is running on port ${PORT}`);
  });
  