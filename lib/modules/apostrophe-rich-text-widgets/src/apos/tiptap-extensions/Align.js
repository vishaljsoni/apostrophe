import { Node } from 'tiptap';
import {
  setBlockType
} from 'tiptap-commands';

export default class Align extends Node {

  get name() {
    return 'align';
  }

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

  commands({ type, schema }) {
    return attrs => {
      console.log(attrs);
      // if (attrs.tag === 'p') {
      //   type = schema.nodes.paragraph;
      // }
      return setBlockType(type, {
        class: null,
        ...attrs
      });
    };
  }

  // keys({ type }) {
  //   return this.options.levels.reduce((items, level) => ({
  //     ...items,
  //     ...{
  //       [`Shift-Ctrl-${level}`]: setBlockType(type, { level }),
  //     },
  //   }), {})
  // }

  // inputRules({ type }) {
  //   return this.options.levels.map(level => textblockTypeInputRule(
  //     new RegExp(`^(#{1,${level}})\\s$`),
  //     type,
  //     () => ({ level }),
  //   ))
  // }

}
