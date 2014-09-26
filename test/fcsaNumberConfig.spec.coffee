describe 'fcsaNumberConfig', ->
  $scope = undefined
  $compile = undefined

  beforeEach ->
    testModule = angular.module 'testModule', []
    testModule.config (fcsaNumberConfigProvider) ->
      fcsaNumberConfigProvider.setDefaultOptions {
        max: 1000
        min: 0
      }

    module 'fcsa-number', 'testModule'

    inject(($rootScope, _$compile_) ->
      $scope = $rootScope
      $compile = _$compile_
      $scope.model = { number: 0 }
    )

  isValid = (args) ->
    args.options ||= '{}'
    $compile("<form name='form'><input type='text' name='number' ng-model='model.number' fcsa-number='#{args.options}' /></form>")($scope)
    $scope.$digest()
    $scope.form.number.$setViewValue args.val
    $scope.form.number.$valid

  it 'default max', ->
    valid = isValid
      val: '1001'
    expect(valid).toBe false

  it 'override max', ->
    valid = isValid
      options: '{ max: 10000 }'
      val: '1001'
    expect(valid).toBe true

  it 'default min', ->
    valid = isValid
      val: '-1'
    expect(valid).toBe false

  it 'override min', ->
    valid = isValid
      options: '{ min: -10 }'
      val: '-1'
    expect(valid).toBe true

  # Not going to test the rest of the options because the code structure
  # is such that if one default option works, then all the default options work
