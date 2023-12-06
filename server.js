const express = require("express");
const app = express();
const cors = require("cors");
require("./cron");
const port = process.env.PORT || 8000;
const cookieParser = require("cookie-parser");
const Routes = require('./Routes/index');

app.use(cors());
app.use(express.json({
    limit: '50mb'
}));
// Use cookie parser
app.use(cookieParser());
//app.set('trust proxy', true);
// Capture 500 errors
app.use('/images', express.static('http/images'));

app.use((error, req, res, next) => {
    res.status(500).send("Could not perform the action");
});

// All Routes
app.use('/', Routes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});