import { UniteguiPage } from './app.po';

describe('unitegui App', () => {
  let page: UniteguiPage;

  beforeEach(() => {
    page = new UniteguiPage();
  });

  it('should display message saying app works', async () => {
    await page.navigateTo();

    let text = await page.getParagraphText();
    expect(text).toEqual('app works!');
  });
});
