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
    describe('no options', function() {
      it('validates positive number', function() {
        var valid;
        valid = isValid({
          val: '1'
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
      it('validates number with decimals', function() {
        var valid;
        valid = isValid({
          val: '1.1'
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
        it('validates postive numbers not above number of digits', function() {
          var valid;
          valid = isValid({
            options: '{ maxDigits: 2 }',
            val: '99'
          });
          return expect(valid).toBe(true);
        });
        it('invalidates postive numbers above number of digits', function() {
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
      return describe('maxDecimals', function() {
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
    });
  });

}).call(this);
