import { IndexPo } from '../support/index.po';

describe('Index page', () => {
  const index = new IndexPo();

  beforeEach(() => index.navigateTo());

  it('should contain ivy enabled text', () => {
    cy.get('span.ivy-enabled')
      .invoke('text')
      .should('contain', 'Ivy is enabled in this application');
  });

  it('should contain counter h2', () => {
    cy.get('h2.counter')
      .invoke('text')
      .should('contain', 'Counter is 0');
  });

  it('should increment counter on the button click', () => {
    cy.get('button.increment')
      .click()
      .click()
      .click()
      .get('h2.counter')
      .invoke('text')
      .should('contain', 'Counter is 3');
  });
});
