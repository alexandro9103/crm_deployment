const Pedidos = require('../models/Pedidos');


exports.nuevoPedido = async (req, res, next) => {

    try {
        const pedido = new Pedidos(req.body);
        await pedido.save();
        return res.json({
            mensaje: 'Se ha creado un nuevo Pedido',
            pedido
        });
    } catch (error) {
        console.log(error);
        next();
    }
}

exports.mostrarPedidos = async (req, res, next) => {

    try {

        const pedidos = await Pedidos.find({}).populate('cliente').populate({
            path: 'pedido.producto',
            model: 'Productos'
        });
        return res.json({
            pedidos
        })

    } catch (error) {
        console.log(error);
        next();
    }
}

exports.mostrarPedido = async (req, res, next) => {
    const {
        idPedido
    } = req.params;

    try {
        const pedido = await Pedidos.findById({
            _id: idPedido
        }).populate('cliente').populate({
            path: 'pedido.producto',
            model: 'Productos'
        });
        if (!pedido) {
            return res.json({
                mensaje: 'Ese pedido no existe'
            });
        }
        return res.json({
            pedido
        })
    } catch (error) {
        console.log(error);
        next();
    }

}

exports.actualizarPedido = async (req, res, next) => {

    const {
        idPedido
    } = req.params;

    try {
        const pedido = await Pedidos.findOneAndUpdate({
            _id: idPedido
        }, req.body, {
            new: true
        }).populate('cliente').populate({
            path: 'pedido.producto',
            model: 'Productos'
        })

        if (!pedido) {
            return res.json({
                mensaje: 'Ese pedido no existe'
            });
        }
        return res.json({
            mensaje: 'Pedido Actualizado',
            pedido
        })
    } catch (error) {
        console.log(error);
        next();
    }

}

exports.eliminarPedido = async (req, res, next) => {
    const {
        idPedido
    } = req.params;

    try {
        const pedido = await Pedidos.findOneAndRemove({
            _id: idPedido
        }).populate('cliente').populate({
            path: 'pedido.producto',
            model: 'Productos'
        });
        if (!pedido) {
            return res.json({
                mensaje: 'Este pedido no existe'
            });
        }
        return res.json({
            mensaje: 'El pedido se ha eliminado',
            pedido
        })
    } catch (error) {
        console.log(error);
        next();
    }
}