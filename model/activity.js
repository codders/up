const activities = [
  {
    icon: 'directions_run',
    title: 'Move',
    id: 'move',
    description: 'Dance, run, do sport'
  },
  {
    icon: 'home',
    title: 'Relax',
    id: 'relax',
    description: 'Hang out, cuddle, massage, sleep'
  },
  {
    icon: 'local_bar',
    title: 'Go out',
    id: 'out',
    description: 'Eating out, cinema, events'
  },
  {
    icon: 'whatshot',
    title: 'Play',
    id: 'play',
    description: 'Enjoy each other'
  }
]

export const activityArrayToString = function(activities) {
  let description = ''
  const activityTexts = []
  activities.map(function(key) {
    activityTexts.push(getActivityName(key))
  })
  while (activityTexts.length > 2) {
    const next = activityTexts.shift()
    description = description + next + ', '
  }
  return description + activityTexts.join(' or ')
}

export const getActivityName = function(id) {
  const foundActivity = activities.find(function(activity) {
    return activity.id === id
  })
  if (foundActivity != null) {
    return foundActivity.title
  }
  return undefined
}

export default activities
