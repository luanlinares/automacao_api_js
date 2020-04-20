const express = require("express");
const app = express();

app.get("/hello", function(req, res) {
    res.status(200).json({message: "Ola NodeJs com express"})
})

app.listen(3000);