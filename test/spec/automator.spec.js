(function () {
  'use strict';

  var PageObject = testmator.PageObject;
  var automator = testmator.automator;

  describe('automator', function () {
    var ChildPage;
    var rootPage;

    beforeEach(function () {
      var childEl = $('<div>')
            .append($('<button id="toParent">'));
      ChildPage = PageObject.extend({
        clickToParent: function () {
          this.click('#toParent');
          return this.switchParent();
        }
      });

      var rootEl = $('<div>')
            .append($('<button id="button1">'))
            .append($('<ul><li id="li1"></ul>'));
      var RootPage = PageObject.extend({
        clickButton1: function () {
          this.click('#button1');
          return new ChildPage({el: childEl, parent: this});
        },
        clickLi1: function () {
          this.click('#li1');
        }
      });
      rootPage = new RootPage({el: rootEl});
    });

    describe('Full test', function (done) {
      it('simple', function () {
        automator(rootPage)
          .test(function (root) {
            expect(root).toEqual(rootPage);
          })
          .action(function (root) {
            return root.clickLi1();
          })
          .test(function (root) {
            expect(root).toEqual(rootPage);
          })
          .done(done);
      });
    });
  });
})();
