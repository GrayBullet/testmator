(function () {
  'use strict';

  describe('getRoot', function () {
    var $element;

    beforeEach(function () {
      $element = $('<div id="root"><ul id="nest1"><li id="nest2"><span id="nest3"></span></div>');
    });

    ['#nest1', '#nest2', '#nest3'].forEach(function (id) {
      it(id + '\'s root element is #root', function () {
        var result = testmator.getRoot($element.find(id));

        expect(result[0].id).toEqual('root');
      });
    });

    it('#root\'s root element is #root', function () {
      var result = testmator.getRoot($element);

      expect(result[0].id).toEqual('root');
    });
  });

  describe('transitionPromise', function () {
    it('wait shown.bs.modal', function (done) {
      var $base = $('<div>\n' +
                    '  <div id="modal" class="modal fade" role="dialog">\n' +
                    '     <div class="modal-dialog"></div>\n' +
                    '  </div>\n' +
                    '</div>\n');

      $base.transitionPromise();

      $base.find('#modal').modal('show');

      $base.transitionPromise('sample')
        .done(function (result) {
          expect(result).toEqual('sample');
          done();
        });
    });
  });
})();
