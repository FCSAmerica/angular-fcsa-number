(function() {
  describe('fcsaNumber', function() {
    var $compile, $scope, compileForm, form, isValid;
    form = void 0;
    $scope = void 0;
    $compile = void 0;
    beforeEach(module('fcsa-number'));
    beforeEach(inject(function($rootScope, _$compile_) {
      $scope = $rootScope;
      $compile = _$compile_;
      return $scope.model = {
        number: 0
      };
    }));
    compileForm = function(options) {
      if (options == null) {
        options = '{}';
      }
      $compile("<form name='form'><input type='text' name='number' ng-model='model.number' fcsa-number='" + options + "' /></form>")($scope);
      $scope.$digest();
      return $scope.form;
    };
    isValid = function(args) {
      args.options || (args.options = '{}');
      $compile("<form name='form'><input type='text' name='number' ng-model='model.number' fcsa-number='" + args.options + "' /></form>")($scope);
      $scope.$digest();
      $scope.form.number.$setViewValue(args.val);
      return $scope.form.number.$valid;
    };
    describe('on focus', function() {
      return it('removes the commas', function() {
        var el;
        $scope.model.number = 1000;
        el = $compile("<input type='text' name='number' ng-model='model.number' fcsa-number />")($scope);
        el = el[0];
        $scope.$digest();
        angular.element(document.body).append(el);
        angular.element(el).triggerHandler('focus');
        return expect(el.value).toBe('1000');
      });
    });
    describe('on blur', function() {
      it('adds commas', function() {
        var el;
        $scope.model.number = 1000;
        el = $compile("<input type='text' name='number' ng-model='model.number' fcsa-number />")($scope);
        el = el[0];
        $scope.$digest();
        angular.element(document.body).append(el);
        angular.element(el).triggerHandler('focus');
        angular.element(el).triggerHandler('blur');
        return expect(el.value).toBe('1,000');
      });
      describe('with negative decimal number', function() {
        return it('correctly formats it', function() {
          var el;
          $scope.model.number = -1000.2;
          el = $compile("<input type='text' name='number' ng-model='model.number' fcsa-number />")($scope);
          el = el[0];
          $scope.$digest();
          angular.element(document.body).append(el);
          angular.element(el).triggerHandler('focus');
          angular.element(el).triggerHandler('blur');
          return expect(el.value).toBe('-1,000.2');
        });
      });
      return describe('when more than 3 decimals', function() {
        return it('does not add commas to the decimals', function() {
          var el;
          $scope.model.number = 1234.5678;
          el = $compile("<input type='text' name='number' ng-model='model.number' fcsa-number />")($scope);
          el = el[0];
          $scope.$digest();
          angular.element(document.body).append(el);
          angular.element(el).triggerHandler('focus');
          angular.element(el).triggerHandler('blur');
          return expect(el.value).toBe('1,234.5678');
        });
      });
    });
    describe('no options', function() {
      it('validates positive number', function() {
        var valid;
        valid = isValid({
          val: '1'
        });
        return expect(valid).toBe(true);
      });
      it('validates positive number with commas', function() {
        var valid;
        valid = isValid({
          val: '1,23'
        });
        return expect(valid).toBe(true);
      });
      it('validates negative number', function() {
        var valid;
        valid = isValid({
          val: '-1'
        });
        return expect(valid).toBe(true);
      });
      it('invalidates hyphen only', function() {
        var valid;
        valid = isValid({
          val: '-'
        });
        return expect(valid).toBe(false);
      });
      it('validates number with decimals', function() {
        var valid;
        valid = isValid({
          val: '1.1'
        });
        return expect(valid).toBe(true);
      });
      it('validates number with decimals and commas', function() {
        var valid;
        valid = isValid({
          val: '1,123,142.1'
        });
        return expect(valid).toBe(true);
      });
      it('validates number while ignoring extra commas', function() {
        var valid;
        valid = isValid({
          val: '1,1,23,1,4,2.1'
        });
        return expect(valid).toBe(true);
      });
      it('invalidates number with multiple decimals', function() {
        var valid;
        valid = isValid({
          val: '1.1.2'
        });
        return expect(valid).toBe(false);
      });
      return it('invalidates non number', function() {
        var valid;
        valid = isValid({
          val: '1a'
        });
        return expect(valid).toBe(false);
      });
    });
    return describe('options', function() {
      describe('max', function() {
        it('validates numbers below or equal to max', function() {
          var valid;
          valid = isValid({
            options: '{ max: 100 }',
            val: '100'
          });
          return expect(valid).toBe(true);
        });
        return it('invalidates numbers above max', function() {
          var valid;
          valid = isValid({
            options: '{ max: 100 }',
            val: '100.1'
          });
          return expect(valid).toBe(false);
        });
      });
      describe('min', function() {
        it('validates numbers not below the min', function() {
          var valid;
          valid = isValid({
            options: '{ min: 0 }',
            val: '0'
          });
          return expect(valid).toBe(true);
        });
        return it('invalidates numbers below the min', function() {
          var valid;
          valid = isValid({
            options: '{ min: 0 }',
            val: '-0.1'
          });
          return expect(valid).toBe(false);
        });
      });
      describe('maxDigits', function() {
        it('validates positive numbers not above number of digits', function() {
          var valid;
          valid = isValid({
            options: '{ maxDigits: 2 }',
            val: '99'
          });
          return expect(valid).toBe(true);
        });
        it('invalidates positive numbers above number of digits', function() {
          var valid;
          valid = isValid({
            options: '{ maxDigits: 2 }',
            val: '999'
          });
          return expect(valid).toBe(false);
        });
        return it('validates negative numbers not above number of digits', function() {
          var valid;
          valid = isValid({
            options: '{ maxDigits: 2 }',
            val: '-99'
          });
          return expect(valid).toBe(true);
        });
      });
      describe('maxDecimals', function() {
        it('validates numbers without more decimals', function() {
          var valid;
          valid = isValid({
            options: '{ maxDecimals: 2 }',
            val: '1.23'
          });
          return expect(valid).toBe(true);
        });
        return it('invalidates numbers with more decimals', function() {
          var valid;
          valid = isValid({
            options: '{ maxDecimals: 2 }',
            val: '1.234'
          });
          return expect(valid).toBe(false);
        });
      });
      describe('prepend', function() {
        it('prepends the value', function() {
          $scope.model.number = 1000;
          form = compileForm("{ prepend: \"$\" }");
          expect(form.number.$viewValue).toBe('$1,000');
          return expect($scope.model.number).toBe(1000);
        });
        return it('removes the prepend value on focus', function() {
          var el;
          $scope.model.number = 1000;
          el = $compile("<input type='text' name='number' ng-model='model.number' fcsa-number='{ prepend: \"$\" }' />")($scope);
          el = el[0];
          $scope.$digest();
          angular.element(document.body).append(el);
          angular.element(el).triggerHandler('focus');
          return expect(el.value).toBe('1000');
        });
      });
      return describe('append', function() {
        it('appends the value', function() {
          $scope.model.number = 100;
          form = compileForm("{ append: \"%\" }");
          expect(form.number.$viewValue).toBe('100%');
          return expect($scope.model.number).toBe(100);
        });
        return it('removes the append value on focus', function() {
          var el;
          $scope.model.number = 100;
          el = $compile("<input type='text' name='number' ng-model='model.number' fcsa-number='{ append: \"%\" }' />")($scope);
          el = el[0];
          $scope.$digest();
          angular.element(document.body).append(el);
          angular.element(el).triggerHandler('focus');
          return expect(el.value).toBe('100');
        });
      });
    });
  });

}).call(this);
