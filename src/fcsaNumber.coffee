fcsaNumberModule = angular.module('fcsa-number', [])

fcsaNumberModule.directive 'fcsaNumber',
['fcsaNumberConfig', '$locale', (fcsaNumberConfig, $locale) ->

    defaultOptions = fcsaNumberConfig.defaultOptions
    decimalSeparator = () -> $locale.NUMBER_FORMATS.DECIMAL_SEP
    thousandSeparator = () -> $locale.NUMBER_FORMATS.GROUP_SEP
    getOptions = (scope) ->
        options = angular.copy defaultOptions
        if scope.options?
            for own option, value of scope.$eval(scope.options)
                options[option] = value
        options
    
    convertToEnglishNumber = (val) ->
          decRegEx = new RegExp("\\" + decimalSeparator(), 'g')
          thouRegEx = new RegExp("\\" + thousandSeparator(), 'g')
          val = val.replace(thouRegEx, '')
          val = val.replace(decRegEx, '.')
          val;

    isNumber = (val) ->
        !isNaN(parseFloat(val)) && isFinite(val)

    # 44 is ',', 45 is '-', 57 is '9' and 47 is '/'
    isNotDigit = (which, maxDecimals, minVal) ->
          decSep = decimalSeparator().charCodeAt(0);
          thouSep = thousandSeparator().charCodeAt(0);
          if (which == thouSep) # disable input of thousand separators
            return true
          if (which == decSep)
            if (maxDecimals == 0)
                return true
            return false
          if (which == 45 && minVal >= 0)
            return true

          return (which < 44 || which > 57 || which == 47);
      
    controlKeys = [0,8,13] # 0 = tab, 8 = backspace , 13 = enter
    isNotControlKey = (which) ->
      controlKeys.indexOf(which) == -1

    hasMultipleDecimals = (val) ->
      val? && val.toString().split('.').length > 2

    makeMaxDecimals = (maxDecimals) ->
        if maxDecimals > 0
            regexString = "^-?\\d*\\.?\\d{0,#{maxDecimals}}$"
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
            validations.push makeMaxDecimals options.maxDecimals
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

    addGroupsToInteger = (val) ->
        decSep = decimalSeparator()
        thouSep = thousandSeparator()
        val = val.replace(/\./g, decSep)
        decLoc = val.indexOf(decSep)
        decimals = `decLoc == -1 ? '' : val.substring(decLoc)`
        decLoc = `decLoc > -1 ? decLoc : val.length`
        wholeNumbers = val.substring(0, decLoc)
        groups = wholeNumbers.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + thouSep)
        "#{groups}#{decimals}"
    {
        restrict: 'A'
        require: 'ngModel'
        scope:
            options: '@fcsaNumber'
        link: (scope, elem, attrs, ngModelCtrl) ->
            options = getOptions scope
            isValid = makeIsValid options

            ngModelCtrl.$parsers.unshift (viewVal) ->
                englishNumber = convertToEnglishNumber(viewVal)
                if isValid(englishNumber) || !englishNumber
                    ngModelCtrl.$setValidity 'fcsaNumber', true
                    return englishNumber
                else
                    ngModelCtrl.$setValidity 'fcsaNumber', false
                    return undefined

            ngModelCtrl.$formatters.push (val) ->
                if options.nullDisplay? && (!val || val == '')
                    return options.nullDisplay
                return val if !val? || !isValid val
                ngModelCtrl.$setValidity 'fcsaNumber', true
                val = addGroupsToInteger val.toString()
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
                thouPattern = new RegExp("\\" + thousandSeparator(), 'g')
                elem.val(val.replace(thouPattern, ''))
                elem[0].select()

            if options.preventInvalidInput == true
              elem.on 'keypress', (e) ->
                e.preventDefault() if isNotDigit(e.which, options.maxDecimals, options.min) && isNotControlKey(e.which)
    }
]

fcsaNumberModule.provider 'fcsaNumberConfig', ->
  _defaultOptions = {}

  @setDefaultOptions = (defaultOptions) ->
    _defaultOptions = defaultOptions

  @$get = ->
    defaultOptions: _defaultOptions

  return
