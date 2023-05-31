"use strict";
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "Hola mundo!",
  });
});

app.listen(3000, () => {
  console.log(`Servidor escuchando en el puerto 3000...`);
});
