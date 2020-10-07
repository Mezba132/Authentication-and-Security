const express = require("express");
const app = express();

const route = require("./controller/index");
app.use(route);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
})
