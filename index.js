"use strict";
const express = require("express");
const Response = require("./entity/Response");
const User = require("./entity/User");
const UserLogic = require("./logic/UserLogic");
const HashLogic = require("./logic/HashLogic");
const TokenLogic = require("./logic/TokenLogic");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const actions = require("./actions/index");

const app = express();
app.use(express.json());
async function authenticateToken(req, res, next) {
	const token = req.headers["authorization"];
	if (!token) {
		return res.status(401).json({ message: "Token no proporcionado" });
	}
	let tkn = new TokenLogic();
	let g = await tkn.IsActive(token);
	console.log({ g });
	jwt.verify(token, sskey, (err, user) => {
		if (err || !g) {
			return res.status(403).json({ message: "Token inválido" });
		}
		req.user = user;
		next();
	});
}
let sskey =
	"Nos,|los|representantes|del|pueblo|de|la|Nación|Argentina,|reunidos|en|Congreso|General|Constituyente|por|voluntad|y|elección|de|las|provincias|que|la|componen,|en|cumplimiento|de|pactos|preexistentes,|con|el|objeto|de|constituir|la|unión|nacional,|afianzar|la|justicia,|consolidar|la|paz|interior,|proveer|a|la|defensa|común,|promover|el|bienestar|general,|y|asegurar|los|beneficios|de|la|libertad,|para|nosotros,|para|nuestra|posteridad,|y|para|todos|los|hombres|del|mundo|que|quieran|habitar|en|el|suelo|argentino:|invocando|la|protección|de|Dios,|fuente|de|toda|razón|y|justicia:|ordenamos,|decretamos|y|establecemos|esta|Constitución,|para|la|Nación|Argentina.";
function obtenerFechaFormateada() {
	const fecha = new Date();

	const año = fecha.getFullYear();
	const mes = agregarCeroDelante(fecha.getMonth() + 1);
	const dia = agregarCeroDelante(fecha.getDate());
	const horas = agregarCeroDelante(fecha.getHours());
	const minutos = agregarCeroDelante(fecha.getMinutes());
	const segundos = agregarCeroDelante(fecha.getSeconds());
	const milisegundos = agregarCerosDelante(fecha.getMilliseconds(), 3);

	return `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}.${milisegundos}`;
}

function agregarCeroDelante(numero) {
	return numero.toString().padStart(2, "0");
}

function agregarCerosDelante(numero, cantidad) {
	return numero.toString().padStart(cantidad, "0");
}

app.get("/", (req, res) => {
	res.json({
		message: "Hola mundo!",
	});
});

app.get("/users/:username", async (req, res) => {
	let username = req.params.username;
	let user_logic = new UserLogic();
	let y = await user_logic.getByUsername(username);
	res.json(user_logic.user);
});

app.post("/login", actions.login);
app.post("/logout", authenticateToken, actions.logout);

app.get("/protected", authenticateToken, (req, res) => {
	res.json({ message: "Acceso permitido", username: req.user });
});
app.listen(3000, () => {
	console.log(`Servidor escuchando en el puerto 3000...`);
});
