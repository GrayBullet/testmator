(function () {
  'use strict';

  var automator = function (page) {
    return testmator.automator.waitAutomator(testmator.automator(page));
  };

  describe('waitAutomator', function () {
    var rootPage;

    beforeEach(function () {
      rootPage = window.createRootModalPage();
    });

    it('wait show and hide dialog', function (done) {
      automator(rootPage)
        .action(function (root) {
          return root.clickOpenModal();
        })
        .test(function (modal) {
          expect(modal.getContent()).toEqual('shown');
        })
        .action(function (modal) {
          return modal.clickClose();
        })
        .test(function (root) {
          expect(root.switchModal().getContent()).toEqual('hidden');
        })
        .done(function () {
          setTimeout(done, 1000);
        });
    });

    it('wait show and hide dialog', function (done) {
      automator(rootPage)
        .action(function (root) {
          return root.clickOpenModal();
        })
        .scope(function (modal) {
          return automator(modal)
            .test(function (modal) {
              expect(modal.getContent()).toEqual('shown');
            })
            .action(function (modal) {
              return modal.clickClose();
            });
        })
        .test(function (root) {
          expect(root.switchModal().getContent()).toEqual('hidden');
        })
        .done(function () {
          setTimeout(done, 1000);
        });
    });
  });
})();
