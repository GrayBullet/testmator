(function () {
  'use strict';

  describe('testmator', function () {
    var rootPage;

    beforeEach(function () {
      rootPage = window.createRootModalPage();
    });

    it('Full test', function (done) {
      testmator(rootPage)
        .action(function (root) {
          return root.clickOpenModal();
        })
        .scope(function (modal) {
          return testmator(modal)
            .test(function (modal) {
              expect(modal.getContent()).toEqual('shown');
            })
            .clickClose();
        })
        .test(function (root) {
          expect(root.switchModal().getContent()).toEqual('hidden');
        })
        .clickOpenModal()
        .scope(function (modal) {
          return testmator(modal)
            .test(function (modal) {
              expect(modal.getContent()).toEqual('shown');
            })
            .action('clickClose');
        })
        .test(function (root) {
          expect(root.switchModal().getContent()).toEqual('hidden');
        })
        .done(done);
    });
  });
})();
