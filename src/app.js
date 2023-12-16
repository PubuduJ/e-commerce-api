require('dotenv').config();
require('express-async-errors');

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");

const express = require('express');
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// database connection
const connectDB = require("./db/connect");

// routers
const authRouter = require("./routes/authRouter");

// middlewares
const notFoundMiddleware = require('./middlewares/notFoundMiddleware');
const errorHandlerMiddleware = require('./middlewares/errorhandlerMiddleware');
const authenticationMiddleware = require("./middlewares/authenticationMiddleware");

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(morgan("tiny"));

app.use("/api/v1/auth", authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB();
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start().then(r => {});