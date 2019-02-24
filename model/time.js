const times = [
  {
    title: 'Now',
    delay: 0,
    relative: 'Now',
    id: 'now'
  },
  {
    title: '1h',
    delay: 60,
    relative: 'in 1 hour',
    id: 'h1'
  },
  {
    title: '2h',
    delay: 120,
    relative: 'in 2 hours',
    id: 'h2'
  },
  {
    title: '4h',
    delay: 240,
    relative: 'in 4 hours',
    id: 'h4'
  },
  {
    title: 'Tonight',
    delay: 360,
    relative: 'tonight',
    id: 'tonight'
  }
]

export const getRelativeTimeDescription = function(id) {
  return times.find(function(element) {
    return element.id === id
  }).relative
}

export default times
