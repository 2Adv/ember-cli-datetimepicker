/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-cli-datetimepicker',

  isDevelopingAddon() {
    return true;
  },

  included: function(app) {
    this._super.included(app);
    app.import(app.bowerDirectory + '/datetimepicker/jquery.datetimepicker.css');
    app.import(app.bowerDirectory + '/datetimepicker/jquery.datetimepicker.js');
  }
};
