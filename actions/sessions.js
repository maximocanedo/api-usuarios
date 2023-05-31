"use strict";
// Llaves
const keys = require("./../keys");
// Utilidades
const utilities = require("./../logic/utilities");
// Lógica
const HashLogic = require("./../logic/HashLogic");
const TokenLogic = require("./../logic/TokenLogic");
// Otras librerías
const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
	const tkn = new TokenLogic();
	const token = req.headers["authorization"];
	if (!token) {
		return res.status(401).json({ message: "Token no proporcionado" });
	}
	let g = await tkn.IsActive(token);
	jwt.verify(token, keys.TOKEN_AUTHORIZATION_KEY, (err, user) => {
		if (err || !g) {
			return res.status(403).json({ message: "Token inválido" });
		}
		req.user = user;
		next();
	});
};
const login = async (req, res) => {
	const { username, password } = req.query;
	let hsh = new HashLogic();
	hsh.CheckPassword(
		{
			user: username,
			password: password,
		},
		async (cr) => {
			if (cr.errCode == 200) {
				let date = utilities.formatDateForSQL();
				const token = jwt.sign(
					{ username, date },
					keys.TOKEN_AUTHORIZATION_KEY,
					{
						expiresIn: "24h",
					}
				);
				let tkn = new TokenLogic();
				let rs = await tkn.Insert(token, 1, date);
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

module.exports = { login, logout, authenticateToken };
