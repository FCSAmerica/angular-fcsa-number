describe 'fcsaNumber', ->
  form = undefined
  $scope = undefined
  $compile = undefined

  beforeEach module 'fcsa-number'
  beforeEach inject(($rootScope, _$compile_) ->
    $scope = $rootScope
    $compile = _$compile_
    $scope.model = { number: 0 }
  )

  compileForm = (options = '{}') ->
    $compile("<form name='form'><input type='text' name='number' ng-model='model.number' fcsa-number='#{options}' /></form>")($scope)
    $scope.$digest()
    $scope.form

  isValid = (args) ->
    args.options ||= '{}'
    $compile("<form name='form'><input type='text' name='number' ng-model='model.number' fcsa-number='#{args.options}' /></form>")($scope)
    $scope.$digest()
    $scope.form.number.$setViewValue args.val
    $scope.form.number.$valid

  describe 'on focus', ->
    it 'removes the commas', ->
      $scope.model.number = 1000
      el = $compile("<input type='text' name='number' ng-model='model.number' fcsa-number />")($scope)
      el = el[0]
      $scope.$digest()
      angular.element(document.body).append el
      angular.element(el).triggerHandler 'focus'
      expect(el.value).toBe '1000'

  describe 'on blur', ->
    it 'adds commas', ->
      $scope.model.number = 1000
      el = $compile("<input type='text' name='number' ng-model='model.number' fcsa-number />")($scope)
      el = el[0]
      $scope.$digest()
      angular.element(document.body).append el
      angular.element(el).triggerHandler 'focus'
      angular.element(el).triggerHandler 'blur'
      expect(el.value).toBe '1,000'

    describe 'with negative decimal number', ->
      it 'correctly formats it', ->
        $scope.model.number = -1000.2
        el = $compile("<input type='text' name='number' ng-model='model.number' fcsa-number />")($scope)
        el = el[0]
        $scope.$digest()
        angular.element(document.body).append el
        angular.element(el).triggerHandler 'focus'
        angular.element(el).triggerHandler 'blur'
        expect(el.value).toBe '-1,000.2'

    describe 'when more than 3 decimals', ->
      it 'does not add commas to the decimals', ->
        $scope.model.number = 1234.5678
        el = $compile("<input type='text' name='number' ng-model='model.number' fcsa-number />")($scope)
        el = el[0]
        $scope.$digest()
        angular.element(document.body).append el
        angular.element(el).triggerHandler 'focus'
        angular.element(el).triggerHandler 'blur'
        expect(el.value).toBe '1,234.5678'

  describe 'no options', ->
    it 'validates positive number', ->
      valid = isValid
        val: '1'
      expect(valid).toBe true

    it 'validates positive number with commas', ->
      valid = isValid
        val: '1,23'
      expect(valid).toBe true

    it 'validates negative number', ->
      valid = isValid
        val: '-1'
      expect(valid).toBe true

    it 'invalidates hyphen only', ->
      valid = isValid
        val: '-'
      expect(valid).toBe false

    it 'validates number with decimals', ->
      valid = isValid
        val: '1.1'
      expect(valid).toBe true

    it 'validates number with decimals and commas', ->
      valid = isValid
        val: '1,123,142.1'
      expect(valid).toBe true

    it 'validates number while ignoring extra commas', ->
      valid = isValid
        val: '1,1,23,1,4,2.1'
      expect(valid).toBe true

    it 'invalidates number with multiple decimals', ->
      valid = isValid
        val: '1.1.2'
      expect(valid).toBe false

    it 'invalidates non number', ->
      valid = isValid
        val: '1a'
      expect(valid).toBe false

  describe 'options', ->
    describe 'max', ->
      it 'validates numbers below or equal to max', ->
        valid = isValid
          options: '{ max: 100 }'
          val: '100'
        expect(valid).toBe true

      it 'invalidates numbers above max', ->
        valid = isValid
          options: '{ max: 100 }'
          val: '100.1'
        expect(valid).toBe false

    describe 'min', ->
      it 'validates numbers not below the min', ->
        valid = isValid
          options: '{ min: 0 }'
          val: '0'
        expect(valid).toBe true

      it 'invalidates numbers below the min', ->
        valid = isValid
          options: '{ min: 0 }'
          val: '-0.1'
        expect(valid).toBe false

    describe 'maxDigits', ->
      it 'validates positive numbers not above number of digits', ->
        valid = isValid
          options: '{ maxDigits: 2 }'
          val: '99'
        expect(valid).toBe true

      it 'invalidates positive numbers above number of digits', ->
        valid = isValid
          options: '{ maxDigits: 2 }'
          val: '999'
        expect(valid).toBe false

      it 'validates negative numbers not above number of digits', ->
        valid = isValid
          options: '{ maxDigits: 2 }'
          val: '-99'
        expect(valid).toBe true

    describe 'maxDecimals', ->
      it 'validates numbers without more decimals', ->
        valid = isValid
          options: '{ maxDecimals: 2 }'
          val: '1.23'
        expect(valid).toBe true

      it 'invalidates numbers with more decimals', ->
        valid = isValid
          options: '{ maxDecimals: 2 }'
          val: '1.234'
        expect(valid).toBe false

    describe 'prepend', ->
      it 'prepends the value', ->
        $scope.model.number = 1000
        form = compileForm "{ prepend: \"$\" }"
        expect(form.number.$viewValue).toBe '$1,000'
        expect($scope.model.number).toBe 1000

      it 'removes the prepend value on focus', ->
        $scope.model.number = 1000
        el = $compile("<input type='text' name='number' ng-model='model.number' fcsa-number='{ prepend: \"$\" }' />")($scope)
        el = el[0]
        $scope.$digest()
        angular.element(document.body).append el
        angular.element(el).triggerHandler 'focus'
        expect(el.value).toBe '1000'

    describe 'append', ->
      it 'appends the value', ->
        $scope.model.number = 100
        form = compileForm "{ append: \"%\" }"
        expect(form.number.$viewValue).toBe '100%'
        expect($scope.model.number).toBe 100

      it 'removes the append value on focus', ->
        $scope.model.number = 100
        el = $compile("<input type='text' name='number' ng-model='model.number' fcsa-number='{ append: \"%\" }' />")($scope)
        el = el[0]
        $scope.$digest()
        angular.element(document.body).append el
        angular.element(el).triggerHandler 'focus'
        expect(el.value).toBe '100'
