(function () {
  'use strict';

  var createTransitionObject = testmator.createTransitionObject;

  describe('TransitionObject', function () {
    var mock;
    var transition;
    var $panel1;
    var $panel2;

    beforeEach(function () {
      var $root = $('<div><div id="panel1">panel1</div><div id="panel2">panel2</div></div>');
      $panel1 = $root.find('#panel1');
      $panel2 = $root.find('#panel2');
      mock = jasmine.createSpyObj('mock', ['start', 'end']);
      transition = createTransitionObject($root,
                                          mock.start,
                                          mock.end);
    });

    describe('wait animation', function () {
      var events = [
        {start: 'show.bs.modal', end: 'shown.bs.modal'},
        {start: 'hide.bs.modal', end: 'hidden.bs.modal'},
        {start: 'show.bs.collapse', end: 'shown.bs.collapse'},
        {start: 'hide.bs.collapse', end: 'hidden.bs.collapse'},
        {start: 'show.bs.dropdown', end: 'shown.bs.dropdown'},
        {start: 'hide.bs.dropdown', end: 'hidden.bs.dropdown'},
        {start: 'hide.bs.alert', end: 'hidden.bs.alert'}
      ];

      events.forEach(function (info) {
        it('"' + info.start + '" and "' + info.end + '"', function () {
          $panel1.trigger(info.start);
          $panel1.trigger(info.end);

          expect(mock.start.calls.count()).toEqual(1);
          expect(mock.end.calls.count()).toEqual(1);
        });
      });
    });

    describe('transitioning', function () {
      it('before start animation', function () {
        expect(transition.transitioning()).toBeFalsy();
      });

      it('after start animation', function () {
        $panel1.trigger('show.bs.modal');

        expect(transition.transitioning()).toBeTruthy();
      });

      it('end animation', function () {
        $panel1.trigger('show.bs.modal');
        $panel1.trigger('shown.bs.modal');

        expect(transition.transitioning()).toBeFalsy();
      });

      it('Parallel animation', function () {
        $panel1.trigger('show.bs.modal');
        $panel2.trigger('show.bs.modal');

        expect(transition.transitioning()).toBeTruthy();

        $panel1.trigger('shown.bs.modal');

        expect(transition.transitioning()).toBeTruthy();

        $panel2.trigger('shown.bs.modal');

        expect(transition.transitioning()).toBeFalsy();
      });
    });
  });
})();
