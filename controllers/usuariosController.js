const Usuarios = require('../models/Usuarios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-node');

exports.registrarUsuario = async (req, res) => {
	const usuario = new Usuarios(req.body);
	usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));

	try {
		await usuario.save();
		return res.json({
			mensaje: 'Usuario creado correctamente'
		});
	} catch (error) {
		console.log(error);
		return res.json({
			mensaje: 'Hubo un error al crear el usuario'
		});
	}
};

exports.autenticarUsuario = async (req, res, next) => {
	const {
		email,
		password
	} = req.body;

	const usuario = await Usuarios.findOne({
		email
	});

	if (!usuario) {
		return res.status(401).json({
			mensaje: 'Ese usuario no existe'
		});
	} else {
		if (!bcrypt.compareSync(password, usuario.password)) {
			return res.status(401).json({
				mensaje: 'Password Incorrecto'
			});
		} else {
			const payload = {
				nombre: usuario.nombre,
				email: usuario.email,
				_id: usuario._id
			};
			const token = jwt.sign(payload, 'LLAVESECRETA', {
				expiresIn: '5h'
			});

			return res.json({
				token
			});
		}
	}
};