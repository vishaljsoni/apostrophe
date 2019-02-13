import { Node } from 'tiptap';
import { toggleWrap } from 'tiptap-commands';

export default class Align extends Node {
  get name() {
    return 'align';
  }
  get schema() {
    return {
      attrs: {
        textAlign: {
          default: 'left'
        }
      },
      content: 'block*',
      group: 'block',
      defining: true,
      draggable: false,
      parseDOM: [{
        tag: 'div',
        getAttrs: node => ({
          textAlign: node.style.textAlign
        })
      }],
      toDOM: (node) => ['div', {
        style: `text-align: ${node.attrs.textAlign}` }, 0]
    };
  }

  commands({ type, attrs }) {
    return () => toggleWrap(type, attrs);
  }
}
