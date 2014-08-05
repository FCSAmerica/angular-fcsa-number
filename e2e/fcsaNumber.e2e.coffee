describe 'fcsaNumber', ->
  it 'adds the thousand separator on blur', ->
    input = element(By.model('amount'))
    input.clear()
    input.sendKeys '1000\t'
    expect(input.getAttribute('value')).toBe '1,000'

  it 'removes the thousand separators on focus', ->
    input = element(By.model('amount'))
    input.clear()
    input.sendKeys '1000\t'
    input.click()
    expect(input.getAttribute('value')).toBe '1000'
