var store = require('../services/noteStorage.js');


module.exports.getNotes = function (req, res) {
    res.format({
        'application/json': function () {
            res.send(store.getByCompletion(true));
        }
    });

};