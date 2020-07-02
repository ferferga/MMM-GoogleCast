'use strict';
const NodeHelper = require('node_helper');
const PythonShell = require('python-shell');

module.exports = NodeHelper.create({
  
  python_start: function () {
    const self = this;
    const pyshell = new PythonShell('modules/' + this.name + '/lib/Cast.py', { mode: 'json', args: [JSON.stringify(this.config)], pythonPath: 'python3'});

    pyshell.on('message', function (message) {
        if (message.hasOwnProperty('deviceStatus')) {
          self.sendSocketNotification('deviceStatus', {type: 'deviceStatus', id: message.deviceStatus.id, app: message.deviceStatus.app, volume: message.deviceStatus.volume});
        }

        if (message.hasOwnProperty('mediaStatus')) {
          self.sendSocketNotification('mediaStatus', {type: 'mediaStatus', id: message.mediaStatus.id, albumArtist: message.mediaStatus.albumArtist, image: message.mediaStatus.image, 
            title: message.mediaStatus.title, state: message.mediaStatus.state, album: message.mediaStatus.album, artist: message.mediaStatus.artist});
        }

        if (message.hasOwnProperty('GCAST_BACKEND_STATUS')) {
          self.sendSocketNotification('GCAST_BACKEND_STATUS', {type: 'GCAST_BACKEND_STATUS', message: message.status});
        }

        if (message.hasOwnProperty('importError')) {
          self.sendSocketNotification('importError', {type: 'importError'});
        }
      });

      pyshell.end(function (err) {
        self.sendSocketNotification('status', {type: 'status', message: 'error'});
        throw err;
      });
    },
    socketNotificationReceived: function(notification, payload) {
      if(notification === 'CONFIG') {
        this.config = payload;
        this.python_start();
      };
    }
});