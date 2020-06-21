import { Story } from 'playwright-fluent';

export const openReactstrapWebsite: Story = async (p) => {
  const url = 'https://reactstrap.github.io';
  await p
    .withBrowser('chromium')
    .withCursor()
    .withOptions({ headless: false })
    .emulateDevice('iPhone 11 landscape')
    .navigateTo(url);
};

export const openComponentsPage: Story = async (p) => {
  // prettier-ignore
  const componentsButton = p
    .selector('div.container')
    .find('a')
    .withText('Components')
    .nth(2);

  await p.click(componentsButton);
};

export const openFormComponent: Story = async (p) => {
  // prettier-ignore
  const formComponent = p
    .selector('div.docs-sidebar')
    .find('li')
    .withText('Form');

  await p.click(formComponent);
};
