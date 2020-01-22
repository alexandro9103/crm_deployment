const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	const authHeader = req.get('Authorization');

	if (!authHeader) {
		const error = new Error('No autenticado');
		error.statusCode = 401;
		throw error;
	}

	const token = authHeader.split(' ')[1];


	try {
		let revisarToken = jwt.verify(token, 'LLAVESECRETA');

		if (!revisarToken) {
			const error = new Error('No autenticado');
			error.statusCode = 401;
			throw error;
		}
		next();
	} catch (error) {
		error.statusCode = 500;
		throw error;
	}
};