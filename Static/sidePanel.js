L.Control.SidePanel = L.Control.extend({
    includes: L.Evented.prototype,

    options: {
        panelPosition: 'left',  // Only left is supported
        hasTabs: true,
        tabsPosition: 'top',    // Keep tabs at the top for simplicity
        darkMode: false,
        pushControls: false,
        startTab: 1
    },

    initialize: function (id, options) {
        this._panel = L.DomUtil.get(id);
        if (!this._panel) {
            console.error('Side panel element not found.');
        }

        L.setOptions(this, options);
    },

    addTo: function (map) {
        if (!this._panel) return;

        L.DomUtil.addClass(this._panel, 'sidepanel-' + this.options.panelPosition);

        if (this.options.darkMode) {
            L.DomUtil.addClass(this._panel, 'sidepanel-dark');
        }

        L.DomEvent.disableScrollPropagation(this._panel);
        L.DomEvent.disableClickPropagation(this._panel);

        if (this.options.hasTabs) {
            this.initTabs(map, this.options.tabsPosition);
        }
    },

    initTabs: function (map, tabsPosition) {
        if (!this._panel) return;

        if (typeof tabsPosition === 'string') {
            L.DomUtil.addClass(this._panel, 'tabs-' + tabsPosition);
        }

        let tabsLinks = this._panel.querySelectorAll('a.sidebar-tab-link');
        let tabsContents = this._panel.querySelectorAll('.sidepanel-tab-content');

        tabsLinks.forEach((tabLink, tabIndex) => {
            let startTab, startContent;

            if (typeof this.options.startTab === 'number' && (this.options.startTab - 1) === tabIndex) {
                startTab = tabLink;
                startContent = tabsContents[tabIndex];
            }

            if (typeof this.options.startTab === 'string' && this.options.startTab === tabLink.dataset.tabLink) {
                startTab = tabLink;
                startContent = this._panel.querySelector(`.sidepanel-tab-content[data-tab-content="${this.options.startTab}"]`);
            }

            if (startTab && !L.DomUtil.hasClass(startTab, 'active')) {
                L.DomUtil.addClass(startTab, 'active');
                L.DomUtil.addClass(startContent, 'active');
            }

            // Add image to tab
            let img = L.DomUtil.create('img', 'tab-image', tabLink);
            img.src = 'path/to/your/image.png';  // Path to your image
            img.alt = 'Tab Image';

            L.DomEvent.on(tabLink, 'click', (e) => {
                L.DomEvent.preventDefault(e);

                if (!L.DomUtil.hasClass(tabLink, 'active')) {
                    tabsLinks.forEach((linkActive) => {
                        if (L.DomUtil.hasClass(linkActive, 'active')) {
                            L.DomUtil.removeClass(linkActive, 'active');
                        }
                    });

                    L.DomUtil.addClass(tabLink, 'active');

                    tabsContents.forEach((element) => {
                        if (tabLink.dataset.tabLink === element.dataset.tabContent) {
                            L.DomUtil.addClass(element, 'active');
                        } else {
                            L.DomUtil.removeClass(element, 'active');
                        }
                    });
                }
            });
        });

        this._toggleButton(map);
    },

    _toggleButton: function (map) {
        if (!this._panel) return;

        const container = this._panel.querySelector('.sidepanel-toggle-container');
        if (!container) {
            console.error('Toggle container not found in the side panel.');
            return;
        }

        const button = container.querySelector('.sidepanel-toggle-button');
        if (!button) {
            console.error('Toggle button not found in the toggle container.');
            return;
        }

        L.DomEvent.on(button, 'click', (e) => {
            let IS_OPENED = true;
            let opened = L.DomUtil.hasClass(this._panel, 'opened');
            let closed = L.DomUtil.hasClass(this._panel, 'closed');

            if (!opened && !closed) {
                L.DomUtil.addClass(this._panel, 'opened');
            } else if (!opened && closed) {
                L.DomUtil.addClass(this._panel, 'opened');
                L.DomUtil.removeClass(this._panel, 'closed');
            } else if (opened && !closed) {
                IS_OPENED = false;
                L.DomUtil.removeClass(this._panel, 'opened');
                L.DomUtil.addClass(this._panel, 'closed');
            } else {
                L.DomUtil.addClass(this._panel, 'opened');
            }

            if (this.options.pushControls) {
                let controlsContainer = map.getContainer().querySelector('.leaflet-control-container');
                if (!controlsContainer) {
                    console.error('Leaflet control container not found.');
                    return;
                }

                L.DomUtil.addClass(controlsContainer, 'leaflet-anim-control-container');

                if (IS_OPENED) {
                    L.DomUtil.removeClass(controlsContainer, 'left-closed');
                    L.DomUtil.addClass(controlsContainer, 'left-opened');
                } else {
                    L.DomUtil.removeClass(controlsContainer, 'left-opened');
                    L.DomUtil.addClass(controlsContainer, 'left-closed');
                }
            }
        });
    },
});

L.control.sidepanel = function (id, options) {
    return new L.Control.SidePanel(id, options);
};
