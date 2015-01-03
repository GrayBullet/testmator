(function () {
  'use strict';

  var PageObject = testmator.PageObject;

  describe('PageObject', function () {
    describe('constructor', function () {
      it('page object is instance of PageObject', function () {
        var page = new PageObject();

        expect(page instanceof PageObject).toBeTruthy();
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
    });

    describe('functions', function () {
      var fooPage;
      var rootPage;
      var clicked;

      beforeEach(function () {
        var fooEl = $('<ul>')
              .append($('<li id="li1">').text('a'))
              .append($('<li id="li2">').text('b'));
        var FooPage = PageObject.extend();
        fooPage = new FooPage({el: fooEl});

        var rootEl = $('<div>')
              .append($('<button id="button1">'));
        var RootPage = PageObject.extend({
          clickButton1: function () {
            this.click('#button1');

            return new FooPage({
              el: fooEl,
              parent: this
            });
          }
        });
        rootPage = new RootPage({el: rootEl});

        clicked = jasmine.createSpy('clicked');
      });

      describe('$', function () {
        it('Find element', function () {
          var result = fooPage.$(':first-child').text();

          expect(result).toEqual('a');
        });
      });

      describe('click', function () {
        it('Raise click event.', function () {
          fooPage.$('#li2').on('click', clicked);

          fooPage.click('#li2');

          expect(clicked).toHaveBeenCalled();
        });

        it('Custom click method.', function () {
          rootPage.$('#button1').on('click', clicked);

          rootPage.clickButton1();

          expect(clicked).toHaveBeenCalled();
        });
      });

      describe('switchParent', function () {
        it('return parent PageObject', function () {
          var childPage = rootPage.clickButton1();

          var result = childPage.switchParent();

          expect(result).toEqual(rootPage);
        });
      });
    });
  });
})();
