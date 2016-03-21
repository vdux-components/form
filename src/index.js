/**
 * Imports
 */

import serialize from '@f/serialize-form'
import identity from '@f/identity'
import element from 'vdux/element'
import noop from '@f/noop'

/**
 * Constants
 */

const defaultValidate = () => ({valid: true})

/**
 * Form component
 */

function render ({props, children}) {
  const {onSubmit = noop, validate = defaultValidate, cast = identity, loading = false} = props

  return (
    <form no-validate onSubmit={handleSubmit} onChange={handleChange}>
      {children}
    </form>
  )

  function handleSubmit (e) {
    e.preventDefault()

    const form = e.target
    const model = cast(serialize(form))
    const valid = checkValidity(form, model)

    if (!loading && valid) {
      return onSubmit(model, (res, err) => err && invalidate(form, err))
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

/**
 * Exports
 */

export default {
  render
}
