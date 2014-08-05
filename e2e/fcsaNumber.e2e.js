(function() {
  describe('fcsaNumber', function() {
    it('adds the thousand separator on blur', function() {
      var input;
      input = element(By.model('amount'));
      input.clear();
      input.sendKeys('1000\t');
      return expect(input.getAttribute('value')).toBe('1,000');
    });
    return it('removes the thousand separators on focus', function() {
      var input;
      input = element(By.model('amount'));
      input.clear();
      input.sendKeys('1000\t');
      input.click();
      return expect(input.getAttribute('value')).toBe('1000');
    });
  });

}).call(this);
