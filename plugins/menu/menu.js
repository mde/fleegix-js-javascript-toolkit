/*
 * Copyright 2009 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/
if (typeof fleegix == 'undefined') {
  throw new Error('This plugin cannot be used standalone.');
}
if (typeof fleegix.dom == 'undefined') {
  throw new Error('This plugin depends on the fleegix.dom module.');
}
if (typeof fleegix.event == 'undefined') {
  throw new Error('This plugin depends on the fleegix.event module.');
}
if (typeof fleegix.css == 'undefined') {
  throw new Error('This plugin depends on the fleegix.css module.');
}
if (typeof fleegix.string == 'undefined') {
  throw new Error('This plugin depends on the fleegix.string  module.');
}
fleegix.menu = new function () {
  // Config -- used in width calculations
  var HORIZ_MARGIN_WIDTH = 4;
  var BORDER_WIDTH = 1;
  var EXPANDO_ARROW_WIDTH = 16;
  var MENU_OVERLAP = 2;

  this.displayedMenu = null;

  // Private props
  this._currX = 0;
  this._currY = 0;
  this._currLevel = 0;
  this._expandedItemForEachLevel = [];
  this._xPosMarksForEachLevel = [];
  this._yPosMarksForEachLevel = [];
  this._baseNode = null;
  this._scratchNode = null;

  this.createScratchNode = function () {
    var div = document.createElement('div');
    div.id = 'fleegixHierarchicalMenuScratchNode';
    div.style.position = 'absolute';
    div.style.top = '-1000px';
    div.style.left = '-1000px';
    document.body.appendChild(div);
    this._scratchNode = div;
  };
  this.showFixedMenu = function (e, menu, node, xPos, yPos) {
    var items = menu.items;
    this._baseNode = node;
    if (!items || !items.length) {
      throw new Error('Contextual menu "' + menu.id +'" has no menu items.');
    }
    this.hideHierarchicalMenu();
    this.displayedMenu = menu;
    if (menu.doBeforeShowing && typeof menu.doBeforeShowing == 'function') {
      menu.doBeforeShowing();
    }
    this._showHierMenuLevel(0, menu, xPos, yPos);
    menu.displayed = true;
    document.body.onselectstart = function () { return false; };
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    else {
      e.cancelBubble = true;
    }
    if (e.preventDefault) {
      e.preventDefault();
    }
    else {
      e.returnValue = false;
    }
    return false;
  };
  this.showContextMenu = function (e, menu) {
    this.showFixedMenu(e, menu, document.body, e.clientX, e.clientY);
  };
  this.hideHierarchicalMenu = function (e) {
    this._hideSubMenus(-1);
    if (this.displayedMenu) {
      if (typeof this.displayedMenu.doAfterHiding == 'function') {
        this.displayedMenu.doAfterHiding();
      }
      this.displayedMenu.displayed = false;
      this.displayedMenu = null;
    }
    document.body.onselectstart = null;
  };

  // Public DOM-event handlers
  this.handleMouseOver = function (e) {
    var targ = e.target;
    while (!targ.id) { targ = targ.parentNode; }
    if (targ.id == 'body') { return false; }
    if (targ && targ.className.indexOf('hierMenuItem') > -1) {
      var currMenuNode = this._getMenuNodeForMenuItemNode(targ);
      var currLevel = this._getHierarchyLevelForMenuNode(currMenuNode);
      var nextLevel = currLevel + 1;
      var key = targ.id.replace('hierMenuItem_', '');
      var index = key.substr(key.length - 1); // Negative pos param breaks in IE
      var menuItem = this.displayedMenu.getMenuItem(key);
      var currSub = $('hierMenuLevel_' + nextLevel);
      fleegix.css.addClass(targ, 'selectedItem');
      if (currSub) {
        var subKey = currSub.firstChild.firstChild.id.replace('hierMenuItem_', '');
        if (subKey.substr(0, subKey.length - 1) == key) {
          return false;
        }
        var expandedItem = this._expandedItemForEachLevel[currLevel];
        var expandedNode = this._getMenuItemNodeForMenuItem(expandedItem);
        fleegix.css.removeClass(expandedNode, 'selectedItem');
        this._hideSubMenus(currLevel);
      }
      else if (menuItem.items && menuItem.items.length) {
        this._expandedItemForEachLevel[currLevel] = menuItem;
        this._xPosMarksForEachLevel[currLevel] = this._currX;
        this._yPosMarksForEachLevel[currLevel] = this._currY;
        var newX = this._currX + currMenuNode.offsetWidth;
        var newY = this._currY + (index*24);
        this._showHierMenuLevel(nextLevel, menuItem, newX, newY);
      }
    }
  };
  this.handleMouseOut = function (e) {
    var targ = e.target;
    while (!targ.id) { targ = targ.parentNode; }
    if (targ.id == 'body') { return false; }
    if (targ && targ.className.indexOf('hierMenuItem') > -1) {
      var currMenuNode = this._getMenuNodeForMenuItemNode(targ);
      var currLevel = this._getHierarchyLevelForMenuNode(currMenuNode);
      var menuItem = this._getMenuItemForMenuItemNode(targ);
      if (this._expandedItemForEachLevel[currLevel] == menuItem) {
        return false;
      }
      fleegix.css.removeClass(targ, 'selectedItem');
    }
  };
  this.handleClick = function (e) {
    var targ = e.target;
    while (!targ.id) { targ = targ.parentNode; }
    if (targ.id == 'body') { return false; }
    if (targ && targ.className.indexOf('hierMenuItem') > -1) {
      var menuItem = this._getMenuItemForMenuItemNode(targ);
      if (typeof menuItem.handleClick == 'function') {
        setTimeout(menuItem.handleClick, 0);
      }
      else {
        e.stopPropagation();
        return false;
      }
    }
    this.hideHierarchicalMenu();
  };

  // Private methods
  this._showHierMenuLevel = function (level, menuItem, x, y) {
    var table = _createElem('table');
    var tbody = _createElem('tbody');
    var tr = null;
    var td = null;
    var div = null;

    table.cellPadding = 0;
    table.cellSpacing = 0;
    table.className = 'hierMenu';
    table.id = 'hierMenuLevel_' + level;

    var items = menuItem.items;
    this._currLevel = level;
    // User-configuratble min/max
    var min = this.displayedMenu.minWidth;
    var max = this.displayedMenu.maxWidth;
    // The natural width the menu would be based on the
    // text of the items inside -- add 4px x 2 for the
    // margin, and 2 px for the borders so we can be
    // talking about the width of the containing box
    var nat = menuItem.naturalWidth + (HORIZ_MARGIN_WIDTH * 2) +
      (BORDER_WIDTH * 2);

    // Width-calc fu
    var menuLevelWidth = 0;
    // Min width set -- use the min if wider than
    // the natural width
    if (min) {
      menuLevelWidth = min > nat ? min : nat;
    }
    // Otherwise just use the natural width
    else {
      menuLevelWidth = nat;
    }
    if (max) {
      menuLevelWidth = menuLevelWidth > max ? max : menuLevelWidth;
    }
    if (menuItem.subItemHasSubItems) {
      menuLevelWidth += EXPANDO_ARROW_WIDTH;
    }
    // Menu would extend outside the browser window
    // X position overlap -- go into reverso mode
    if ((x + menuLevelWidth) > fleegix.dom.getViewportWidth()) {
      x -= menuLevelWidth;
      if (level > 0) {
        var parentWidth =
          $('hierMenuLevel_' + (level - 1)).offsetWidth;
        x -= parentWidth;
      }
      // A bit of backward overlap
      x += MENU_OVERLAP;
    }
    else {
      // A bit of overlap
      x -= MENU_OVERLAP;
    }
    // Y position overlap -- compensate by the
    // amount of the overlap
    var yOver = (y + (items.length * 24)) - fleegix.dom.getViewportHeight();
    if (yOver > 0) {
      y -= (yOver + (BORDER_WIDTH * 2));
    }

    // Record the current XY to use for calc'ing
    // the next sub-menu
    this._currX = x;
    this._currY = y;

    var titleColumnWidth = menuItem.subItemHasSubItems ?
      menuLevelWidth - EXPANDO_ARROW_WIDTH : menuLevelWidth;

    table.style.width = menuLevelWidth + 'px';
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      tr = _createElem('tr');
      td = _createElem('td');
      div = _createElem('div');
      tr.id = 'hierMenuItem_' + item.hierarchyKey;
      tr.className = 'hierMenuItem';
      td.className = 'hierMenuText';
      div.className = 'hierMenuTextClipper';
      td.style.width = titleColumnWidth + 'px';
      div.style.width = (titleColumnWidth -
        (HORIZ_MARGIN_WIDTH * 2)) + 'px';
      if (document.all) {
        var nobr = _createElem('nobr');
        nobr.innerHTML = item.display;
        div.appendChild(nobr);
      }
      else {
        div.innerHTML = item.display;
      }
      td.appendChild(div);
      tr.appendChild(td);
      td = _createElem('td');
      if (menuItem.subItemHasSubItems) {
        td.style.textAlign = 'center';
        td.style.width = EXPANDO_ARROW_WIDTH + 'px';
        if (item.items) {
          td.innerHTML = '&gt;';
        }
      }
      else {
        td.style.width = '1px';
      }
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
    tbody.appendChild(tr);
    table.appendChild(tbody);

    table.style.left = x + 'px';
    table.style.top = y + 'px';
    this._baseNode.appendChild(table);

    fleegix.event.listen(table, 'onmouseover', this, 'handleMouseOver');
    fleegix.event.listen(table, 'onmouseout', this, 'handleMouseOut');
    fleegix.event.listen(table, 'onclick', this, 'handleClick');
  };
  this._hideSubMenus = function (level) {
    if (!this._baseNode) { return false; }
    this._currX = this._xPosMarksForEachLevel[level];
    this._currY = this._yPosMarksForEachLevel[level];
    var nextLevel = level + 1;
    var max = this._currLevel + 1;
    for (var n = nextLevel; n < max; n++) {
      var removeMenu = $('hierMenuLevel_' + n);
      delete this._expandedItemForEachLevel[n];
      if (removeMenu) {
        fleegix.event.unlisten(removeMenu, 'onmouseover',
          this, 'handleMouseOver');
        fleegix.event.unlisten(removeMenu, 'onclick',
          this, 'handleClick');
        this._baseNode.removeChild(removeMenu);
      }
    }
  };
  this._getHierarchyLevelForMenuNode = function (node) {
    return parseInt(node.id.replace('hierMenuLevel_', ''));
  };
  this._getMenuNodeForMenuItemNode = function (node) {
    return node.parentNode.parentNode;
  };
  this._getMenuItemForMenuItemNode = function (node) {
    var key = node.id.replace('hierMenuItem_', '');
    return this.displayedMenu.getMenuItem(key);
  };
  this._getMenuItemNodeForMenuItem = function (item) {
    return $('hierMenuItem_' + item.hierarchyKey);
  };
};

fleegix.menu.HierarchicalMenuItem = function (p) {
  var params = p || {};
  this.display = params.display || '';
  this.handleClick = params.handleClick || null;
  this.items = params.items || null;
  this.naturalWidth = null;
  this.subItemHasSubItems = false;
  this.hierarchyKey = '';
};

fleegix.menu.HierarchicalMenu = function (id, items, o) {
  this.id = id;
  this.items = items || null;
  this.naturalWidth = null;
  this.subItemHasSubItems = false;
  this.map;
  this.displayed = false;

  // User-customizable props
  var opts = o || {};
  // An action to perform whenever the menu is dismissed
  // Useful, for example, for releasing control of a
  // rollover highlight that's pinned to a contextual
  // menu's pseudo-selected item
  this.doAfterHiding = opts.doAfterHiding || null;
  // Do this before showing the menu -- useful for
  // refreshing the data for dynamic menus
  this.doBeforeShowing = opts.doBeforeShowing || null;
  // Force each menu section to a minimum width -- useful
  // if the titles for a set of menu items is too short
  // to provide a reasonable click surface. Can be used
  // in combination with maxWidth
  this.minWidth = opts.minWidth || null;
  // Constrain each menu section to this max width --
  // useful if you may have items that are ridiculously
  // long. Can be used in conbination with minWidth
  this.maxWidth = opts.maxWidth || null;

  this.updateDisplayData();
};

// The top-level menu object is a special case of
// the single menu item -- it is the "item" that
// contains the sub-items shown in (the top) level 0
// of the menu hierarchy
fleegix.menu.HierarchicalMenu.prototype =
  new fleegix.menu.HierarchicalMenuItem();

fleegix.menu.HierarchicalMenu.prototype.updateDisplayData =
  function () {
  this.updateMap();
  this.setNaturalWidths();
};

// Creates a map of the entire menu structure --
// map keys are used as the id suffixes
// in the DOM hierarchy of the menus, and lookup
// happens when responding to clicks
// '00' -> Some Item
// '000' -> Some Sub-Item
// '0000' -> Another Level Down
// '0001' -> Another Level Down 2
// '001' -> Some Other Sub-Item
// '01' -> Another Item
fleegix.menu.HierarchicalMenu.prototype.updateMap =
  function () {
  var items = this.items;
  var map = {};
  var mapHier = function (hierKey, hierItems) {
    for (var i = 0; i < hierItems.length; i++) {
      var item = hierItems[i];
      var itemKey = hierKey + i.toString();
      if (item.items) {
        mapHier(itemKey, item.items);
      }
      item.hierarchyKey = itemKey;
      map[itemKey] = item;
    }
  };
  mapHier('0', items);
  this.map = map;
};
// This is an ugly hack to measure out actual widths
// per item-title -- the max width for the set of items
// at a level determines the width of the menu
// min-width is broken in FF for anything more complicated
// than a simple div, and works not at all in IE6.
// The other alternative would be hard-coding menu width
// and wrapping menu items, which makes the Baby Jesus cry
fleegix.menu.HierarchicalMenu.prototype.setNaturalWidths =
  function () {
  var d = _createElem('div');
  d.style.position = 'absolute';
  // IE6 defaults to 100% unless you give it a width
  // FF & IE7 default to 'the minimum,' which is what we want
  if (navigator.appVersion.indexOf('MSIE 6') > -1) {
    d.style.width = '1%';
  }
  d.style.whiteSpace = 'nowrap';
  d.style.left = '-9999999px';
  d.style.top = '-9999999px';
  fleegix.menu._scratchNode.appendChild(d);
  var setWidths = function (widthItem) {
    var items = widthItem.items;
    if (items) {
      var max = 0;
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        d.innerHTML = item.display;
        max = d.offsetWidth > max ? d.offsetWidth : max;
        setWidths(item);
        if (item.items) {
          widthItem.subItemHasSubItems = true;
        }
      }
      widthItem.naturalWidth = max;
    }
    else {
      widthItem.naturalWidth = null;
    }
  };
  setWidths(this);
};
fleegix.menu.HierarchicalMenu.prototype.getMenuItem =
  function (key) {
  return this.map[key];
};

// Set up the scratch node for measuring widths
fleegix.event.listen(window, 'onload',
  fleegix.menu, 'createScratchNode');
// Close menus via any click on the doc body
fleegix.event.listen(document, 'onclick',
  fleegix.menu, 'hideHierarchicalMenu');

