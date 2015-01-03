(function () {
  'use strict';

  var PageObject = testmator.PageObject;
  var automator = function (page) {
    return testmator.automator.namedAutomator(testmator.automator(page));
  };

  describe('namedAutomator', function () {
    var ChildPage;
    var rootPage;

    beforeEach(function () {
      var childEl = $('<div>')
            .append($('<button id="toParent">'));
      ChildPage = PageObject.extend({
        name: 'child',
        clickToParent: function () {
          this.click('#toParent');
          return this.switchParent();
        }
      });

      var rootEl = $('<div>')
            .append($('<button id="button1">'))
            .append($('<ul><li id="li1"><li id="li2"></ul>'))
            .append($('<span id="result">'))
            .on('click', 'li', function () {
              rootEl.find('#result').text(this.id);
            });
      var RootPage = PageObject.extend({
        name: 'root',
        clickButton1: function () {
          this.click('#button1');
          return new ChildPage({el: childEl, parent: this});
        },
        clickLi: function (label) {
          this.click('#li' + label);
        },
        getResult: function () {
          return this.$('#result').text();
        }
      });
      rootPage = new RootPage({el: rootEl});
    });

    describe('Full test', function () {
      it('Call with arguments', function (done) {
        automator(rootPage)
          .test(function (root) {
            expect(root.name).toEqual('root');
          })
          .action('clickLi', '1')
          .test(function (root) {
            expect(root.getResult()).toEqual('li1');
            expect(root.name).toEqual('root');
          })
          .action('clickLi', '2')
          .test(function (root) {
            expect(root.getResult()).toEqual('li2');
          })
          .done(done);
      });

      it('open and close', function (done) {
        automator(rootPage)
          .action('clickButton1')
          .test(function (child) {
            expect(child.name).toEqual('child');
          })
          .action('clickToParent')
          .test(function (root) {
            expect(root.name).toEqual('root');
          })
          .done(done);
      });

      it('open and close with scope', function (done) {
        automator(rootPage)
          .action('clickButton1')
          .test(function (child) {
            expect(child.name).toEqual('child');
          })
          .scope(function (child) {
            return automator(child)
              .action('clickToParent')
              .test(function (root) {
                expect(root.name).toEqual('root');
              });
          })
          .test(function (root) {
            expect(root.name).toEqual('root');
          })
          .done(done);
      });
    });
  });
})();
