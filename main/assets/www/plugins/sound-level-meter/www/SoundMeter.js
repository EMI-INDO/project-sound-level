cordova.define("sound-level-meter.SoundMeter", function(require, exports, module) {
var exec = require('cordova/exec');

var SoundMeter = {
    start: function (success, error) {
        exec(success, error, "SoundMeter", "start", []);
    },
    stop: function (successCallback, errorCallback) {
        exec(successCallback, errorCallback, "SoundMeter", "stop", []);
    },
    updateSettings: function (settings, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "SoundMeter", "updateSettings", [options]);
    }
};
module.exports = SoundMeter;

});
