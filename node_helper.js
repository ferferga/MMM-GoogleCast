'use strict';
const NodeHelper = require('node_helper');

const PythonShell = require('python-shell');
var pythonStarted = false

module.exports = NodeHelper.create({
  
  python_start: function () {
    const self = this;
    const pyshell = new PythonShell("modules/" + this.name + '/lib/Cast.py', { mode: 'json', args: [JSON.stringify(this.config)], pythonPath: 'python3'});

    pyshell.on('message', function (message) {
        if (message.hasOwnProperty('deviceStatus'))
        {
          self.sendSocketNotification('deviceStatus', {type: "deviceStatus", app: message.deviceStatus.app, volume: message.deviceStatus.volume})
        }
        if (message.hasOwnProperty('mediaStatus'))
        {
          self.sendSocketNotification('mediaStatus', {type: "mediaStatus", albumArtist: message.mediaStatus.albumArtist, image: message.mediaStatus.image, 
            title: message.mediaStatus.title, state: message.mediaStatus.state, album: message.mediaStatus.album, artist: message.mediaStatus.artist});
        }
        if (message.hasOwnProperty('status'))
        {
          self.sendSocketNotification('status', {type: "status", message: message.status})
        }
        if (message.hasOwnProperty('importError'))
        {
          self.sendSocketNotification('importError', {type: "importError"})
          console.log("[" + self.name + "] Error while loading MMM-GoogleCast. The environment was not set up correctly")
        }
        console.log("[" + self.name + "] Update received! Details:\n", message)
      });

      pyshell.end(function (err) {
        if (err) throw err;
        console.log("[" + self.name + "] " + 'finished running...');
        self.sendSocketNotification('status', {type: "status", message: "error"})
      });
    },
    socketNotificationReceived: function(notification, payload) {
      if(notification === 'CONFIG') {
        this.config = payload
        if(!pythonStarted) {
          pythonStarted = true;
          this.python_start();
          };
      };
    }
});