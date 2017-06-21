var prefix = 'bs';
var importDoc = (document._currentScript || document.currentScript).ownerDocument;

// Create <style> elm with template CSS
var css = importDoc.querySelector('#x-css');
var style = document.createElement('style');

style.appendChild(css.content.cloneNode(true));
document.head.appendChild(style);



// Tooltip
XTooltip = document.registerElement(prefix + '-tooltip', {
  prototype: Object.create(HTMLElement.prototype, {
    plugin: {
      value: {
        namespace: 'bs.tooltip',
        name: 'tooltip'
      }
    },
    createdCallback: {
      value: function() {
        var attrFor = this.getAttribute('for');
        var id = attrFor ? '#' + attrFor : null;
        var $elm = $(id || this);
        var attrs = this.attributes;
        var defaults = $.fn[this.plugin.name].Constructor.DEFAULTS;
        var options = {};

        for (var i = 0; i < attrs.length; i++) {
          var name = attrs[i].name.toLowerCase();
          var value = attrs[i].value;

          if (name === 'for') {
            this.classList.add('hide');

            if (('content' in defaults) && !('content' in attrs)) {
              options.content = this.innerHTML;
            } else if (!('title' in attrs)) {
              options.title = this.innerHTML;
            }
          } else if (/^[delay]/i.test(name)) {
            var delays = name.split('-');

            if (delays.length === 1) {
              options.delay = {
                show: value,
                hide: value
              };
            } else {
              options.delay = options.delay || {};
              options.delay[delays[1]] = value;
            }
          } else if (name in defaults) {
            if (/true|false/i.test(value)) {
              value = (value === 'true');
            }

            options[name] = value;
          }
        }

        $elm[this.plugin.name](options);
      }
    },
    attributeChangedCallback: {
      value: function(name, oldValue, value) {
        var defaults = $.fn[this.plugin.name].Constructor.DEFAULTS;
        name = name.toLowerCase();

        if (name === 'for' || name in defaults) {
          var attrFor = this.getAttribute('for');
          var id = attrFor ? '#' + attrFor : null;
          var $elm = $(id || this);
          var bsInstance = $elm.data(this.plugin.namespace) || $('#' + oldValue).data(this.plugin.namespace);
          var option = {};

          if (/^delay/i.test(name)) {
            var delays = name.split('-');

            if (delays.length === 1) {
              option.delay = {
                show: value,
                hide: value
              };
            } else {
              option.delay = option.delay || {};
              option.delay[delays[1]] = value;
            }
          } else if (name === 'title') {
            if (value) {
              this.setAttribute('data-original-title', value);
              this.setAttribute('title', '');
            }
          } else if (name === 'for') {
            // Create new tooltip
            $elm[this.plugin.name](bsInstance.options);
            bsInstance.destroy();
          } else {
            if (/true|false/i.test(value)) {
              value = (value === 'true');
            }

            option[name] = value;
          }

          if (!$.isEmptyObject(option)) {
            $elm[this.plugin.name]($.extend(bsInstance.options, option));
          }
        }
      }
    }
  })
});


// Popover
XPopover = document.registerElement(prefix + '-popover', {
  prototype: Object.create(XTooltip.prototype, {
    plugin: {
      value: {
        namespace: 'bs.popover',
        name: 'popover'
      }
    }
  })
});


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


// Badge
XBadge = document.registerElement(prefix + '-badge', {
  prototype: Object.create(HTMLElement.prototype, {
    createdCallback: {
      value: function() {
        this.classList.add('badge');
      }
    }
  })
});


// Carousel
XCarousel = document.registerElement(prefix + '-carousel', {
  prototype: Object.create(HTMLElement.prototype, {
    plugin: {
      value: {
        namespace: 'bs.carousel',
        name: 'carousel'
      }
    },
    createdCallback: {
      value: function() {
        var i, j, attrTitle;

        var template = importDoc.querySelector('#x-carousel');
        var carousel = template.content.cloneNode(true);
        var carouselInner = carousel.querySelector('.carousel-inner');
        var carouselControls = carousel.querySelectorAll('.carousel-control');
        var carouselIndicators = carousel.querySelector('.carousel-indicators');

        // Carousel Items
        carouselInner.innerHTML = this.innerHTML;

        var firstItem = carouselInner.children[0];
        var items = carouselInner.querySelectorAll('.carousel-inner > ' + firstItem.tagName);
        var nodes = carouselInner.childNodes;

        var itemWrapper =document.createElement('div');
        var newCarouselInner = document.createDocumentFragment();

        function setCaption(text) {
          if (text) {
            var caption = itemWrapper.querySelector('.carousel-caption');

            if (!caption) {
              caption = document.createElement('div');
              caption.classList.add('carousel-caption');
              caption.textContent =  text;

              itemWrapper.appendChild(caption);
            }
          }
        }

        for (i = 0, j = 0; i < nodes.length; i++) {
          var node = nodes[i];
          var item = items[j];

          // Item Wrapper
          if (node === item) {
            // Add proir
            if (itemWrapper.hasChildNodes()) {
              setCaption(attrTitle);
              newCarouselInner.appendChild(itemWrapper);

              itemWrapper = document.createElement('div');
            } else if (j === 0) {
              itemWrapper.classList.add('active');
            }

            attrTitle = item.getAttribute('title');

            itemWrapper.classList.add('item');
            itemWrapper.appendChild(item.cloneNode(true));

            // Indicator
            var indicator = document.createElement('li');
            indicator.setAttribute('data-slide-to', j);

            if (j === 0) {
              indicator.setAttribute('class', 'active');
            }

            carouselIndicators.appendChild(indicator);

            j++;
          } else if (j > 0) {
            // Captions
            if (node.nodeType === 1 || (node.nodeType === 3 && node.nodeValue.trim().length)) {
              var caption = itemWrapper.querySelector('.carousel-caption');

              if (!caption) {
                caption = document.createElement('div');
                caption.classList.add('carousel-caption');
                caption = itemWrapper.appendChild(caption);
              }

              caption.appendChild(node.cloneNode(true));
            }
          }

          // Last Item
          if (i === nodes.length - 1) {
            if (itemWrapper.hasChildNodes()) {
              setCaption(attrTitle);
              newCarouselInner.appendChild(itemWrapper);
            }
          }
        }

        carouselInner.innerHTML = '';
        carouselInner.appendChild(newCarouselInner);

        // Next & Previous
        function carouselControlCallback(event) {
          var target = event.currentTarget;
          var attrSlide = target.getAttribute('data-slide');

          if (attrSlide) {
            $(this).carousel(attrSlide);
          }

          event.preventDefault();
        }

        for (i = 0; i < carouselControls.length; i++) {
          carouselControls[i].addEventListener('click', carouselControlCallback.bind(this));
        }

        // Indicators
        this.addEventListener('click', function(event) {
          var target = event.target || event.srcElement;
          var attrSlideTo = target.getAttribute('data-slide-to');

          if (target.tagName.toLowerCase() === 'li' &&  attrSlideTo) {
            $(this).carousel(+attrSlideTo);
          }

          event.stopPropagation();
        });

        // Init
        ['carousel', 'slide'].forEach(function(className) {
          this.classList.add(className);
        }, this);

        var attrs = this.attributes;
        var defaults = $.fn[this.plugin.name].Constructor.DEFAULTS;
        var options = {};

        for (i = 0; i < attrs.length; i++) {
          var name = attrs[i].name.toLowerCase();
          var value = attrs[i].value;

          if (name in defaults) {
            if (/true|false/i.test(value)) {
              value = (value === 'true');
            }

            options[name] = value;
          }
        }

        this.innerHTML = '';
        this.appendChild(carousel);
        $(this).carousel(options);
      }
    },
    attributeChangedCallback: {
      value: function(name, oldValue, value) {
        var defaults = $.fn[this.plugin.name].Constructor.DEFAULTS;
        name = name.toLowerCase();

        if (name in defaults) {
          if (/true|false/i.test(value)) {
            value = (value === 'true');
          }

          var option = {};
          option[name] = value;

          $elm = $(this);
          $elm[this.plugin.name]($.extend($elm.data(this.plugin.namespace).options, option));
        }
      }
    }
  })
});


// Label
XLabel = document.registerElement(prefix + '-label', {
  prototype: Object.create(HTMLElement.prototype, {
    createdCallback: {
      value: function() {
        this.attributeChangedCallback('type', '', this.getAttribute('type'));
        this.classList.add('label');
      }
    },
    attributeChangedCallback: {
      value: function(name, oldValue, value) {
        if (name === 'type') {
          this.classList.add('label-' + (value || 'default'));
          if (oldValue) {
            this.classList.remove('label-' + oldValue);

          } else if (oldValue === null) {
            this.classList.remove('label-default');
          }
        }
      }
    }
  })
});


// List Group
XListGroup = document.registerElement(prefix + '-list-group', {
  prototype: Object.create(HTMLElement.prototype, {
    createdCallback: {
      value: function() {
        this.classList.add('list-group');

        this.decorateItems(this.children);

        // Observe child mutations
        var observer = new MutationObserver(function(mutations) {
          var listItems = [];

          mutations.forEach(function(mutation) {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
              var addedNode = mutation.addedNodes[i];
              // Filter on ELEMENT_NODEs only
              if (addedNode.nodeType === 1) {
                listItems.push(addedNode);
              }
            }
          });

          this.decorateItems(listItems);
        }.bind(this));

        observer.observe(this, { childList: true });
      }
    },
    decorateItems: {
      value: function(listItems) {
        for (var i = 0; i < listItems.length; i++) {
          var item = listItems[i];
          item.classList.add('list-group-item');

          var attrActive = item.getAttribute('active');
          if (attrActive !== null) {
            var action = (attrActive === 'false') ? 'remove' : 'add';
            item.classList[action]('active');
          }

          var children = item.children;
          for (var j = 0; j < children.length; j++) {
            var child = children[j];

            if (/^h[1-6]$/i.test(child.tagName)) {
              child.classList.add('list-group-item-heading');
            } else if (/^p$/i.test(child.tagName)) {
              child.classList.add('list-group-item-text');
            }
          }
        }
      }
    }
  })
});


// Modal
XModal = document.registerElement(prefix + '-modal', {
  prototype: Object.create(HTMLElement.prototype, {
    createdCallback: {
      value: function() {
        // jQuery creates an extra looking for CSS display value
        if (!this.parentNode) {
          return false;
        }

        var template = importDoc.querySelector('#x-modal');
        var modal = template.content.cloneNode(true);
        var elmHeader = modal.querySelector('.modal-header');
        var attrs = this.attributes;
        var options = {};

        this.classList.add('modal');
        this.setAttribute('role', 'modal');

        for (var i = 0; i < attrs.length; i++) {
          var name = attrs[i].name.toLowerCase();
          var value = attrs[i].value;

          if (name === 'title') {
            var elmTitle = modal.querySelector('.modal-title');
            elmTitle.textContent = value;
            elmHeader.classList.remove('x-modal-no-title');

          } else if (name === 'close' && value === 'false') {
            elmHeader.querySelector('.close').classList.add('hide');

          } else if (/backdrop|keyboard|show/i.test(name)) {
            if (/true|false/i.test(value)) {
              value = (value === 'true');
            }

            options[name] = value;
          }
        }

        // Content
        modal.querySelector('.modal-body').innerHTML = this.innerHTML;
        this.innerHTML = '';

        this.appendChild(modal);
        $(this).modal(options);
      }
    },
    attributeChangedCallback: {
      value: function(name, oldValue, value) {
        var $elm = $(this);
        var bsModal = $elm.data('bs.modal');
        var option= {};
        var action;

        if (name === 'title') {
          this.querySelector('.modal-title').textContent = value;

          action = (value === null) ? 'add' : 'remove';
          this.querySelector('.modal-header').classList[action]('x-modal-no-title');

        } else if (name === 'close') {
          action = (value === 'false') ? 'add' : 'remove';
          this.querySelector('.close').classList[action]('hide');

        } else if (/backdrop|keyboard|show/i.test(name)) {
          if (/true|false/i.test(value)) {
            value = (value === 'true');
          }

          option[name] = value;
          $elm.modal($.extend(bsModal.options, option));
        }
      }
    }
  })
});


// Progress Bar
XProgress = document.registerElement(prefix + '-progress', {
  prototype: Object.create(HTMLElement.prototype, {
    createdCallback: {
      value: function() {
        var template = importDoc.querySelector('#x-progress');
        this.appendChild(template.content.cloneNode(true));

        var attrs = this.attributes;
        for (var i = 0; i < attrs.length; i++) {
          this.attributeChangedCallback(attrs[i].name.toLowerCase(), null, attrs[i].value);
        }

        this.classList.add('progress');
      }
    },
    attributeChangedCallback: {
      value: function(name, oldValue, value) {
        var action;
        var elmProgressbar = this.querySelector('[role=progressbar]');

        if (name === 'value') {
          elmProgressbar.setAttribute('aria-valuenow', value);
          elmProgressbar.style.width = value + '%';

        } else if (name === 'type') {
          elmProgressbar.classList.add('progress-bar-' + value);
          if (oldValue) {
            elmProgressbar.classList.remove('progress-bar-' + oldValue);
          }
        } else if (name === 'striped') {
          action = (value === 'false' || value === null) ? 'remove' : 'add';
          this.classList[action]('progress-striped');

        } else if (/animated|active/i.test(name)) {
          action = (value === 'false' || value === null) ? 'remove' : 'add';
          this.classList[action]('active');
        }
      }
    }
  })
});