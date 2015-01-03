window.createRootPage = function () {
  'use strict';

  var PageObject = testmator.PageObject;

  var $root = $('<div>')
        .append($('<button id="openChild">'))
        .append($('<ul><li id="li1"><li id="li2"></ul>'))
        .append($('<span id="result">'))
        .on('click', 'li', function () {
          $root.find('#result').text(this.id);
        });

  var $child = $('<div>')
        .append($('<button id="toParent">'));


  var ChildPage = PageObject.extend({
    name: 'child',
    clickToParent: function () {
      this.click('#toParent');
      return this.switchParent();
    }
  });

  var RootPage = PageObject.extend({
    name: 'root',
    clickOpenChild: function () {
      this.click('#button1');
      return new ChildPage({el: $child, parent: this});
    },
    clickButton1: function () {
      console.log('WARNING');
      return this.clickOpenChild();
    },
    clickLi: function (label) {
      this.click('#li' + label);
    },
    getResult: function () {
      return this.$('#result').text();
    }
  });

  return new RootPage({el: $root});
};
