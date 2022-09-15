it('sends a message successfully', () => {
  const name = 'Test Cy User'
  const email = 'email@email.com'
  const phone = '123-456-7890'
  const subject = `Test Cy message ${Cypress._.random(1e5)}`
  const body = Cypress._.repeat('message body ', 5)

  cy.visit('/')
  cy.get('.row.contact form').within(() => {
    cy.get('[data-testid="ContactName"]').type(name)
    cy.get('[data-testid="ContactEmail"]').type(email)
    cy.get('[data-testid="ContactPhone"]').type(phone)
    cy.get('[data-testid="ContactSubject"]').type(subject)
    cy.get('[data-testid="ContactDescription"]').type(body)
    cy.get('#submitContact').click()
  })
  // the form was submitted
  cy.log('**checking messages**')

  // Axios rejects a promise after checking auth route right away
  cy.on('uncaught:exception', () => false)
  cy.visit('/#/admin')
  cy.get('[data-testid="username"]').type(Cypress.env('username'))
  cy.get('[data-testid="password"]').type(Cypress.env('password'), {
    log: false,
  })
  cy.get('[data-testid="submit"]').click()
  cy.contains('.navbar', 'B&B Booking Management')
    .should('be.visible')
    .find('a[href="#/admin/messages"]')
    .click()
  cy.location('hash').should('equal', '#/admin/messages')
  cy.get('.row.detail')
    .should('have.length.greaterThan', 0)
    .contains('.row', subject)
    .should('have.class', 'read-false')
    .click()
  cy.contains('.message-modal', subject)
    .should('be.visible')
    .and('include.text', name)
    .and('include.text', phone)
    .and('include.text', email)
    .and('include.text', subject)
    .and('include.text', body)
    .contains('button', 'Close')
    .click()
  cy.contains('.message-modal', subject).should('not.exist')
  cy.contains('.row.detail', subject)
    .should('have.class', 'read-true')
    .and('not.have.class', 'read-false')
})
