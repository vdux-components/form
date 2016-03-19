/**
 * Imports
 */

import test from 'tape'
import vdux from 'vdux/dom'
import element from 'vdux/element'
import Form from '../src'

/**
 * Tests
 */

test('should work', t => {
  const {render} = vdux()
  let node

  node = render(<Form></Form>)

  t.end()
})
