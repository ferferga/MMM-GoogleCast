'use strict';
const NodeHelper = require('node_helper');
const PythonShell = require('python-shell');

module.exports = NodeHelper.create({
    python_start: function () {
        const pyshell = new PythonShell('modules/' + this.name + '/lib/Cast.py', { mode: 'json', args: [JSON.stringify(this.config)], pythonPath: 'python3' });

        pyshell.on('message', function (message) {
            if (message.hasOwnProperty('MMGCAST_BACKEND_EXCEPTION')) {
                console.error(message);
            }
            this.sendSocketNotification(message);
        });

        pyshell.end(function (err) {
            this.sendSocketNotification('MMGCAST_BACKEND_EXCEPTION', err.toString());
            console.error(err);
            throw err;
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'MMMGCAST_CONFIG') {
            this.config = payload;
            this.python_start();
        }
    },
});
