import React from 'react';

const tagWhitelist = [
  'p',
  'span',
  'h1',
  'h2',
  'h3',
  'strong',
  'div',
  'ul',
  'li',
  'br',
  'a',
] as const;

type TranslationTag = typeof tagWhitelist[number];

interface TranslationItem {
  tag: TranslationTag;
  content: string | TranslationItem;
  linkProps?: {
    href?: string;
    target?: string;
    rel?: string;
  }
}

/**
 * Converts an array of translation items into the jsx representation.
 * The components are wrapped in a fragment
 * @param array An array of translation items
 */
export const translationArrayToJsx =
(array: Array<TranslationItem>): JSX.Element => {
  return (
    <React.Fragment>
      {
        array.map((item) => translationItemToJSX(item))
      }
    </React.Fragment>
  );
};

/**
 * Converts a translation item or string into it's jsx representation.
 * If the parameter is a string the string will just be returned.
 * If the parameter is an translation item and the tag is in the tag whitelist
 * a jsx component with given tag as html tag and the given content as content
 * of that jsx component. Nested translation items will
 * also be converted into jsx components.
 * @param item An translation item or a string
 */
export const translationItemToJSX =
(item:
  TranslationItem |
  Array<TranslationItem> |
  string |
  undefined): JSX.Element | string | undefined => {
  // If the given item is a string return the string
  if (typeof item === 'string') {
    return item;
  } else if (item === undefined) {
    return undefined;
  } else if (Array.isArray(item)) {
    return translationArrayToJsx(item);
  } else if (tagWhitelist.includes(item.tag) ) {
    // If the given item is an translation item, convert it to jsx
    // Get component for given tag
    const Component = item.tag;

    // Create the content. Needed for nested conversion
    const content = translationItemToJSX(item.content);

    const props = item.tag === 'a' ? item.linkProps : undefined;
    return (
      <Component {...props}>
        {content}
      </Component>
    );
  } else {
    throw new Error(`Given tag "${item.tag} is not allowed"`);
  };
};
