"use strict";
const Response = require("./../entity/Response");
const Connection = require("./../data/Connection");
const Hash = require("./../entity/Hash");
const bcrypt = require("bcrypt");

class HashLogic {
	constructor(hash = new Hash()) {
		let data = {
			hash,
			...this,
			Columns: {
				user: "Usuario",
				hash: "Hash",
				salt: "Salt",
				lastModified: "ÚltimaModificación",
				active: "Activo",
			},
			Table: "Hashes",
		};
		Object.assign(this, data);
	}

	async CheckPassword({ user, password } = obj, next) {
		let hash, salt;
		let cn = new Connection(Connection.Database.Eclair);
		let result = cn.Response.ErrorFound
			? cn.Response
			: await cn.FetchData(
					`SELECT [${this.Columns.hash}], [${this.Columns.salt}] 
               FROM [${this.Table}]
               WHERE [${this.Columns.user}] = '${user}' AND [${this.Columns.active}] = '1'
               ORDER BY [${this.Columns.lastModified}] DESC`
			  );
		if (!result.ErrorFound) {
			const record = result.ObjectReturned;
			if (record.length > 0) {
				const finalRow = record[0];
				hash = finalRow[this.Columns.hash];
				salt = finalRow[this.Columns.salt];
				try {
					const isMatch = await bcrypt.compare(password, hash);

					if (isMatch) {
						await next({
							errCode: 200,
							msg: "Inicio de sesión exitoso.",
						});
					} else {
						await next({
							errCode: 403,
							msg: "Credenciales inválidas",
						});
					}
				} catch (err) {
					await next({
						errCode: 401,
						msg: "Error al comparar las contraseñas",
					});
				}
			} else {
				await next({
					errCode: 404,
					msg: "Credenciales inválidas",
				});
			}
		}
	}
}
module.exports = HashLogic;
