/*! angular-fcsa-number (version 1.5.3) 2014-10-17 */
(function() {
    var fcsaNumberModule, __hasProp = {}.hasOwnProperty;

    fcsaNumberModule = angular.module('fcsa-number', []);

    fcsaNumberModule
            .directive(
                    'fcsaNumber',
                    [
                            'fcsaNumberConfig',
                            function(fcsaNumberConfig) {
                                var addCommasToInteger, controlKeys, defaultOptions, getOptions, hasMultipleDecimals, isNotControlKey, isNotDigit, isNumber, makeIsValid, makeMaxDecimals, makeMaxDigits, makeMaxNumber, makeMinNumber;
                                defaultOptions = fcsaNumberConfig.defaultOptions;
                                getOptions = function(scope) {
                                    var option, options, value, _ref;
                                    options = angular.copy(defaultOptions);
                                    if (scope && scope.options != null) {
                                        _ref = scope.$eval(scope.options);
                                        for (option in _ref) {
                                            if (!__hasProp.call(_ref, option)) continue;
                                            value = _ref[option];
                                            options[option] = value;
                                        }
                                    }
                                    return options;
                                };
                                toStandard = function(val) {
                                    // this function will parse val char by char
                                    // and return Javascript standard notation
                                    // for numbers
                                    if (!val) {
                                        return val;
                                    }
                                    var valS = val.toString();
                                    var len = valS.length;
                                    var ret = "";
                                    var opt = getOptions();
                                    var decSep = opt.decimalSeparator;
                                    var thSep = opt.thousandsSeparator;
                                    for (var i = 0; i < len; i++) {
                                        var chr = valS[i];
                                        if (chr != thSep) {
                                            if (chr == decSep) {
                                                chr = ".";
                                            }
                                            ret += chr;
                                        }
                                    }
                                    // if last is decimal separator - then skip
                                    if (ret.indexOf(opt.decimalSeparator) == ret.length - 1) {
                                        ret = ret.substring(0, ret.length - 1);
                                    }
                                    return ret;
                                };
                                isNumber = function(val) {
                                    var sval = toStandard(val);
                                    return !isNaN(parseFloat(sval)) && isFinite(sval);
                                };
                                isNotDigit = function(which) {
                                    return which < 44 || which > 57 || which === 47;
                                };
                                controlKeys = [ 0, 8, 13 ];
                                isNotControlKey = function(which) {
                                    return controlKeys.indexOf(which) === -1;
                                };
                                hasMultipleDecimals = function(val) {
                                    return (val != null)
                                            && val.toString().split(getOptions().decimalSeparator).length > 2;
                                };
                                makeFormatWithMaxDecimals = function(maxDecimals) {
                                    var regexString, validRegex;
                                    var options = getOptions();
                                    if (maxDecimals > 0) {
                                        regexString = "^-?\\d{1,3}(\\" + options.thousandsSeparator + "?\\d{3})*"
                                                + "\\" + options.decimalSeparator + "?\\d{0," + maxDecimals + "}$";
                                    } else {
                                        regexString = "^-?\\d{1,3}(\\" + options.thousandsSeparator + "?\\d{3})*$";
                                    }
                                    validRegex = new RegExp(regexString);
                                    return function(val) {
                                        var ret = validRegex.test(val);
                                        if (!ret)
                                            window.console.log('Invalid regex(1): ' + validRegex.toString() + " : "
                                                    + val);
                                        return ret;
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
                                    return function(val) {
                                        if (!val) {
                                            return false;
                                        }
                                        var options = getOptions();
                                        var valS = val.toString();
                                        var digits = 0;
                                        var decsep = 0;
                                        for (var i = 0; i < valS.length; i++) {
                                            var znak = valS[i];
                                            if (znak >= '0' && znak <= '9') {
                                                digits++;
                                            } else {
                                                if (znak == options.thousandsSeparator) {
                                                    continue;
                                                } else if (znak == options.decimalSeparator) {
                                                    if (decsep++) {
                                                        return false;
                                                    }
                                                } else {
                                                    return false;
                                                }
                                            }
                                        }
                                        return digits <= maxDigits;
                                    };
                                };
                                makeIsValid = function(options) {
                                    var validations;
                                    validations = [];
                                    // mandatory format validation
                                    validations
                                            .push(makeFormatWithMaxDecimals(options.maxDecimals ? options.maxDecimals
                                                    : 0));
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
                                        number = Number(toStandard(val));
                                        for (i = _i = 0, _ref = validations.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i
                                                : --_i) {
                                            if (!validations[i](val, number)) {
                                                return false;
                                            }
                                        }
                                        return true;
                                    };
                                };
                                addCommasToInteger = function(val) {
                                    var commas, decimals, wholeNumbers;
                                    var options = getOptions();
                                    var decSep = options.decimalSeparator;
                                    var thouSep = options.thousandsSeparator;
                                    var decimals = '';
                                    var dsi = val.indexOf(decSep);
                                    if (dsi >= 0 && dsi < val.length - 1) {
                                        decimals = val.substring(dsi);
                                    }
                                    wholeNumbers = val.replace(new RegExp('(\\' + decSep + '\\d*)$'), '');
                                    commas = wholeNumbers.replace(new RegExp('(\\d)(?=(\\d{3})+(?!\\d))', 'g'), '$1'
                                            + thouSep);
                                    var ret = "" + commas + decimals;
                                    window.console.log("Was: " + val + " is now: " + ret);
                                    return ret;
                                };
                                return {
                                    restrict : 'A',
                                    require : 'ngModel',
                                    scope : {
                                        options : '@fcsaNumber'
                                    },
                                    link : function(scope, elem, attrs, ngModelCtrl) {
                                        var isValid, options;
                                        options = getOptions(scope);
                                        isValid = makeIsValid(options);
                                        ngModelCtrl.$parsers.unshift(function(viewVal) {
                                            if (!viewVal || isValid(viewVal)) {
                                                ngModelCtrl.$setValidity('fcsaNumber', true);
                                                return viewVal;
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
                                            val = addCommasToInteger(val.toString());
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
                                            if (viewValue == null || !options.autoFormat || !isValid(viewValue)) {
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
                                            var val;
                                            val = elem.val();
                                            if (options.prepend != null) {
                                                val = val.replace(options.prepend, '');
                                            }
                                            if (options.append != null) {
                                                val = val.replace(options.append, '');
                                            }
                                            if (!options.keepThousandsOnInput) {
                                                if (val) {
                                                    val = Number(toStandard(val)).toString();
                                                    val = val.replace(
                                                            new RegExp("\\" + options.thousandsSeparator, "g"),
                                                            options.decimalSeparator);
                                                }
                                            }
                                            elem.val(val);
                                            return elem[0].select();
                                        });
                                        if (options.preventInvalidInput === true) {
                                            return elem.on('keypress', function(e) {
                                                if (isNotDigit(e.which) && isNotControlKey(e.which)) {
                                                    return e.preventDefault();
                                                }
                                            });
                                        }
                                    }
                                };
                            } ]);

    fcsaNumberModule.provider('fcsaNumberConfig', function() {
        var _defaultOptions;
        whatDecimalSeparator = function() {
            var n = 1.1;
            n = n.toLocaleString();
            var regex = new RegExp("^1(.+)1\\d*$");
            n = n && regex.exec(n);
            n = n ? n[1] : ".";
            return n;
        }
        whatThousandsSeparator = function() {
            var n = 1111;
            n = n.toLocaleString();
            var regex = new RegExp("^1(.+)111(\\" + whatDecimalSeparator() + "\\d*)?$");
            n = n && regex.exec(n);
            n = n ? n[1] : ",";
            return n;
        }
        _defaultOptions = {
            decimalSeparator : whatDecimalSeparator(),
            thousandsSeparator : whatThousandsSeparator()
        };
        this.setDefaultOptions = function(defaultOptions) {
            for ( var name in defaultOptions) {
                _defaultOptions[name] = defaultOptions[name];
            }
            return _defaultOptions;
        };
        this.$get = function() {
            return {
                defaultOptions : _defaultOptions
            };
        };
    });

}).call(this);
