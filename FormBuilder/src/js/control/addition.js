import control from '../control';

export default class controlText extends control {
  
  static get definition() {
    return {

      // mi18n custom mappings (defaults to camelCase type)
      mi18n: {
        date: 'dateField',
        file: 'fileUpload'
      }
    };
  }
   /**
   * build a text DOM element, supporting other jquery text form-control's
   * @return {Object} DOM Element to be injected into the form.
   */
  build() {
    return this.markup('input', null, this.config);
  }
}
control.register('number');
