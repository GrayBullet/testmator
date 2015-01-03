(function () {
  'use strict';

  var automator = function (page) {
    return testmator.automator.namedAutomator(testmator.automator(page));
  };

  describe('namedAutomator', function () {
    var rootPage;

    beforeEach(function () {
      rootPage = window.createRootPage();
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
          .action('clickOpenChild')
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
          .action('clickOpenChild')
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
