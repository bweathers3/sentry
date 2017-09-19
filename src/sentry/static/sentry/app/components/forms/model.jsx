import {types, applySnapshot, getSnapshot} from 'mobx-state-tree';
import _ from 'lodash';

import FormState from './state';

const FormModel = types
  .model('FormStore', {
    // initialData: types.optional(
    // types.map(types.union(types.string, types.number, types.boolean, types.Date)),
    // {}
    // ),
    fields: types.optional(
      types.map(
        types.union(types.null, types.string, types.number, types.boolean, types.Date)
      ),
      {}
    ),
    errors: types.optional(types.map(types.union(types.boolean, types.string)), {}),
    required: types.optional(types.map(types.boolean), {}),
    fieldState: types.optional(types.map(types.string), {}),
    formState: types.optional(types.string, '')
  })
  .views(self => ({
    get formChanged() {
      return !_.isEqual(self.initialData.toJSON(), self.fields.toJSON(), true);
    },

    get formData() {
      return self.fields;
    },

    get isSaving() {
      return self.formState === FormState.SAVING;
    },

    get isError() {
      return !!self.errors.values().find(val => !!val);
    },

    getFieldState(id) {
      return self.fieldState.has(id) && self.fieldState.get(id);
    },

    getValue(id) {
      if (!self.fields.has(id)) {
        return '';
      }

      return self.fields.get(id);
    },

    getError(id) {
      return self.errors.has(id) && self.errors.get(id);
    }
  }))
  .actions(self => ({
    afterCreate() {
      self.initialData = self.fields.toJSON();
      self.snapshots = [getSnapshot(self.fields)];
    },

    setValue(id, value) {
      self.fields.set(id, value);

      // specifically check for empty string, 0 should be allowed
      if (!self.isValidRequiredField(id)) {
        self.setError(id, 'Field is required');
      } else {
        self.setError(id, false);
      }
    },

    addField(id, {required}) {
      // if (!self.fields.has(id)) {
      // self.fields.set(id, '');
      // }
      self.required.set(id, required);
    },

    undo() {
      // Always have initial data snapshot
      if (self.snapshots.length < 2) return;

      self.snapshots.shift();
      applySnapshot(self.fields, self.snapshots[0]);
    },

    saveField(id, currentValue) {
      // Don't save if field hasn't changed
      if (
        currentValue === self.initialData[id] ||
        (currentValue === '' && typeof self.initialData[id] === 'undefined')
      )
        return;

      let snapshot = getSnapshot(self.fields);
      let newValue = self.getValue(id);

      // Save field + value
      self.setFieldState(id, FormState.SAVING);

      // Pretend async req
      setTimeout(() => {
        self.setFieldState(id, FormState.READY);
        self.initialData[id] = newValue;
        self.snapshots.unshift(snapshot);
      }, 2000);
    },

    setFieldState(id, value) {
      self.fieldState.set(id, value);
    },

    setError(id, error) {
      if (!!error) {
        self.formState = FormState.ERROR;
      } else {
        self.formState = FormState.READY;
      }

      self.errors.set(id, error);
    },

    setRequired(id, required) {
      self.required.set(id, required);
    },

    getData() {
      return self.fields;
    },

    // Returns true if not required or is required and is not empty
    isValidRequiredField(id) {
      return !self.required.has(id) || !self.required.get(id) || self.getValue(id) !== '';
    },

    // TODO: More validations
    validate() {},

    submitSuccess(data) {
      // update initial data
      self.formState = FormState.READY;
      self.initialData = data;
    },

    submitError(err) {
      self.formState = FormState.ERROR;
      self.formErrors = err.responseJSON;
    }
  }));

export default FormModel;
