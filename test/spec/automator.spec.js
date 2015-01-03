(function () {
  'use strict';

  var automator = testmator.automator;

  describe('automator', function () {
    var rootPage;

    beforeEach(function () {
      rootPage = window.createRootPage();
    });

    describe('Full test', function (done) {
      it('simple', function () {
        automator(rootPage)
          .test(function (root) {
            expect(root.name).toEqual('root');
          })
          .action(function (root) {
            return root.clickLi('1');
          })
          .test(function (root) {
            expect(root.name).toEqual('root');
          })
          .done(done);
      });

      it('open and close', function (done) {
        automator(rootPage)
          .action(function (root) {
            return root.clickOpenChild();
          })
          .test(function (child) {
            expect(child.name).toEqual('child');
          })
          .action(function (child) {
            return child.clickToParent();
          })
          .test(function (root) {
            expect(root.name).toEqual('root');
          })
          .done(done);
      });

      it('open and close with $.Deferred()', function (done) {
        automator(rootPage)
          .action(function (root) {
            return $.Deferred().resolve(root.clickOpenChild()).promise();
          })
          .test(function (child) {
            expect(child.name).toEqual('child');
          })
          .action(function (child) {
            return $.Deferred().resolve(child.clickToParent()).promise();
          })
          .test(function (root) {
            expect(root.name).toEqual('root');
          })
          .done(done);
      });

      it('open and close with scope', function (done) {
        automator(rootPage)
          .action(function (root) {
            return root.clickOpenChild();
          })
          .test(function (child) {
            expect(child.name).toEqual('child');
          })
          .scope(function (child) {
            return automator(child)
              .action(function (child) {
                return child.clickToParent();
              })
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
