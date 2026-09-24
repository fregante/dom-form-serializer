import TypeRegistry from './TypeRegistry'

export default class InputWriters extends TypeRegistry {
  constructor (options) {
    super(options)
    this.resetArrayValueIndexes()
    this.registerDefault((el, value) => {
      const name = el.name ?? '';
      if (Array.isArray(value) && name.endsWith('[]')) {
        const index = this.arrayValueIndexes[name] || 0
        setInputValue(el, value[index])
        this.arrayValueIndexes[name] = index + 1
      } else {
        setInputValue(el, value)
      }
    })
    this.register('checkbox', (el, value) => {
      if (value === null) {
        el.indeterminate = true
      } else {
        el.checked = Array.isArray(value) ? value.indexOf(el.value) !== -1 : value
      }
    })
    this.register('radio', function (el, value) {
      if (value !== undefined) {
        el.checked = el.value === value.toString()
      }
    })
    this.register('select', setSelectValue)
  }

  resetArrayValueIndexes () {
    this.arrayValueIndexes = {}
  }
}

function setInputValue (el, value) {
  el.value = value ?? ''
}

function makeArray (arr) {
  const ret = []
  if (arr !== null) {
    if (Array.isArray(arr)) {
      ret.push.apply(ret, arr)
    } else {
      ret.push(arr)
    }
  }
  return ret
}

/**
 * Write select values
 *
 * @see {@link https://github.com/jquery/jquery/blob/master/src/attributes/val.js|Github}
 * @param {object} Select element
 * @param {string|array} Select value
 */
function setSelectValue (elem, value) {
  let optionSet, option
  const options = elem.options
  const values = makeArray(value)
  let i = options.length

  while (i--) {
    option = options[i]
    /* eslint-disable no-cond-assign */
    if (values.indexOf(option.value) > -1) {
      option.setAttribute('selected', true)
      optionSet = true
    }
    /* eslint-enable no-cond-assign */
  }

  // Force browsers to behave consistently when non-matching value is set
  if (!optionSet) {
    elem.selectedIndex = -1
  }
}
