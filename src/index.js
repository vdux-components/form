/**
 * Imports
 */

import serialize from '@f/serialize-form'
import identity from '@f/identity'
import element from 'vdux/element'
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

function render ({props, children}) {
  const {
    onSubmit = noop, onSuccess = noop, onFailure = noop, validate = defaultValidate,
    cast = identity, transformError = defaultTransformError, loading = false, ...rest
  } = props

  return (
    <Base tag='form' novalidate onSubmit={handleSubmit} onChange={handleChange} {...rest}>
      {children}
    </Base>
  )

  function *handleSubmit (e) {
    e.preventDefault()

    const form = e.target
    const model = cast(serialize(form))
    const valid = checkValidity(form, model)

    if (!loading && valid) {
      try {
        const result = yield onSubmit(model)
        yield onSuccess(result)
      } catch (err) {
        yield onFailure(err)

        const newErr = transformError(err)
        if (newErr) invalidate(form, newErr)
      }
    }
  }

  function handleChange (e) {
    const {name, form} = e.target
    checkValidity(form, cast(serialize(form)), name)
  }

  function checkValidity (form, model, name) {
    const {valid, errors} = validate(model, name)

    if (!valid) {
      invalidate(form, errors, name)
    }

    return valid
  }

  function invalidate (form, errors, name) {
    if (name) {
      errors = errors.filter(({field}) => field === name)
    }

    errors.forEach(({field, message}) => {
      const ctrl = form.querySelector(`[name="${field}"]`)

      if (ctrl) {
        ctrl.setCustomValidity(message)
        ctrl.checkValidity()
      }
    })
  }
}

function setTransformError (transformError) {
  defaultTransformError = transformError
}

/**
 * Exports
 */

export default {
  render,
  setTransformError
}
