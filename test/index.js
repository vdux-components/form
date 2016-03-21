/**
 * Imports
 */

import trigger from '@f/trigger-event'
import element from 'vdux/element'
import vdux from 'vdux/dom'
import Form from '../src'
import test from 'tape'

/**
 * Tests
 */

test('should work', t => {
  const {render, subscribe} = vdux()
  let node

  const stop = subscribe(() => {})
  node = render(
    <Form onSubmit={() => t.pass()} validate={validate} cast={cast}>
      <input name='username' value='test' />
    </Form>
  )

  t.plan(5)
  trigger(node, 'submit')
  t.end()
  stop()

  function cast (user) {
    t.equal(user.username, 'test')
    t.deepEqual(Object.keys(user), ['username'])

    return {
      name: user.username
    }
  }

  function validate (user) {
    t.equal(user.name, 'test')
    t.deepEqual(Object.keys(user), ['name'])

    return {
      valid: true
    }
  }
})

test('should invalidate fields', t => {
  const {subscribe, render} = vdux()
  let node

  const stop = subscribe(() => {})
  node = render(
    <Form onSubmit={() => t.fail()} validate={validate}>
      <input onInvalid={e => t.equal(e.target.validationMessage, 'username is invalid', 'validation message')} name='username' value='test' />
    </Form>
  )

  t.plan(1)
  trigger(node, 'submit')
  t.end()
  stop()

  function validate (user) {
    return {
      valid: false,
      errors: [
        {
          field: 'username',
          message: 'username is invalid'
        }
      ]
    }
  }
})

test('loading should block submits', t => {
  const {subscribe, render} = vdux()
  let node
  const stop = subscribe(() => {})

  node = render(<Form onSubmit={() => t.fail()} loading={true}></Form>)
  trigger(node, 'submit')

  t.end()
  stop()
})
