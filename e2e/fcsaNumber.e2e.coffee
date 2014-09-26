describe 'fcsaNumber', ->

  describe 'on blur', ->
    it 'adds the thousand separator', ->
      input = element(By.model('amount'))
      input.clear()
      input.sendKeys '1000\t'
      expect(input.getAttribute('value')).toBe '1,000'

    it 'does not add commas to the decimal portion', ->
      input = element(By.model('amount'))
      input.clear()
      input.sendKeys '1234.5678\t'
      expect(input.getAttribute('value')).toBe '1,234.5678'

  it 'removes the thousand separators on focus', ->
    input = element(By.model('amount'))
    input.clear()
    input.sendKeys '1000\t'
    input.click()

    expect(input.getAttribute('value')).toBe '1000'
