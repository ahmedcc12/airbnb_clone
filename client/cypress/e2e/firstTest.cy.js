describe('Register Page', () => {

  it('should handle registration failure for existing email', () => {
    // Use the same email from the successful registration test
    const name = 'John Doe';
    const email = `test@test.com`; // Use the same unique email
    const password = 'testpassword';

    cy.visit('/register');

    // Fill in the registration form using custom command
    cy.fillRegistrationForm(name, email, password);
    cy.get('button.primary').click();

    // Assert that the registration failed
    cy.contains('Registration failed. Please try again later', { timeout: 2000 }).should('be.visible');
  });

  it('should register a new user successfully and redirect to login page', () => {
    const name = 'John Doe';
    const email = `test${Date.now()}@example.com`; // Use a unique email
    const password = 'testpassword';

    cy.visit('/register');

    // Fill in the registration form using custom command
    cy.fillRegistrationForm(name, email, password);
    cy.get('button.primary').click();

    cy.url().should('include', '/login');
  });
  Cypress.Commands.add('fillRegistrationForm', (name, email, password) => {
    cy.get('input[placeholder="John Doe"]').type(name);
    cy.get('input[placeholder="your@email.com"]').type(email);
    cy.get('input[placeholder="password"]').type(password);
    // Add a delay to ensure that the toast message has time to appear
    cy.wait(1000);
  });
});

describe('Login Page', () => {

  it('should login successfully with an existing account', () => {
    // Use valid credentials or create a test user for this test
    const email = 'existing@example.com';
    const password = 'validpassword';

    // Visit the login page
    cy.visit('/login');

    // Fill in the login form with valid credentials
    cy.get('input[placeholder="your@email.com"]').type(email);
    cy.get('input[placeholder="password"]').type(password);
    cy.get('button.primary').click();

    // Assert that the login was successful
    cy.url().should('include', '/');
  });
});

describe('Index Page', () => {
  beforeEach(() => {
    // Assuming you have a backend server running and seeding data for testing
    cy.visit('/');
  });

  it('should display a list of places on the page', () => {
    cy.get('.grid').should('exist');
  
    // Wait for places to be loaded (adjust the wait time as needed)
    cy.wait(2000);
  
    // Check for loading indicators and wait for them to disappear (if applicable)
  
    // Retry the assertion after waiting
    cy.get('.grid [data-cy="place"]').should('have.length.greaterThan', 0);
  });
  
  
  it('should navigate to place details when a place is clicked', () => {
    // Click on the first place in the list
    cy.get('.grid [data-cy="place"]').first().click();

    // Ensure the URL changes to the place details page
    cy.url().should('match', /\/place\/\w+/);
  });

});


