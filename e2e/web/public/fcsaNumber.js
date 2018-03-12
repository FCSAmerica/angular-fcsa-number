/*! angular-fcsa-number (version 1.6.0) 2018-03-12 */
(function() {
  var fcsaNumberModule,
    __hasProp = {}.hasOwnProperty;

  fcsaNumberModule = angular.module('fcsa-number', []);

  fcsaNumberModule.directive('fcsaNumber', [
    'fcsaNumberConfig', '$locale', function(fcsaNumberConfig, $locale) {
      var addGroupsToInteger, controlKeys, convertToEnglishNumber, decimalSeparator, defaultOptions, getOptions, hasMultipleDecimals, isNotControlKey, isNotDigit, isNumber, makeIsValid, makeMaxDecimals, makeMaxDigits, makeMaxNumber, makeMinNumber, thousandSeparator;
      defaultOptions = fcsaNumberConfig.defaultOptions;
      decimalSeparator = function() {
        return $locale.NUMBER_FORMATS.DECIMAL_SEP;
      };
      thousandSeparator = function() {
        return $locale.NUMBER_FORMATS.GROUP_SEP;
      };
      getOptions = function(scope) {
        var option, options, value, _ref;
        options = angular.copy(defaultOptions);
        if (scope.options != null) {
          _ref = scope.$eval(scope.options);
          for (option in _ref) {
            if (!__hasProp.call(_ref, option)) continue;
            value = _ref[option];
            options[option] = value;
          }
        }
        return options;
      };
      convertToEnglishNumber = function(val) {
        var decRegEx, thouRegEx;
        decRegEx = new RegExp("\\" + decimalSeparator(), 'g');
        thouRegEx = new RegExp("\\" + thousandSeparator(), 'g');
        val = val.replace(thouRegEx, '');
        val = val.replace(decRegEx, '.');
        return val;
      };
      isNumber = function(val) {
        return !isNaN(parseFloat(val)) && isFinite(val);
      };
      isNotDigit = function(which, maxDecimals, minVal) {
        var decSep, thouSep;
        decSep = decimalSeparator().charCodeAt(0);
        thouSep = thousandSeparator().charCodeAt(0);
        if (which === thouSep) {
          return true;
        }
        if (which === decSep) {
          if (maxDecimals === 0) {
            return true;
          }
          return false;
        }
        if (which === 45 && minVal >= 0) {
          return true;
        }
        return which < 44 || which > 57 || which === 47;
      };
      controlKeys = [0, 8, 13];
      isNotControlKey = function(which) {
        return controlKeys.indexOf(which) === -1;
      };
      hasMultipleDecimals = function(val) {
        return (val != null) && val.toString().split('.').length > 2;
      };
      makeMaxDecimals = function(maxDecimals) {
        var regexString, validRegex;
        if (maxDecimals > 0) {
          regexString = "^-?\\d*\\.?\\d{0," + maxDecimals + "}$";
        } else {
          regexString = "^-?\\d*$";
        }
        validRegex = new RegExp(regexString);
        return function(val) {
          return validRegex.test(val);
        };
      };
      makeMaxNumber = function(maxNumber) {
        return function(val, number) {
          return number <= maxNumber;
        };
      };
      makeMinNumber = function(minNumber) {
        return function(val, number) {
          return number >= minNumber;
        };
      };
      makeMaxDigits = function(maxDigits) {
        var validRegex;
        validRegex = new RegExp("^-?\\d{0," + maxDigits + "}(\\.\\d*)?$");
        return function(val) {
          return validRegex.test(val);
        };
      };
      makeIsValid = function(options) {
        var validations;
        validations = [];
        if (options.maxDecimals != null) {
          validations.push(makeMaxDecimals(options.maxDecimals));
        }
        if (options.max != null) {
          validations.push(makeMaxNumber(options.max));
        }
        if (options.min != null) {
          validations.push(makeMinNumber(options.min));
        }
        if (options.maxDigits != null) {
          validations.push(makeMaxDigits(options.maxDigits));
        }
        return function(val) {
          var i, number, _i, _ref;
          if (!isNumber(val)) {
            return false;
          }
          if (hasMultipleDecimals(val)) {
            return false;
          }
          number = Number(val);
          for (i = _i = 0, _ref = validations.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            if (!validations[i](val, number)) {
              return false;
            }
          }
          return true;
        };
      };
      addGroupsToInteger = function(val) {
        var decLoc, decSep, decimals, groups, thouSep, wholeNumbers;
        decSep = decimalSeparator();
        thouSep = thousandSeparator();
        val = val.replace(/\./g, decSep);
        decLoc = val.indexOf(decSep);
        decimals = decLoc == -1 ? '' : val.substring(decLoc);
        decLoc = decLoc > -1 ? decLoc : val.length;
        wholeNumbers = val.substring(0, decLoc);
        groups = wholeNumbers.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + thouSep);
        return "" + groups + decimals;
      };
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          options: '@fcsaNumber'
        },
        link: function(scope, elem, attrs, ngModelCtrl) {
          var isValid, options;
          options = getOptions(scope);
          isValid = makeIsValid(options);
          ngModelCtrl.$parsers.unshift(function(viewVal) {
            var englishNumber;
            englishNumber = convertToEnglishNumber(viewVal);
            if (isValid(englishNumber) || !englishNumber) {
              ngModelCtrl.$setValidity('fcsaNumber', true);
              return englishNumber;
            } else {
              ngModelCtrl.$setValidity('fcsaNumber', false);
              return void 0;
            }
          });
          ngModelCtrl.$formatters.push(function(val) {
            if ((options.nullDisplay != null) && (!val || val === '')) {
              return options.nullDisplay;
            }
            if ((val == null) || !isValid(val)) {
              return val;
            }
            ngModelCtrl.$setValidity('fcsaNumber', true);
            val = addGroupsToInteger(val.toString());
            if (options.prepend != null) {
              val = "" + options.prepend + val;
            }
            if (options.append != null) {
              val = "" + val + options.append;
            }
            return val;
          });
          elem.on('blur', function() {
            var formatter, viewValue, _i, _len, _ref;
            viewValue = ngModelCtrl.$modelValue;
            if ((viewValue == null) || !isValid(viewValue)) {
              return;
            }
            _ref = ngModelCtrl.$formatters;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              formatter = _ref[_i];
              viewValue = formatter(viewValue);
            }
            ngModelCtrl.$viewValue = viewValue;
            return ngModelCtrl.$render();
          });
          elem.on('focus', function() {
            var thouPattern, val;
            val = elem.val();
            if (options.prepend != null) {
              val = val.replace(options.prepend, '');
            }
            if (options.append != null) {
              val = val.replace(options.append, '');
            }
            thouPattern = new RegExp("\\" + thousandSeparator(), 'g');
            elem.val(val.replace(thouPattern, ''));
            return elem[0].select();
          });
          if (options.preventInvalidInput === true) {
            return elem.on('keypress', function(e) {
              if (isNotDigit(e.which, options.maxDecimals, options.min) && isNotControlKey(e.which)) {
                return e.preventDefault();
              }
            });
          }
        }
      };
    }
  ]);

  fcsaNumberModule.provider('fcsaNumberConfig', function() {
    var _defaultOptions;
    _defaultOptions = {};
    this.setDefaultOptions = function(defaultOptions) {
      return _defaultOptions = defaultOptions;
    };
    this.$get = function() {
      return {
        defaultOptions: _defaultOptions
      };
    };
  });

}).call(this);
