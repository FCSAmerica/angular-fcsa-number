/*! angular-fcsa-number (version 1.5.3) 2014-10-17 */
(function() {
    var fcsaNumberModule, __hasProp = {}.hasOwnProperty;

    fcsaNumberModule = angular.module('fcsa-number', []);

    fcsaHelper = fcsaNumberModule.factory('fcsa-helper', [ 'fcsaNumberConfig', function(fcsaNumberConfig) {
        var FCSAH = {};
        FCSAH.toNumber = function(val, decSep, thSep) {
            // this function will parse val char by char
            // and return Javascript standard notation
            // for numbers
            if (!val) {
                return val;
            }
            var valS = val.toString();
            var len = valS.length;
            var ret = "";
            decSep = decSep ? decSep : fcsaNumberConfig.defaultOptions.decimalSeparator;
            thSep = thSep ? thSep : fcsaNumberConfig.defaultOptions.thousandsSeparator;
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
            if (ret.indexOf(decSep.decimalSeparator) == ret.length - 1) {
                ret = ret.substring(0, ret.length - 1);
            }
            return ret;
        }
        FCSAH.fromNumber = function(val, decSep, thSep) {
            val = val + ""; // convert to string, if not already
            var commas, decimals, wholeNumbers;
            decSep = decSep ? decSep : fcsaNumberConfig.defaultOptions.decimalSeparator;
            thSep = thSep ? thSep : fcsaNumberConfig.defaultOptions.thousandsSeparator;
            var decimals = '';
            // we look for normal decimal separator here
            var dsi = val.indexOf(".");
            if (dsi >= 0 && dsi < val.length - 1) {
                decimals = decSep + (dsi < val.length ? val.substring(dsi + 1) : "");
            }
            wholeNumbers = wholeNumbers.replace(/(\-?)(0*)(\d+?)(\.(\d*))?$/, '$1$3$4');
            commas = wholeNumbers.replace(new RegExp('(\\d)(?=(\\d{3})+(?!\\d))', 'g'), '$1' + thSep);
            var ret = "" + commas + decimals;
            return ret;
        }
        return FCSAH;
    } ]);

    fcsaNumberModule
            .directive(
                    'fcsaNumber',
                    [
                            'fcsaNumberConfig',
                            'fcsa-helper',
                            function(fcsaNumberConfig, fcsaHelper) {
                                var defaultOptions, getOptions, isNumber, isNotDigit, controlKeys, isNotControlKey, hasMultipleDecimals, makeFormatWithMaxDecimals, makeMaxNumber, makeMinNumber, makeMaxDigits, makeIsValid, addCommasToInteger;
                                defaultOptions = fcsaNumberConfig.defaultOptions;
                                getOptions = function(scope) {
                                    var option, options, value, _ref;
                                    options = angular.copy(defaultOptions);
                                    if (scope && scope.options != null) {
                                        _ref = scope.$eval(scope.options);
                                        for (option in _ref) {
                                            if (!__hasProp.call(_ref, option))
                                                continue;
                                            value = _ref[option];
                                            options[option] = value;
                                        }
                                    }
                                    return options;
                                };
                                isNumber = function(val) {
                                    var opt = getOptions();
                                    var sval = fcsaHelper.toNumber(val, opt.decimalSeparator, opt.thousandsSeparator);
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
                                        var valS = val.toString().trim();
                                        var digits = 0;
                                        var decsep = 0;
                                        var nonZero = false;
                                        for (var i = 0; i < valS.length; i++) {
                                            var znak = valS[i];
                                            if (znak == '-') {
                                                continue;
                                            }
                                            if (znak >= '0' && znak <= '9') {
                                                if (!nonZero && znak == '0') {
                                                    // there were no non-zero
                                                    // chars
                                                    if (i < valS.length - 1 && valS[i + 1] != options.decimalSeparator) {
                                                        continue;
                                                    }
                                                } else {
                                                    nonZero = true;
                                                    digits++;
                                                }
                                            } else {
                                                if (znak == options.thousandsSeparator) {
                                                    continue;
                                                } else
                                                    if (znak == options.decimalSeparator) {
                                                        if (decsep++) {
                                                            return digits <= maxDigits;
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
                                        var opt = getOptions();
                                        var sval = fcsaHelper.toNumber(val, opt.decimalSeparator,
                                                opt.thousandsSeparator);
                                        number = Number(sval);
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
                                    wholeNumbers = wholeNumbers.replace(/(\-?)(0*)(\d+?)(\.(\d*))?$/, '$1$3$4');
                                    commas = wholeNumbers.replace(new RegExp('(\\d)(?=(\\d{3})+(?!\\d))', 'g'), '$1'
                                            + thouSep);
                                    var ret = "" + commas + decimals;
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
                                            var options = getOptions();
                                            if (options.prepend != null) {
                                                val = val.replace(options.prepend, '');
                                            }
                                            if (options.append != null) {
                                                val = val.replace(options.append, '');
                                            }
                                            if (!options.keepThousandsOnInput && val) {
                                                val = val.replace(new RegExp("\\" + options.thousandsSeparator, "g"),
                                                        '');
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
            if (n.length == 1) {
                var nc = n.charCodeAt(0);
                if (nc > 127) {
                    n = String.fromCharCode(nc - 128);
                }
            } else {
                console.log('WARNING: auto detection of decimal separator failed, current: ' + n);
            }
            return n;
        }
        whatThousandsSeparator = function() {
            var n = 1111;
            n = n.toLocaleString();
            var regex = new RegExp("^1(.+)111(\\" + whatDecimalSeparator() + "\\d*)?$");
            n = n && regex.exec(n);
            n = n ? n[1] : ",";
            if (n.length == 1) {
                var nc = n.charCodeAt(0);
                if (nc > 127) {
                    n = String.fromCharCode(nc - 128);
                }
            } else {
                console.log('WARNING: auto detection of thousands separator failed, current: ' + n);
            }
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
