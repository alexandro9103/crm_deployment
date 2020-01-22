const Productos = require('../models/Productos');
const multer = require('multer');
const shortid = require('shortid');

const configuracionMulter = {
	storage: (fileStorage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, __dirname + '../../uploads/');
		},
		filename: (req, file, cb) => {
			const extension = file.mimetype.split('/')[1];
			console.log(extension);
			cb(null, `${shortid.generate()}.${extension}`);
		}
	})),
	fileFilter(req, file, cb) {
		if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
			cb(null, true);
		} else {
			cb(new Error('Formato no Valido'));
		}
	}
};

const upload = multer(configuracionMulter).single('imagen');

exports.subirArchivo = (req, res, next) => {
	upload(req, res, function(err) {
		if (err) {
			res.json({
				mensaje: err
			});
		}
		return next();
	});
};

exports.nuevoProducto = async (req, res, next) => {
	try {
		const producto = new Productos(req.body);

		console.log(req.file);
		if (req.file.filename) {
			producto.imagen = req.file.filename;
		}

		await producto.save();
		return res.json({
			mensaje: `El producto ${producto.nombre} se ha agregado correctamente`,
			producto
		});
	} catch (error) {
		console.log(error);
		next();
	}
};

exports.mostrarProductos = async (req, res, next) => {
	try {
		const productos = await Productos.find({});
		return res.json({
			productos
		});
	} catch (error) {
		console.log(error);
		next();
	}
};

exports.mostrarProducto = async (req, res, next) => {
	const { idProducto } = req.params;

	try {
		const producto = await Productos.findById({
			_id: idProducto
		});

		if (!producto) {
			return res.json({
				mensaje: 'Ese producto no existe'
			});
		}
		return res.json({
			producto
		});
	} catch (error) {
		console.log(error);
		next();
	}
};

exports.actualizarProducto = async (req, res, next) => {
	const { idProducto } = req.params;

	try {
		let nuevoProducto = req.body;
		if (req.file) {
			nuevoProducto.imagen = req.file.filename;
		} else {
			const productoAnterior = await Productos.findById({
				_id: idProducto
			});
			nuevoProducto.imagen = productoAnterior.imagen;
		}

		const producto = await Productos.findOneAndUpdate(
			{
				_id: idProducto
			},
			nuevoProducto,
			{
				new: true
			}
		);
		return res.json({
			producto
		});
	} catch (error) {
		console.log(error);
		next();
	}
};

exports.eliminarProducto = async (req, res, next) => {
	const { idProducto } = req.params;

	try {
		const producto = await Productos.findOneAndRemove({
			_id: idProducto
		});
		return res.json({
			mensaje: `El producto ${producto.nombre} se ha eliminado`,
			producto
		});
	} catch (error) {
		console.log(error);
		next();
	}
};

exports.buscarProducto = async (req, res, next) => {
	try {
		const { query } = req.params;
		const productos = await Productos.find({ nombre: new RegExp(query, 'i') });
		res.json(productos);
	} catch (error) {
		console.log(error);
		next();
	}
};
