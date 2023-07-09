const Order = require('../../../models/order')

function statusController() {
    return {
        update(req, res) {
            // console.log(req.body.orderId); console.log(req.body.status);
            Order.updateOne({_id: req.body.orderId}, { status: req.body.status }, (err, data)=> {
                if(err) {
                    return res.redirect('/admin/orders')
                }
                // Emit event 
                //jab databse mai change hojaye status toh ek event emit kro  ki orderstatus update ho chuka haii 
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderUpdated', { id: req.body.orderId, status: req.body.status })
                return res.redirect('/admin/orders')
            })
        }
    }
}

module.exports = statusController