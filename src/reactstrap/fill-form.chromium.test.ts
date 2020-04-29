import { PlaywrightFluent } from 'playwright-fluent';
describe('Selector API - Fill a form', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(60000);
    p = new PlaywrightFluent();
  });
  afterEach(
    async (): Promise<void> => {
      await p.close();
    },
  );

  test('should fill form', async (): Promise<void> => {
    // Given I open The ReactStrap demo site
    const url = 'https://reactstrap.github.io';
    await p
      .withBrowser('chromium')
      .withCursor()
      .withOptions({ headless: false })
      .emulateDevice('iPhone 11 landscape')
      .navigateTo(url);

    // When I open the Components page

    const componentsButton = p
      .selector('div.container')
      .find('a')
      .withText('Components')
      .nth(2);

    await p.click(componentsButton);

    // And I open the Form Component
    const formComponent = p
      .selector('div.docs-sidebar')
      .find('li')
      .withText('Form');

    await p.click(formComponent);

    // And I fill the Form
    const formContainer = p
      .selector('div.docs-example')
      .nth(1)
      .find('form');

    await p
      .click(formContainer.find('label').withText('Email'))
      .typeText('foo@bar.com')
      .pressKey('Tab')
      .typeText("don't tell!!")
      .pressKey('Tab')
      .select('3')
      .in(formContainer.find('select'))
      .pressKey('Tab')
      .select('1', '3', '5')
      .in(formContainer.find('select').nth(2))
      .click(formContainer.find('label').withText('Text Area'))
      .typeText('bla bla bla')
      .click(formContainer.find('label').withText('Option two'))
      .click(formContainer.find('label').withText('Check me out'))
      .expectThatSelector(
        formContainer
          .find('label')
          .withText('Check me out')
          .find('input'),
      )
      .isChecked()
      .click(formContainer.find('button').withText('Submit'));

    // Then
    expect(true).toBe(true);
  });
});
