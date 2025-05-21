describe('functional login test', () => {
  const timestamp = Date.now();
  const email = `testuser${timestamp}@example.com`;
  const password = 'Azerty123!';

  before(() => {
    // Crée l'utilisateur en base via le formulaire d'inscription
    cy.visit('/register');
    cy.get('#firstname').type('Test');
    cy.get('#lastname').type('User');
    cy.get('#username').type(email);
    cy.get('#password').type(password);
    cy.get('#confirmPassword').type(password);
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/login');
  });

  it('doit afficher une erreur si email ou mot de passe est manquant', () => {
  cy.visit('/login');

  cy.get('#username').focus().blur();
  cy.get('#password').focus().blur();

  cy.contains("L'email est obligatoire.").should('exist');
  cy.contains('Le mot de passe est obligatoire.').should('exist');
});


  it('doit afficher une erreur si les identifiants sont incorrects', () => {
    cy.visit('/login');
    cy.get('#username').type('fake@example.com');
    cy.get('#password').type('Mauvais123!');
    cy.get('button[type="submit"]').click();
    cy.contains('Nom d\'utilisateur ou mot de passe incorrect').should('exist');
  });

  it('doit connecter l\'utilisateur avec des identifiants valides', () => {
    cy.visit('/login');
    cy.get('#username').type(email);
    cy.get('#password').type(password);
    cy.get('button[type="submit"]').click();

    cy.url().should('not.include', '/login');
  });

});

