/**
 * @author Jonathan Terrell <jonathan.terrell@springbrook.es>
 * @copyright Copyright (c) 2019-2021 Springbrook S.L.
 * @license "Apache-2.0"
 */

class TabPanel {
    constructor(element, items) {
        this.element = element;
        this.items = items;

        if (Array.isArray(items)) {
            let itemCount = -1;
            const visuals = items.map((item) => {
                itemCount++;
                return {
                    index: itemCount,
                    label: item.label,
                    visualise: item.visualise
                };
            });
            replaceContent(element, buildTabbedTile(this, visuals));
            const visual = document.createElement('div');
            visual.id = 'visual';
            element.appendChild(visual);
            selectItem(this, visuals[0]);
        } else if (typeof items === 'object' && items !== null) {
            replaceContent(element, buildSimpleTile());
            showVisual(this, items);
        } else {
            replaceContent(element, buildEmptyTile());
            this.currentVisualiser = undefined;
        }
    }

    show() {
        return this;
    }
}

const defaultVisualHeight = 500;

const buildEmptyTile = () => {
    const element = document.createElement('div');
    element.style.cssText = `height: ${defaultVisualHeight}px`;
    return element;
};

const buildSimpleTile = () => {
    const element = document.createElement('div');
    element.id = 'visual';
    element.style.cssText = `height: ${defaultVisualHeight}px`;
    return element;
};

// const buildTabbedTile1 = (tile, visuals) => html` <div class="tabBar" style="display: flex">
//         ${visuals.map(
//             (visual) =>
//                 html` ${Object.assign(html`<div id="tabButton_${visual.index}" class="tabButton">${visual.label}</div>`, {
//                     onclick: (event) => selectItem(tile, visual)
//                 })}`
//         )}
//     </div>
//     <div id="visual"></div>`;

const buildTabbedTile = (tile, visuals) => {
    const tabsElement = document.createElement('div');
    tabsElement.className = 'tabBar';
    tabsElement.style.cssText = 'display: flex';
    for (const [index, visual] of visuals.entries()) {
        tabsElement.appendChild(buildTabButton(tile, index, visual));
    }
    return tabsElement;
};

const buildTabButton = (tile, visualIndex, visual) => {
    const tabButtonElement = document.createElement('div');
    tabButtonElement.className = 'tabButton';
    tabButtonElement.id = `tabButton_${visualIndex}`;
    tabButtonElement.onclick = () => selectItem(tile, visual);
    const labelTextNode = document.createTextNode(visual.label);
    tabButtonElement.appendChild(labelTextNode);
    return tabButtonElement;
};

const selectItem = (tile, visual) => {
    // Clear tab button selection.
    const tabButtons = tile.element.getElementsByClassName('tabButton');
    for (let i1 = 0; i1 < tabButtons.length; i1++) {
        tabButtons[i1].className = 'tabButton';
    }
    tile.element.querySelector(`#tabButton_${visual.index}`).className = 'tabButton selected';
    showVisual(tile, visual);
};

const showVisual = (tile, visual) => {
    const panelElement = tile.element.querySelector('#visual');
    removeContent(panelElement);
    if (visual.visualise) {
        tile.currentVisualiser = visual.visualise(panelElement);
        tile.currentVisualiser.show();
    } else {
        tile.currentVisualiser = undefined;
    }
};

const removeContent = (element) => {
    while (element.firstChild) element.firstChild.remove();
};

const replaceContent = (element, content) => {
    element.replaceChildren(content);
};

class TabPanelVisualiser {
    constructor(element, options) {
        this.element = element;
        this.options = options;
        this.visual = undefined;
    }

    show() {
        this.visual = new TabPanel(this.element, this.options).show();
        return this;
    }

    resize(items) {
        return this;
    }
}

// -------------------------------------------------------------------------------------------------------------------------------
// Exports
// -------------------------------------------------------------------------------------------------------------------------------

export default { TabPanelVisualiser };