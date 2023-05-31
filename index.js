"use strict";
const express = require("express");
const actions = require("./actions/index");
const app = express();
app.use(express.json());

/* Pre-respuesta */
app.use((req, res, next) => {
	res.set("Content-Type", "application/json; charset=utf-8");
	next();
});

/* Obtener data */
app.get("/users/:username", actions.getUserByUsername);

/* Manejo de sesiones */
app.post("/login", actions.login);
app.post("/logout", actions.authenticateToken, actions.logout);

/* Probar conexión */
app.get("/protected", actions.authenticateToken, (req, res) => {
	res.json({ message: "Acceso permitido", username: req.user });
});

/* Puesta en marcha del servidor */
app.listen(3000, () => {
	console.log(`Servidor escuchando en el puerto 3000...`);
});
