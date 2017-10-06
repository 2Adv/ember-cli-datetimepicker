import Ember from 'ember';
import moment from 'moment';

const { Component, get, on, observer,computed,run,run: { scheduleOnce },$: { proxy }, copy} = Ember;

function formatDate(date) {
  return moment(date).format('YYYY/MM/DD H:mm');
}


export default Component.extend({
  tagName: 'input',
  classNames: ['date-time-picker'],
  datetime:undefined,

  _updateValue(shouldForceUpdatePicker) {
    let value, datetime = get(this, 'datetime');
    if (datetime) {
      value = formatDate(datetime);
    } else {
      value = '';
    }

    let el = this.$();
    el.val(value);

    // is only needed for inline, changing value above didn't change the picker
    if (shouldForceUpdatePicker) {
      el.datetimepicker({ value });
    }
  },

  setupPicker() {
    let options = get(this, 'options') || {};
    options = copy(options);
    scheduleOnce('afterRender', () => { this.$().datetimepicker(options)});
  },

  didInsertElement() {
    this._super(...arguments);
    this._updateValue();
    this.setupPicker()
  },

  didUpdateAttrs() {
    this._super(...arguments);
    this._updateValue(true);
    this.setupPicker()
  },

  willDestroyElement() {
    this.$().datetimepicker('destroy');
  }

});
