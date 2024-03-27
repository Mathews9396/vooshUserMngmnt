require("module-alias/register"); // added alias

const express = require("express");
const logger = require("@utils/logger");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
// const { messages } = require("@constants/messages");

const authRoutes = require("@routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

app.use(express.json());
app.use(
  morgan(":method :url TIME=:response-time ms HEADERS=:req[header] IP= :remote-addr ", {
    stream: { write: (message) => logger.http(message) },
    skip: function (req, res) {
      return req.url === "/liveness";
    },
  })
);
app.use(cors());
app.use(passport.initialize());
app.use(session({ secret: process.env["GOOGLE_CLIENT_SECRET"], resave: true, saveUninitialized: true }));

const db = require("@root/models");
async function connectDB() {
  try {
    await db.sequelize.sync({ force: false, logging: false }); // this is dangerous for prod/staging env
    await db.sequelize.authenticate();
    logger.info("Connection has been established successfully.");
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
  }
}
connectDB();

// app.use(passport.initialize());

app.use("/", authRoutes);
app.use("/profile", profileRoutes);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Voosh Backend Assignment by Mathews",
      version: "1.0.0",
      description: "API docs",
    },
  },
  apis: ["./swagger.yaml"], // Path to your Swagger specification file
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// app.use(
//   "/api-docs",
//   swaggerUi.serve,
//   swaggerUi.setup(require(path.resolve(`${__dirname}/../swagger/swagger.json`)))
// );

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
