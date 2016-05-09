
# form

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

vdux form component

## Installation

    $ npm install vdux-form

## Usage

## API - props

  * `onSubmit` - Handles a form submission. Receives the contents of the form, serialized to JSON, and casted by `cast` (if specified).
  * `validate` - Validate the JSON contents of the form. Blocks `onSubmit` if not valid. Refer to the validation section for more details.
  * `cast` - Before being validated you can transform the model with this. It should accept a model and return a new model.
  * `loading` - Whether or not the form is currently loading. If `true`, submits will be disabled. Defaults to false.
  * `transformError` - Transform an error response from your `onSubmit` function into a form that is consumable by `vdux-form`. A default can be specified using `setTransformError`.

## Validation

Your `validate` function should accept a model and return an object of the form:

`{valid: Boolean, errors: [Errors]}`

If `valid` is `false`, `errors` should include a list of invalid fields. Each `error` entry should have the form:

`{field, message}`

Where `field` is the `name` attribute of the form field that the `message` applies to. Your `message` will then be set on the appropriate field using [setCustomValidity](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/setCustomValidity). This will trigger an [invalid](https://developer.mozilla.org/en-US/docs/Web/Events/invalid) event on that form field, which you can capture on the input.


### Example

```javascript
import Form from 'vdux-form'

function render () {
  return (
    <Form validate={validate}>
      <input name='username' onInvalid={e => setError(e.target.validationMessage)} />
      {
        error && <span class='error'>{error}</span>
      }
    </Form>
  )
}

function validate ({username}) {
  if (username.length < 3) {
    return {
      valid: false,
      errors: [{field: 'username', message: 'Username must be at least 3 characters long'}]
    }
  }

  return {
    valid: true
  }
}
```

### Error handling

You can specify a default *transform* for your errors like this:

```javascript
import Form from 'vdux-form'

Form.setTransformError(err => ({
  if (err.status === 400) {
    return err.errors
  }
}))
```

## License

MIT
