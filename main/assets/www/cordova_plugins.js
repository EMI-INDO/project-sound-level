cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "emi-indo-cordova-plugin-admob.emiAdmobPlugin",
      "file": "plugins/emi-indo-cordova-plugin-admob/www/emiAdmobPlugin.js",
      "pluginId": "emi-indo-cordova-plugin-admob",
      "clobbers": [
        "cordova.plugins.emiAdmobPlugin"
      ]
    },
    {
      "id": "sound-level-meter.SoundMeter",
      "file": "plugins/sound-level-meter/www/SoundMeter.js",
      "pluginId": "sound-level-meter",
      "clobbers": [
        "cordova.plugins.SoundMeter"
      ]
    },
    {
      "id": "cordova-plugin-network-information.network",
      "file": "plugins/cordova-plugin-network-information/www/network.js",
      "pluginId": "cordova-plugin-network-information",
      "clobbers": [
        "navigator.connection"
      ]
    },
    {
      "id": "cordova-plugin-network-information.Connection",
      "file": "plugins/cordova-plugin-network-information/www/Connection.js",
      "pluginId": "cordova-plugin-network-information",
      "clobbers": [
        "Connection"
      ]
    }
  ];
  module.exports.metadata = {
    "emi-indo-cordova-plugin-admob": "2.0.7",
    "sound-level-meter": "0.0.2",
    "cordova-plugin-network-information": "3.0.0"
  };
});