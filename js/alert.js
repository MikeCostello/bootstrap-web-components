// Alert
XAlert = document.registerElement(prefix + '-alert', {
  prototype: Object.create(HTMLElement.prototype, {
    createdCallback: {
      value: function() {
        var template = importDoc.querySelector('#x-alert');
        this.insertBefore(template.content.cloneNode(true), this.firstChild);

        this.attributeChangedCallback('type', '', this.getAttribute('type'));
        this.attributeChangedCallback('close', '', this.getAttribute('close'));

        this.classList.add('alert');
      }
    },
    attributeChangedCallback: {
      value: function(name, oldValue, value) {
        if (name === 'type') {
          this.classList.add('alert-' + (value || 'danger'));
          if (oldValue) {
            this.classList.remove('alert-' + oldValue);
          } else if (oldValue === null) {
            this.classList.remove('alert-danger');
          }
        } else if (name === 'close') {
          var action = (value === 'false') ? 'add' : 'remove';
          this.querySelector('.close').classList[action]('hide');
        }
      }
    }
  })
});