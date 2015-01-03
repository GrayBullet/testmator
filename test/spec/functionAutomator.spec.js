(function () {
  'use strict';

  var automator = function (page) {
    return testmator.automator.functionAutomator(testmator.automator(page));
  };

  describe('functionAutomator', function () {
    var rootPage;

    beforeEach(function () {
      rootPage = window.createRootPage();
    });

    describe('Full test', function () {
      it('simple', function (done) {
        automator(rootPage)
          .clickLi('1')
          .test(function (root) {
            expect(root.getResult()).toEqual('li1');
          })
          .clickLi('2')
          .test(function (root) {
            expect(root.getResult()).toEqual('li2');
          })
          .done(done);
      });

      it('open and close with scope', function (done) {
        automator(rootPage)
          .clickOpenChild()
          .test(function (child) {
            expect(child.name).toEqual('child');
          })
          .scope(function (child) {
            return automator(child)
              .clickToParent()
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
