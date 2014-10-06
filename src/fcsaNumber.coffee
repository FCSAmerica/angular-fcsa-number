fcsaNumberModule = angular.module('fcsa-number', [])

fcsaNumberModule.directive 'fcsaNumber',
['fcsaNumberConfig', (fcsaNumberConfig) ->

    defaultOptions = fcsaNumberConfig.defaultOptions

    getOptions = (scope) ->
        options = angular.copy defaultOptions
        if scope.options?
            for own option, value of scope.$eval(scope.options)
                options[option] = value
                if option == 'thousandsSeparator'
                  options.thousandsSeparatorRegexp = new RegExp(value, 'g')
                if option == 'decimalMark'
                  options.decimalMarkRegexp = new RegExp(value, 'g')
        options
    
    isNumber = (val) ->
        !isNaN(parseFloat(val)) && isFinite(val)

    # 44 is ',', 45 is '-', 57 is '9' and 47 is '/'
    isNotDigit = (which) ->
        (which < 44 || which > 57 || which is 47)

    controlKeys = [0,8,13] # 0 = tab, 8 = backspace , 13 = enter
    isNotControlKey = (which) ->
      controlKeys.indexOf(which) == -1

    hasMultipleDecimals = (val) ->
      val? && val.toString().split('.').length > 2

    decimalMarkToRegexString = (options) ->
      return '\.' if options.decimalMark == '.'
      options.decimalMark

    makeMaxDecimals = (maxDecimals, options) ->
        decimalMark = decimalMarkToRegexString options

        if maxDecimals > 0
            regexString = "^-?\\d*#{decimalMark}?\\d{0,#{maxDecimals}}$"
        else
            regexString = "^-?\\d*$"
        validRegex = new RegExp regexString

        (val) -> validRegex.test val
        
    makeMaxNumber = (maxNumber) ->
        (val, number) -> number <= maxNumber

    makeMinNumber = (minNumber) ->
        (val, number) -> number >= minNumber

    makeMaxDigits = (maxDigits) ->
        validRegex = new RegExp "^-?\\d{0,#{maxDigits}}(\\.\\d*)?$"
        (val) -> validRegex.test val

    makeIsValid = (options) ->
        validations = []
        
        if options.maxDecimals?
            validations.push makeMaxDecimals options.maxDecimals, options
        if options.max?
            validations.push makeMaxNumber options.max
        if options.min?
            validations.push makeMinNumber options.min
        if options.maxDigits?
            validations.push makeMaxDigits options.maxDigits
            
        (val) ->
            return false unless isNumber val
            return false if hasMultipleDecimals val
            number = Number val
            for i in [0...validations.length]
                return false unless validations[i] val, number
            true

    removeThousandsSeparator = (val, options) ->
        val.replace options.thousandsSeparatorRegex, ''
        
    addThousandsSeparatorToInteger = (val, options) ->
        decimals = `val.indexOf('.') == -1 ? '' : val.replace(/^\d+(?=\.)/, '')`
        wholeNumbers = val.replace /(\.\d+)$/, ''
        commas = wholeNumbers.replace /(\d)(?=(\d{3})+(?!\d))/g, '$1,'
        "#{commas}#{decimals}"

    {
        restrict: 'A'
        require: 'ngModel'
        scope:
            options: '@fcsaNumber'
        link: (scope, elem, attrs, ngModelCtrl) ->
            options = getOptions scope
            isValid = makeIsValid options

            ngModelCtrl.$parsers.unshift (viewVal) ->
                viewVal = removeThousandsSeparator viewVal, options
                if isValid(viewVal) || !viewVal
                    ngModelCtrl.$setValidity 'fcsaNumber', true
                    return viewVal
                else
                    ngModelCtrl.$setValidity 'fcsaNumber', false
                    return undefined

            ngModelCtrl.$formatters.push (val) ->
                if options.nullDisplay? && (!val || val == '')
                    return options.nullDisplay
                return val if !val? || !isValid val
                ngModelCtrl.$setValidity 'fcsaNumber', true
                val = addThousandsSeparatorToInteger val.toString(), options
                if options.prepend?
                  val = "#{options.prepend}#{val}"
                if options.append?
                  val = "#{val}#{options.append}"
                val

            elem.on 'blur', ->
                viewValue = ngModelCtrl.$modelValue
                return if !viewValue? || !isValid(viewValue)
                for formatter in ngModelCtrl.$formatters
                    viewValue = formatter(viewValue)
                ngModelCtrl.$viewValue = viewValue
                ngModelCtrl.$render()

            elem.on 'focus', ->
                val = elem.val()
                if options.prepend?
                  val = val.replace options.prepend, ''
                if options.append?
                  val = val.replace options.append, ''
                elem.val removeThousandsSeparator(val, options)
                elem[0].select()

            if options.preventInvalidInput == true
              elem.on 'keypress', (e) ->
                e.preventDefault() if isNotDigit(e.which) && isNotControlKey(e.which)
    }
]

fcsaNumberModule.provider 'fcsaNumberConfig', ->
  _defaultOptions =
    thousandsSeparator: ','
    thousandsSeparatorRegex: new RegExp(',', 'g')
    decimalMark: '.'
    decimalMarkRegex: new RegExp('.', 'g')

  @setDefaultOptions = (defaultOptions) ->
    _defaultOptions = defaultOptions

  @$get = ->
    defaultOptions: _defaultOptions

  return
