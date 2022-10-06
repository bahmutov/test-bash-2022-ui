Cypress.Commands.add('got', (testid) => {
  return cy.get(`[data-testid="${testid}"]`)
})

it('sends a message successfully', () => {
  const name = 'Test Cy User'
  const email = 'email@email.com'
  const phone = '123-456-7890'
  const subject = `Test Cy message ${Cypress._.random(1e5)}`
  const description = Cypress._.repeat('message body ', 5)

  cy.visit('/')

  cy.intercept('POST', '/message/').as('message')
  cy.get('.row.contact form').within(() => {
    cy.got('ContactName').type(name)
    cy.got('ContactEmail').type(email)
    cy.got('ContactPhone').type(phone)
    cy.got('ContactSubject').type(subject)
    cy.got('ContactDescription').type(description)
    cy.get('#submitContact').click()
  })

  const message = {
    description,
    email,
    name,
    phone,
    subject,
  }
  cy.wait('@message').its('request.body').should('deep.equal', message)
  cy.get('@message')
    .its('response.body')
    .should('deep.include', message)
    .and('have.property', 'messageid')
    .should('be.a', 'number')
})

it('can log in using UI', () => {
  // Axios rejects a promise after checking auth route right away
  cy.on('uncaught:exception', () => false)
  cy.visit('/#/admin')
  cy.got('username').type(Cypress.env('username'))
  cy.got('password').type(Cypress.env('password'), {
    log: false,
  })
  cy.got('submit').click()
  cy.contains('a', 'Logout').should('be.visible')

  cy.contains('.navbar', 'B&B Booking Management')
    .should('be.visible')
    .find('a[href="#/admin/messages"]')
    .click()
  cy.location('hash').should('equal', '#/admin/messages')
})

it.only('can log in using API call', () => {
  cy.request('POST', '/auth/login', {
    username: Cypress.env('username'),
    password: Cypress.env('password'),
  })
  cy.visit('/#/admin/messages')
  cy.contains('a', 'Logout').should('be.visible').scrollIntoView()
})

it('views the message', () => {
  const name = 'Test Cy User'
  const email = 'email@email.com'
  const phone = '123-456-7890'
  const subject = `Test Cy message ${Cypress._.random(1e5)}`
  const description = Cypress._.repeat('message body ', 5)
  const message = {
    description,
    email,
    name,
    phone,
    subject,
  }
  cy.request('POST', '/message/', message).its('status').should('equal', 201)

  cy.request('POST', '/auth/login', {
    username: Cypress.env('username'),
    password: Cypress.env('password'),
  })
  cy.visit('/#/admin/messages')

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
    .and('include.text', description)
    .contains('button', 'Close')
    .click()
  cy.contains('.message-modal', subject).should('not.exist')
  cy.contains('.row.detail', subject)
    .should('have.class', 'read-true')
    .and('not.have.class', 'read-false')
})
