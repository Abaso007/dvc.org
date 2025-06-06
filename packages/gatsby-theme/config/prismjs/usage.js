/* eslint-env node */

const Prism = require('prismjs')

const cml = require('./cml-commands')
const dvc = require('./dvc-commands')
const gto = require('./gto-commands')
const mlem = require('./mlem-commands')

Prism.languages.usage = {
  dvc: {
    pattern: new RegExp(`dvc (?:${dvc.join('|')})`)
  },
  cml: {
    pattern: new RegExp(`cml (?:${cml.join('|')})`)
  },
  mlem: {
    pattern: new RegExp(`mlem (?:${mlem.join('|')})`)
  },
  gto: {
    pattern: new RegExp(`gto (?:${gto.join('|')})`)
  },
  usage: {
    pattern:
      /(^|\n)\s*(usage|arguments|positional arguments|optional arguments)/
  },
  args: {
    pattern: /(?<=\[)(?:[^\][]+|\[(?:[^\][]+|\[[^\][]*\])*\])*(?=\])/,
    inside: {
      arg: {
        pattern: /-{1,2}[^|]*/
      }
    }
  }
}
