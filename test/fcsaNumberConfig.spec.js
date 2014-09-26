(function() {
  describe('fcsaNumberConfig', function() {
    var $compile, $scope, isValid;
    $scope = void 0;
    $compile = void 0;
    beforeEach(function() {
      var testModule;
      testModule = angular.module('testModule', []);
      testModule.config(function(fcsaNumberConfigProvider) {
        return fcsaNumberConfigProvider.setDefaultOptions({
          max: 1000,
          min: 0
        });
      });
      module('fcsa-number', 'testModule');
      return inject(function($rootScope, _$compile_) {
        $scope = $rootScope;
        $compile = _$compile_;
        return $scope.model = {
          number: 0
        };
      });
    });
    isValid = function(args) {
      args.options || (args.options = '{}');
      $compile("<form name='form'><input type='text' name='number' ng-model='model.number' fcsa-number='" + args.options + "' /></form>")($scope);
      $scope.$digest();
      $scope.form.number.$setViewValue(args.val);
      return $scope.form.number.$valid;
    };
    it('default max', function() {
      var valid;
      valid = isValid({
        val: '1001'
      });
      return expect(valid).toBe(false);
    });
    it('override max', function() {
      var valid;
      valid = isValid({
        options: '{ max: 10000 }',
        val: '1001'
      });
      return expect(valid).toBe(true);
    });
    it('default min', function() {
      var valid;
      valid = isValid({
        val: '-1'
      });
      return expect(valid).toBe(false);
    });
    return it('override min', function() {
      var valid;
      valid = isValid({
        options: '{ min: -10 }',
        val: '-1'
      });
      return expect(valid).toBe(true);
    });
  });

}).call(this);
