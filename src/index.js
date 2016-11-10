/**
 * Imports
 */

import {preventDefault, decodeNode, component, element} from 'vdux'
import serialize from '@f/serialize-form'
import identity from '@f/identity'
import {Base} from 'vdux-ui'
import noop from '@f/noop'

/**
 * Constants
 */

const defaultValidate = () => ({valid: true})
let defaultTransformError = identity

/**
 * Form component
 */

export default component({
  render ({props, children, actions}) {

    return (
      <Base tag='form' novalidate {...props} onSubmit={[decodeNode(actions.handleSubmit), preventDefault]} onChange={decodeNode(actions.handleChange)}>
        {children}
      </Base>
    )
  },

  controller: {
    handleChange ({props}, {name, form}) {
      const {cast = identity, validate = defaultValidate} = props
      const model = cast(serialize(form))
      const {valid, errors} = validate(model, name)

      if (!valid) invalidate(form, errors, name)
    },

    * handleSubmit ({props}, form) {
      const {
        onSubmit = noop, onSuccess = noop, onFailure = noop, validate = defaultValidate,
        cast = identity, transformError = defaultTransformError, loading = false
      } = props

      const model = cast(serialize(form))
      const {valid, errors} = validate(model)

      if (!valid) invalidate(form, errors)

      if (!loading && valid) {
        const [result, err] = yield poss(onSubmit(model))

        if (err) {
          yield onFailure(err)

          const newErr = transformError(err)
          if (newErr) invalidate(form, newErr)
        } else {
          yield onSuccess(result)
        }
      }
    }
  },

  setTransformError (transformError) {
    defaultTransformError = transformError
  }
})

/**
 * Helpers
 */

function dotsToBrackets (str) {
  return str.split('.').map((part, idx) => idx === 0 ? part : '[' + part + ']').join('')
}

function * poss (gen) {
  try {
    return [yield gen, null]
  } catch (err) {
    return [null, err]
  }
}

function invalidate (form, errors, name) {
  if (name) {
    errors = errors.filter(({field}) => field === name)
  }

  errors.forEach(({field, message}) => {
    const ctrl = form.querySelector(`[name="${dotsToBrackets(field)}"]`)

    if (ctrl) {
      ctrl.setCustomValidity(message)
      ctrl.checkValidity()
    }
  })
}
