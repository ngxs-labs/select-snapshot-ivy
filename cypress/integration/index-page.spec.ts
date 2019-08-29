import { IndexPo } from '../support/index.po';

describe('Index page', () => {
  const index = new IndexPo();

  beforeEach(() => index.navigateTo());

  it('should contain ivy enabled text', () => {
    cy.get('h1')
      .invoke('text')
      .should('contain', 'Ivy enabled: true');
  });

  it('should contain pre element', () => {
    cy.get('pre')
      .invoke('text')
      .should('contain', '"counter": 0');
  });

  it('should increment counter on the button click', () => {
    cy.get('button')
      .click()
      .click()
      .click()
      .get('pre')
      .invoke('text')
      .should('contain', '"counter": 3');
  });
});
