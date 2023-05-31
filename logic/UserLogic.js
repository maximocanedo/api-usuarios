"use strict";
const Connection = require("./../data/Connection");
const User = require("./../entity/User");
class UserLogic {
	constructor(user = new User()) {
		let data_ = {
			user,
			...this,
			Columns: {
				username: "NombreDeUsuario",
				name: "Nombre",
				surname: "Apellido",
				birthdate: "FechaDeNacimiento",
				sex: "Sexo",
				active: "Habilitado",
			},
			Table: "Usuarios",
		};
		Object.assign(this, data_);
	}
	setFromRecordSet(obj) {
		this.user.username = obj[this.Columns.username];
		this.user.name = obj[this.Columns.name];
		this.user.surname = obj[this.Columns.surname];
		this.user.birthdate = obj[this.Columns.birthdate];
		this.user.sex = obj[this.Columns.sex];
		this.user.active = obj[this.Columns.active];
	}
	async getByUsername(username) {
		let cn = new Connection(Connection.Database.Eclair);
		let data = cn.Response.ErrorFound
			? cn.Response
			: await cn.FetchData(
					`SELECT [${this.Columns.username}], [${this.Columns.name}], [${this.Columns.surname}], [${this.Columns.birthdate}], [${this.Columns.sex}], [${this.Columns.active}] FROM [${this.Table}] WHERE [${this.Columns.username}] = '${username}'`
			  );
		if (data.ErrorFound == false) {
			const result = data.ObjectReturned;
			if (result.length > 0) {
				const res = result[0];
				this.setFromRecordSet(res);
				//return res;
				return {
					ErrorFound: false,
					ObjectReturned: this.user,
					Code: 200,
				};
			} else {
				return {
					ErrorFound: true,
					Message: "User not found",
					Code: 404,
				};
			}
		}
		return data;
	}
}

module.exports = UserLogic;
