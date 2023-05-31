"use strict";
const HashLogic = require("./../logic/HashLogic");
const TokenLogic = require("./../logic/TokenLogic");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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

const sskey =
	"Nos,|los|representantes|del|pueblo|de|la|Nación|Argentina,|reunidos|en|Congreso|General|Constituyente|por|voluntad|y|elección|de|las|provincias|que|la|componen,|en|cumplimiento|de|pactos|preexistentes,|con|el|objeto|de|constituir|la|unión|nacional,|afianzar|la|justicia,|consolidar|la|paz|interior,|proveer|a|la|defensa|común,|promover|el|bienestar|general,|y|asegurar|los|beneficios|de|la|libertad,|para|nosotros,|para|nuestra|posteridad,|y|para|todos|los|hombres|del|mundo|que|quieran|habitar|en|el|suelo|argentino:|invocando|la|protección|de|Dios,|fuente|de|toda|razón|y|justicia:|ordenamos,|decretamos|y|establecemos|esta|Constitución,|para|la|Nación|Argentina.";

const login = async (req, res) => {
	const { username, password } = req.query;
	let hsh = new HashLogic();
	let checkResult = hsh.CheckPassword(
		{
			user: username,
			password: password,
		},
		async (cr) => {
			console.log({ cr });
			if (cr.errCode == 200) {
				let date = obtenerFechaFormateada();
				const token = jwt.sign({ username, date }, sskey, {
					expiresIn: "24h",
				});
				let tkn = new TokenLogic();
				let rs = await tkn.Insert(token, 1, date);
				console.log({ rs });
				if (rs.result) res.status(200).json({ token });
			} else {
				res.status(403).json({ err: "Usuario o contraseña inválidos" });
			}
		}
	);
};
const logout = async (req, res) => {
	const token = req.headers["authorization"];
	let e = new TokenLogic();
	let z = await e.Deactivate(token);
	if (z.result) {
		res.status(200).json({
			result: z.result,
			message: "Se inhabilitó el token (Sesión cerrada)",
		});
	} else {
		res.status(500).json({
			result: z.result,
			message:
				"Hubo un problema al inhabilitar el token. Puede que la sesión siga abierta. ",
		});
	}
};
module.exports = { login, logout };
