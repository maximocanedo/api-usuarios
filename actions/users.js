"use strict";
const UserLogic = require("./../logic/UserLogic");

const getUserByUsername = async (req, res) => {
	let username = req.params.username;
	let user_logic = new UserLogic();
	let y = await user_logic.getByUsername(username);
	res.json(user_logic.user);
};

module.exports = { getUserByUsername };
