require('dotenv').config();
require('express-async-errors');
const fileUpload = require("express-fileupload");
// USE VERSION AS V2.
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
})

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
const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");

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
// temporary files (store in tmp directory) are used to handle the image upload.
app.use(fileUpload({useTempFiles: true}));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", authenticationMiddleware, userRouter);
app.use("/api/v1/products", productRouter);

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