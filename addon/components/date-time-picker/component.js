import Ember from 'ember';
import moment from 'moment';

const { Component, get, on, observer,computed,run,run: { scheduleOnce },$: { proxy }, copy} = Ember;

function formatDate(date) {
  return moment(date).format('YYYY/MM/DD H:mm');
}


export default  Component.extend({
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

  _changeHandler(event) {
    run(() => {
      let newValue = Ember.$(event.target).val(),
          oldValue = get(this, 'datetime'),
          newDatetime, newDatetimeFormat, oldDatetimeFormat;
      if (newValue) {
        newDatetime = new Date(newValue);
        newDatetimeFormat = formatDate(newDatetime);
      }
      if (oldValue) {
        oldDatetimeFormat = formatDate(oldValue);
      }

      if (newDatetimeFormat === oldDatetimeFormat) {
        return;
      }

      this.sendAction('action', newDatetime);
    });
  },

  _changeHandlerProxy: computed(function() {
    return proxy(this._changeHandler, this);
  }),

  setupPicker() {
    let options = get(this, 'options') || {};
    options = copy(options);
    let changeHandler = get(this, '_changeHandlerProxy');
    scheduleOnce('afterRender', () => { 
        this.$().datetimepicker(options).on('change', changeHandler);
      });
  },

  didInsertElement() {
    this._super(...arguments);
    this.setupPicker()
    this._updateValue();
  },

  didUpdateAttrs() {
    this._super(...arguments);
    this._updateValue(true);
    this.setupPicker()
  },

  willDestroyElement() {
    let changeHandler = get(this, '_changeHandlerProxy');
     this.$()
      .off('change', changeHandler)
      .datetimepicker('destroy');
  }

});

