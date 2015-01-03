(function () {
  'use strict';

  var PageObject = testmator.PageObject;

  describe('PageObject', function () {
    describe('constructor', function () {
      it('page object is instance of PageObject', function () {
        var page = new PageObject();

        expect(page instanceof PageObject).toBeTruthy();
      });
    });

    describe('extend', function () {
      it('extend page object is instance of PageObject', function () {
        var FooPage = PageObject.extend();
        var page = new FooPage();

        expect(page instanceof PageObject).toBeTruthy();
      });

      it('extend page object is instance of extend PageObject', function () {
        var FooPage = PageObject.extend();
        var page = new FooPage();

        expect(page instanceof FooPage).toBeTruthy();
      });

      it('el is string', function () {
        var page = new PageObject({el: 'body'});

        expect(page.el).toEqual($('body')[0]);
        expect(page.$el[0]).toEqual($('body')[0]);
      });

      it('el is DOM', function () {
        var page = new PageObject({el: $('body')[0]});

        expect(page.el).toEqual($('body')[0]);
        expect(page.$el[0]).toEqual($('body')[0]);
      });

      it('el is jQuery object', function () {
        var page = new PageObject({el: $('body')});

        expect(page.el).toEqual($('body')[0]);
        expect(page.$el[0]).toEqual($('body')[0]);
      });

      it('el is Backbone.View object', function () {
        var view = new Backbone.View({el: 'body'});
        var page = new PageObject({el: view});

        expect(page.el).toEqual($('body')[0]);
        expect(page.$el[0]).toEqual($('body')[0]);
      });

      it('el is function', function () {
        var page = new PageObject({el: function () { return 'body'; }});

        expect(page.el).toEqual($('body')[0]);
        expect(page.$el[0]).toEqual($('body')[0]);
      });
    });
  });
})();
