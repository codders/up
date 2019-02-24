const activities = [
  {
    icon: 'directions_run',
    title: 'Move',
    id: 'move',
    description: 'Dance, run, do sport'
  },
  {
    icon: 'airline_seat_individual_suite',
    title: 'Relax',
    id: 'relax',
    description: 'Hang out, cuddle, massage, sleep'
  },
  {
    icon: 'local_dining',
    title: 'Eat',
    id: 'eat',
    description: 'Go have dinner somewhere'
  },
  {
    icon: 'whatshot',
    title: 'Play',
    id: 'play',
    description: 'Seduce, arouse, be intimate'
  }
]

export const getActivityName = function(id) {
  return activities.find(function(activity) {
    return activity.id === id
  }).title
}

export default activities
