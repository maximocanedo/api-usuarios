"use strict";
const User = require("./../entity/User");
const Hash = require("./../entity/Hash");
const Token = require("./../entity/Token");
const UserLogic = require("./../logic/UserLogic");
const HashLogic = require("./../logic/HashLogic");
const { rawLogin } = require("./../actions/sessions");

const getUserByUsername = async (req, res) => {
	let username = req.params.username;
	let user_logic = new UserLogic();
	let y = await user_logic.getByUsername(username);
	res.json(user_logic.user);
};

const createUser = async (req, res) => {
	let dataNeeded = {
		username: "",
		name: "",
		surname: "",
		birthdate: "",
		sex: "",
		// Hash
		hash: "",
		salt: "",
		lastModified: "",
		// Primer inicio de sesión
		token: "",
		created: "",
	};
	let newUser = new User({
		username: req.query.username,
		name: req.query.name,
		surname: req.query.surname,
		birthdate: new Date(req.query.birthdate),
		sex: req.query.sex,
	});
	let ul = new UserLogic();
	let vs = await ul.AddUser(newUser);
	let EtapaUsuario = vs.VerificationsResult && vs.InsertResult;
	let EtapaClave = false;
	let ObjetoClave = {};
	let StatusCode = 500;
	let LoginDetails = {};
	let InicioSesion = false;
	if (EtapaUsuario) {
		/* Creamos una clave */
		let newHash = new HashLogic();
		let password_data = await newHash.CreatePassword(
			newUser.username,
			req.query.password
		);
		EtapaClave = password_data.SummaryResult;
		ObjetoClave = password_data;
		if (EtapaClave) {
			/* Listo. Ahora iniciamos sesión */
			console.log({ rawLogin });
			let loginResult = await rawLogin(
				newUser.username,
				req.query.password
			);
			console.log({ loginResult });
			StatusCode = loginResult.status;
			LoginDetails = loginResult.json;
			InicioSesion = StatusCode == 200;
		}
	}
	res.status(StatusCode).json({
		UserRecord: vs,
		HashRecord: false,
		...ObjetoClave,
		LoginDetails,
		InicioSesion,
	});
};

module.exports = { getUserByUsername, createUser };
