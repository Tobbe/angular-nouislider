'use strict';
angular.module('nouislider', []).directive('slider', function () {
  return {
    restrict: 'A',
    scope: {
      start: '=',
      step: '@',
      end: '=',
      callback: '@',
      margin: '@',
      ngModel: '=',
      ngFrom: '=',
      ngTo: '='
    },
    link: function (scope, element) {
      var fromParsed;
      var parsedValue;
      var slider = $(element);
      var toParsed;
      var callback = scope.callback ? scope.callback : 'slide';

      if (scope.ngFrom !== null && scope.ngTo !== null) {
        fromParsed = null;
        toParsed = null;

        slider.noUiSlider({
          start: [
            scope.ngFrom || scope.start,
            scope.ngTo || scope.end
          ],
          step: parseFloat(scope.step || 1),
          connect: true,
          margin: parseFloat(scope.margin || 0),
          range: {
            min: [parseFloat(scope.start)],
            max: [parseFloat(scope.end)]
          }
        });

        slider.on(callback, function () {
          var from = slider.val()[0];
          var to = slider.val()[1];
          fromParsed = parseFloat(from);
          toParsed = parseFloat(to);
          return scope.$apply(function () {
            scope.ngFrom = fromParsed;
            scope.ngTo = toParsed;
          });
        });

        scope.$watch('ngFrom', function (newVal) {
          if (newVal !== fromParsed) {
            return slider.val([newVal, null]);
          }
        });

        scope.$watch('ngTo', function (newVal) {
          if (newVal !== toParsed) {
            return slider.val([null, newVal]);
          }
        });
      } else {
        parsedValue = null;

        slider.noUiSlider({
          start: [scope.ngModel || scope.start],
          step: parseFloat(scope.step || 1),
          range: {
            min: [parseFloat(scope.start)],
            max: [parseFloat(scope.end)]
          }
        });

        slider.on(callback, function () {
          parsedValue = parseFloat(slider.val());
          return scope.$apply(function () {
            scope.ngModel = parsedValue;
            return scope.ngModel;
          });
        });

        scope.$watch('ngModel', function (newVal) {
          if (newVal !== parsedValue) {
            return slider.val(newVal);
          }
        });
      }

      scope.$watch('start', function (newVal) {
        slider.noUiSlider({
          range: {
            min: [parseFloat(newVal)],
            max: [parseFloat(scope.ngEnd || scope.end)]
          }
        }, true);
      });

      scope.$watch('end', function (newVal) {
        slider.noUiSlider({
          range: {
            min: [parseFloat(scope.ngStart || scope.start)],
            max: [parseFloat(newVal)]
          }
        }, true);
      });
    }
  };
});
