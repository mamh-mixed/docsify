import {
  removeAtag,
  getAndRemoveConfig,
  getAndRemoveDocisfyIgnoreConfig,
} from '../../src/core/render/utils.js';
import { tree } from '../../src/core/render/tpl.js';
import { slugify } from '../../src/core/render/slugify.js';

// Suite
// -----------------------------------------------------------------------------
describe('core/render/utils', () => {
  // removeAtag()
  // ---------------------------------------------------------------------------
  describe('removeAtag()', () => {
    test('removeAtag from a link', () => {
      const result = removeAtag('<a href="www.example.com">content</a>');

      expect(result).toBe('content');
    });
  });

  // getAndRemoveDocisfyIgnorConfig()
  // ---------------------------------------------------------------------------
  describe('getAndRemoveDocisfyIgnorConfig()', () => {
    test('getAndRemoveDocisfyIgnorConfig from <!-- {docsify-ignore} -->', () => {
      const { content, ignoreAllSubs, ignoreSubHeading } =
        getAndRemoveDocisfyIgnoreConfig(
          'My Ignore Title<!-- {docsify-ignore} -->',
        );
      expect(content).toBe('My Ignore Title');
      expect(ignoreSubHeading).toBeTruthy();
      expect(ignoreAllSubs === undefined).toBeTruthy();
    });

    test('getAndRemoveDocisfyIgnorConfig from <!-- {docsify-ignore-all} -->', () => {
      const { content, ignoreAllSubs, ignoreSubHeading } =
        getAndRemoveDocisfyIgnoreConfig(
          'My Ignore Title<!-- {docsify-ignore-all} -->',
        );
      expect(content).toBe('My Ignore Title');
      expect(ignoreAllSubs).toBeTruthy();
      expect(ignoreSubHeading === undefined).toBeTruthy();
    });

    test('getAndRemoveDocisfyIgnorConfig from {docsify-ignore}', () => {
      const { content, ignoreAllSubs, ignoreSubHeading } =
        getAndRemoveDocisfyIgnoreConfig('My Ignore Title{docsify-ignore}');
      expect(content).toBe('My Ignore Title');
      expect(ignoreSubHeading).toBeTruthy();
      expect(ignoreAllSubs === undefined).toBeTruthy();
    });

    test('getAndRemoveDocisfyIgnorConfig from {docsify-ignore-all}', () => {
      const { content, ignoreAllSubs, ignoreSubHeading } =
        getAndRemoveDocisfyIgnoreConfig('My Ignore Title{docsify-ignore-all}');
      expect(content).toBe('My Ignore Title');
      expect(ignoreAllSubs).toBeTruthy();
      expect(ignoreSubHeading === undefined).toBeTruthy();
    });
  });

  // getAndRemoveConfig()
  // ---------------------------------------------------------------------------
  describe('getAndRemoveConfig()', () => {
    test('parse simple config', () => {
      const result = getAndRemoveConfig(
        "[filename](_media/example.md ':include')",
      );

      expect(result).toMatchObject({
        config: {},
        str: "[filename](_media/example.md ':include')",
      });
    });

    test('parse config with arguments', () => {
      const result = getAndRemoveConfig(
        "[filename](_media/example.md ':include :foo=bar :baz test')",
      );

      expect(result).toMatchObject({
        config: {
          foo: 'bar',
          baz: true,
        },
        str: "[filename](_media/example.md ':include test')",
      });
    });

    test('parse config with double quotes', () => {
      const result = getAndRemoveConfig(
        '[filename](_media/example.md ":include")',
      );

      expect(result).toMatchObject({
        config: {},
        str: '[filename](_media/example.md ":include")',
      });
    });
  });
});

describe('core/render/tpl', () => {
  test('remove html tag in tree', () => {
    const result = tree([
      {
        level: 2,
        slug: '#/cover?id=basic-usage',
        title: '<span style="color:red">Basic usage</span>',
      },
      {
        level: 2,
        slug: '#/cover?id=custom-background',
        title: 'Custom background',
      },
      {
        level: 2,
        slug: '#/cover?id=test',
        title:
          '<img src="/docs/_media/favicon.ico" data-origin="/_media/favicon.ico" alt="ico">Test',
      },
    ]);

    expect(result).toBe(
      /* html */ '<ul class="app-sub-sidebar"><li><a class="section-link" href="#/cover?id=basic-usage" title="Basic usage"><span style="color:red">Basic usage</span></a></li><li><a class="section-link" href="#/cover?id=custom-background" title="Custom background">Custom background</a></li><li><a class="section-link" href="#/cover?id=test" title="Test"><img src="/docs/_media/favicon.ico" data-origin="/_media/favicon.ico" alt="ico">Test</a></li></ul>',
    );
  });
});

describe('core/render/slugify', () => {
  test('slugify()', () => {
    const result = slugify(
      'Bla bla bla <svg aria-label="broken" class="broken" viewPort="0 0 1 1"><circle cx="0.5" cy="0.5"/></svg>',
    );
    const result2 = slugify(
      'Another <span style="font-size: 1.2em" class="foo bar baz">broken <span class="aaa">example</span></span>',
    );
    expect(result).toBe('bla-bla-bla-');
    expect(result2).toBe('another-broken-example');
  });
});
