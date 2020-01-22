const Clientes = require('../models/Clientes');

exports.nuevoCliente = async (req, res, next) => {

    const cliente = new Clientes(req.body);

    try {
        await cliente.save();
        res.json({
            mensaje: 'Se agrego un nuevo cliente'
        })
    } catch (err) {
        res.send(err);
        next();

    }
}

exports.mostrarClientes = async (req, res, next) => {

    try {

        const clientes = await Clientes.find({});
        res.json({
            clientes
        })
    } catch (error) {
        console.log(error);
        next();
    }
}

exports.mostrarCliente = async (req, res, next) => {

    const {
        idCliente
    } = req.params;

    try {
        const cliente = await Clientes.findById({
            _id: idCliente
        });

        if (!cliente) {
            return res.json({
                mensaje: 'Ese cliente no existe'
            })
        }

        res.json({
            cliente
        })

    } catch (error) {
        console.log(error);
        next();
    }
}

exports.actualizarCliente = async (req, res, next) => {

    const {
        idCliente
    } = req.params;

    try {
        const cliente = await Clientes.findOneAndUpdate({
            _id: idCliente
        }, req.body, {
            new: true
        });
        res.json({
            cliente
        })
    } catch (error) {
        res.send(error);
        next();

    }
}

exports.eliminarCliente = async (req, res, next) => {
    const {
        idCliente
    } = req.params;
    try {
        const cliente = await Clientes.findOneAndRemove({
            _id: idCliente
        });
        return res.json({
            mensaje: `El cliente ${cliente.nombre} se ha eliminado`,
            cliente
        })
    } catch (error) {
        console.log(error);
        next();
    }
}