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