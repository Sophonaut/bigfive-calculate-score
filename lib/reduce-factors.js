const percentiles = require('../data/ocean-dist.json')

const calculateResultDefault = (score, count) => {
  const average = calculateAverage(score, count)
  let result = 'neutral'
  if (average > 3) {
    result = 'high'
  } else if (average < 3) {
    result = 'low'
  }
  return result
}

const calculateAverage = (score, count) => {
  return score / count
}

const calculatePercentile = (domain, average) => {
  let ranges = Object.keys(percentiles[domain])
  ranges = ranges.map(parseFloat).sort()
  const closestNum = ranges.reduce((n, m) => (Math.abs(m - average) < Math.abs(n - average)) ? m : n)
  const range = percentiles[domain][closestNum]
  if (range.length === 1) {
    return range
  } else {
    return [range[0], range[range.length - 1]]
  }
}

module.exports = options => {
  const calculateResult = options.calculateResult || calculateResultDefault

  const reduceFactors = (a, b) => {
    if (!a[b.domain]) {
      a[b.domain] = { score: 0, count: 0, result: 'neutral', facet: {} }
    }

    a[b.domain].score += parseInt(b.score || 0, 10)
    a[b.domain].count += 1
    a[b.domain].result = calculateResult(a[b.domain].score, a[b.domain].count)
    const average = calculateAverage(a[b.domain].score, a[b.domain].count)
    a[b.domain].average = average
    a[b.domain].percentile = calculatePercentile(b.domain, average)

    if (b.facet) {
      if (!a[b.domain].facet[b.facet]) {
        a[b.domain].facet[b.facet] = { score: 0, count: 0, result: 'neutral' }
      }
      a[b.domain].facet[b.facet].score += parseInt(b.score || 0, 10)
      a[b.domain].facet[b.facet].count += 1
      a[b.domain].facet[b.facet].result = calculateResult(a[b.domain].facet[b.facet].score, a[b.domain].facet[b.facet].count)
    }

    return a
  }

  return options.answers.reduce(reduceFactors, {})
}
