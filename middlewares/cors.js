const cors = require("cors");
const corsMiddleware =  cors({
    origin: [
      "http://127.0.0.1:5500",
      "www.cardsproject.co.il",
      "http://localhost:5500",
    ],
  })
    module.exports = corsMiddleware;