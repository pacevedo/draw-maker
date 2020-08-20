import shuffle from '../shuffle'
import Util from '../util'

const GroupsService = {
  /**
   * Returns an array of arrays with the teams drawed in groups
   */
  pureDraw: (teams, numTeamsByGroup, numGroups) => {
    const teamsShuffled = shuffle(teams)
    let teamsDrew = []
    // If there are the same number of teams on each group, we build the array
    if (numTeamsByGroup.length === 0) {
      const teamsByGroup = teams.length / numGroups
      numTeamsByGroup = Array.from({ length: numGroups }, (v, i) => teamsByGroup)
    }
    // Create the array for each group
    let init = 0
    numTeamsByGroup.forEach(numTeams => {
      teamsDrew = [...teamsDrew, teamsShuffled.slice(init, init + (numTeams * 1))]
      init += (numTeams * 1)
    })
    return teamsDrew
  },
  pottedDraw: (teams, numTeamsByGroup, numGroups, numPots) => {
    const groups = GroupsService.initGroups(numGroups)
    let pottedIndexes = []
    let indexGroup = 0
    // Draw the potted teams
    for (let i = 1; i <= numPots; i++) {
      const indexes = GroupsService.getIndexTeamsByPot(i, numGroups)
      const indexesShuffled = shuffle(indexes)
      indexGroup = 0
      for (const index of indexesShuffled) {
        if (indexGroup < groups.length) {
          groups[indexGroup].push(teams[index] + ' (' + i + ')')
          indexGroup++
        }
      }
      pottedIndexes = [...pottedIndexes, ...indexes]
    }
    // Draw the unpotted teams
    const unpottedIndexes = Util.difference([...teams.keys()], pottedIndexes)
    if (unpottedIndexes.length > 0) {
      const unpottedIndexesShuffled = shuffle(unpottedIndexes)
      if (teams.length % numGroups === 0) {
        numTeamsByGroup = GroupsService.initNumTeamsByGroup(teams.length, numGroups)
      }
      indexGroup = 0
      for (const index of unpottedIndexesShuffled) {
        const numTeamsCurrentGroup = numTeamsByGroup[indexGroup + 1] * 1
        if (indexGroup < numGroups && groups[indexGroup].length < numTeamsCurrentGroup) {
          groups[indexGroup].push(teams[index])
          if (groups[indexGroup].length === numTeamsCurrentGroup) {
            indexGroup++
          }
        }
      }
    }
    return groups
  },
  initGroups (numGroups) {
    const groups = []
    for (let i = 0; i < numGroups; i++) {
      groups[i] = []
    }
    return groups
  },
  initNumTeamsByGroup (numTeams, numGroups) {
    const numTeamsByGroup = []
    const groupSize = parseInt(numTeams / numGroups)
    for (let i = 1; i <= numGroups; i++) {
      numTeamsByGroup[i] = groupSize
    }
    return numTeamsByGroup
  },
  getIndexTeamsByPot (pot, numGroups) {
    const initIndex = (pot - 1) * numGroups
    return Array.from({ length: numGroups }, (v, i) => i + initIndex)
  }
}

export default GroupsService
