describe('functional registration test', () => {

  const timestamp = Date.now();
  const email = `testuser${timestamp}@example.com`;

  beforeEach(() => {
    cy.visit('/register');
  });

  it('doit afficher un message d\'erreur si on soumet sans remplir le formulaire', () => {
        cy.visit('/register');

        // Déclenche les erreurs de validation (touched)
        cy.get('#firstname').focus().blur();
        cy.get('#lastname').focus().blur();
        cy.get('#username').focus().blur();
        cy.get('#password').focus().blur();
        cy.get('#confirmPassword').focus().blur();

        // Soumet le formulaire
        cy.get('button[type="submit"]').click();

        // Vérifie les messages d'erreur
        cy.contains('Le prénom est obligatoire.').should('exist');
        cy.contains('Le nom est obligatoire.').should('exist');
        cy.contains('L\'email est obligatoire.').should('exist');
        cy.contains('Le mot de passe est obligatoire.').should('exist');
        cy.contains('La confirmation du mot de passe est obligatoire.').should('exist');
    });


  it('doit afficher une erreur si les mots de passe ne correspondent pas', () => {
        cy.visit('/register');
        cy.get('#firstname').type('Jean')
        cy.get('#lastname').type('Dupont');
        cy.get('#username').type(`testuser${Date.now()}@example.com`);
        cy.get('#password').type('Azerty123!');
        cy.get('#confirmPassword').type('Autre123!').blur();

        cy.get('button[type="submit"]').click();

        cy.contains('Les mots de passe ne correspondent pas.').should('exist');
    });

    it('doit inscrire l\'utilisateur avec des données valides', () => {
        cy.visit('/register');
        cy.get('#firstname').type('Jean');
        cy.get('#lastname').type('Dupont');
        cy.get('#username').type(email);
        cy.get('#password').type('Azerty123!');
        cy.get('#confirmPassword').type('Azerty123!');

        cy.get('button[type="submit"]').click();

        cy.url().should('include', '/login');

    });
  

});
