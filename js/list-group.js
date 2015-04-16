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