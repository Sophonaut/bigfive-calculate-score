'use strict'

const test = require('ava')
const calculateScore = require('../../index')
const percentileData = require('./data/percentile-test-results.json')
const expected = percentileData.data
const results = calculateScore({ answers: percentileData.answers })

test('validates results', t => {
  t.deepEqual(expected, results, 'returns expected result')
})
