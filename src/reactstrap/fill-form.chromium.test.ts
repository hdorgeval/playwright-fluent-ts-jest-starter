import { PlaywrightFluent, stringifyRequest, RequestInfo } from 'playwright-fluent';
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
      .recordRequestsTo('/components/form/?email')
      .navigateTo(url);

    // When I open the Components page

    // prettier-ignore
    const componentsButton = p
      .selector('div.container')
      .find('a')
      .withText('Components')
      .nth(2);

    await p.click(componentsButton);

    // And I open the Form Component

    // prettier-ignore
    const formComponent = p
      .selector('div.docs-sidebar')
      .find('li')
      .withText('Form');

    await p.click(formComponent);

    // And I fill the Form

    // prettier-ignore
    const formContainer = p
      .selector('div.docs-example')
      .nth(1)
      .find('form');

    const disabledOption = formContainer
      .find('label')
      .withText('Option three is disabled')
      .find('input');

    // prettier-ignore
    const checkMeOut = formContainer
      .find('label')
      .withText('Check me out')
      .find('input');

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
      .check(checkMeOut)
      .expectThatSelector(checkMeOut)
      .isChecked()
      .hover(disabledOption)
      .expectThatSelector(disabledOption)
      .isDisabled()
      .click(formContainer.find('button').withText('Submit'));

    // Then the form should be submitted with url:
    // https://reactstrap.github.io/components/form/?email=foo%40bar.com&password=don%27t+tell%21%21&select=3&selectMulti=1&selectMulti=3&selectMulti=5&text=bla+bla+bla&file=&radio1=on

    await p
      .expectThatAsyncFunc(
        async () => (await p.getRecordedRequestsTo('/components/form/?email')).length,
      )
      .resolvesTo(1);

    const submitRequest = p.getLastRecordedRequestTo('/components/form/?email');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const request = JSON.parse(await stringifyRequest(submitRequest!)) as RequestInfo;
    expect(request.url).toContain('email=foo%40bar.com');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(request.response!.status).toBe(200);
  });
});
