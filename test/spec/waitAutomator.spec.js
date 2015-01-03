(function () {
  'use strict';

  var automator = function (page) {
    return testmator.automator.waitAutomator(testmator.automator(page));
  };
  var PageObject = testmator.PageObject;

  describe('waitAutomator', function () {
    var rootPage;

    beforeEach(function () {
      var $root = $('<div id="root">\n' +
                    '  <button id="open-modal"></button>\n' +
                    '  <div id="modal" class="modal fade" role="dialog">\n' +
                    '    <div class="modal-dialog">\n' +
                    '      <button id="close-modal"></button>\n' +
                    '      <div id="content"></div>\n' +
                    '    </div>\n' +
                    '  </div>\n' +
                    '</div>\n')
            .on('show.bs.modal shown.bs.modal hide.bs.modal, hidden.bs.modal',
                function (e) {
                  $(this).find('#content').text(e.type);
                })
            .on('click', '#open-modal', function () {
              $root.find('#modal').modal('show');
            })
            .on('click', '#close-modal', function () {
              $root.find('#modal').modal('hide');
            });

      var ModalPage = PageObject.extend({
        name: 'modal',
        clickClose: function () {
          this.click('#close-modal');
          return this.switchParent();
        },
        getContent: function () {
          return this.$('#content').text();
        }
      });

      var RootPage = PageObject.extend({
        name: 'root',
        switchModal: function () {
          return new ModalPage({el: this.$('#modal'), parent: this});
        },
        clickOpenModal: function () {
          this.click('#open-modal');
          return this.switchModal();
        }
      });

      rootPage = new RootPage({el: $root});
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
