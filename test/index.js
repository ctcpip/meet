'use strict'

/* global Temporal */

const { suite, test } = require('mocha')
const assert = require('assert')
const polyfill = require('@js-temporal/polyfill')
global.Temporal = polyfill.Temporal
const pkg = require('../package.json')
const { convert, templates } = require('../lib/conversions')
const meetings = require('../lib/meetings')

suite(`${pkg.name} unit`, () => {
  test('process schedule', () => {
    const next = meetings.getNextScheduledMeeting([
      // 5pm GMT April 2 for a period of 28 days
      '2020-04-02T17:00:00.0Z/P28D',

      // 1pm GMT April 16 for a period of 28 days
      '2020-04-16T13:00:00.0Z/P28D'
    ], Temporal.Instant.from('2020-04-03T13:00:00.0Z'))

    assert.deepStrictEqual(next.toString(), Temporal.Instant.from('2020-04-16T13:00:00.0Z').toString())
  })
})

test('shorthands transform', async () => {
  templates.values.title = 'Test Meeting'
  templates.values.agendaLabel = 'meeting-agenda'
  templates.values.invitees = '@pkgjs/meet'
  templates.values.observers = '@nodejs/package-maintenance'

  const input = `# <!-- title -->
<!-- agenda label -->
<!-- invitees -->
<!-- observers  -->`

  const output = `# Test Meeting
meeting-agenda
@pkgjs/meet
@nodejs/package-maintenance`

  assert.equal(await convert(input), output)
})
