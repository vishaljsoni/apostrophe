import { Node } from 'tiptap';
import {
  setBlockType
} from 'tiptap-commands';

export default class Align extends Node {

  get name() {
    return 'align';
  }


  // TODO:
  // Need to be able to dynamically set "tag"
  // in toDom() to match the target tag of node(s)
  get schema() {
    return {
      attrs: {
        tag: {
          default: 'p'
        },
        textAlign: {
          default: 'left'
        }
      },
      content: 'inline*',
      group: 'block',
      defining: true,
      draggable: false,
      parseDOM: this.options.styles.map(style => {
        return {
          tag: style.tag,
          attrs: {
            tag: style.tag,
            class: style.class
          }
        };
      }),
      toDOM: node => {
        return [node.attrs.tag, {
          style: `text-align: ${node.attrs.textAlign}`
        }, 0];
      }
    };
  }
  commands({ type, attrs }) {
    return setBlockType(type, attrs);
  }
}
