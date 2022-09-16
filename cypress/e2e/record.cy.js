it('records this test', () => {
  cy.visit('/')
  /* ==== Generated with Cypress Studio ==== */
  cy.get('[data-testid="ContactName"]').type('Test Username')
  cy.get('[data-testid="ContactEmail"]').type('test@email.com')
  cy.get('[data-testid="ContactPhone"]').type('123-456-7890')
  cy.get('[data-testid="ContactSubject"]').type('This is recorded test subject')
  cy.get('[data-testid="ContactDescription"]').type(
    'So much text here and here and here',
  )
  cy.get('#submitContact').click()

  // Axios rejects a promise after checking auth route right away
  cy.on('uncaught:exception', () => false)
  cy.get('[href="/#/admin"]').click()
  cy.get('[data-testid="username"]').type('admin')
  cy.get('[data-testid="password"]').type('password')
  cy.get('[data-testid="submit"]').click()
  cy.get('.nav-link > .fa').click()
  cy.get('.row.detail').should('have.length.greaterThan', 0)
  cy.contains(
    '[id^="message"].read-false',
    'This is recorded test subject',
  ).click()
  cy.contains('button', 'Close').click()
  /* ==== End Cypress Studio ==== */
})
