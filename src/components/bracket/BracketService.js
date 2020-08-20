import shuffle from '../shuffle'
import Util from '../util'

const seededDraws = require('../../assets/seededDraws.json')

const BracketService = {
  pureDraw: (teams) => {
    teams = shuffle(teams)
    const sizeBracket = BracketService.getSizeBracket(teams.length)
    let numEmpties = sizeBracket - teams.length
    if (numEmpties > 0) {
      const seedDrawIndexes = BracketService.getSeedDrawIndexes(teams.length, numEmpties).map(element => element[0]).sort(Util.compare)
      for (const index of seedDrawIndexes) {
        if (numEmpties > 0) {
          const indexRival = BracketService.getIndexRival(index)
          teams.splice(indexRival, 0, '')
          numEmpties--
        }
      }
    }
    return teams
  },
  seededDraw: (teams, numSeeds) => {
    const teamsDrew = []
    const sizeBracket = BracketService.getSizeBracket(teams.length)
    let numEmpties = sizeBracket - teams.length
    const seededTeams = shuffle(teams.filter((item, index) => index < numSeeds))
    const unSeededTeams = shuffle(teams.filter((item, index) => index >= numSeeds))
    const seedDrawIndexes = BracketService.getSeedDrawIndexes(teams.length, seededTeams.length).map(element => element[0])
    let unSeedDrawIndexes = [...Array(sizeBracket).keys()]
    // Draw seeds
    for (let i = 0; i < seedDrawIndexes.length; i++) {
      teamsDrew[seedDrawIndexes[i]] = seededTeams[i] + ' (s)'
      unSeedDrawIndexes = Util.removeElement(unSeedDrawIndexes, seedDrawIndexes[i])
      // Leave empty places for seed rivals
      if (numEmpties > 0) {
        const indexRival = BracketService.getIndexRival(seedDrawIndexes[i])
        teamsDrew[indexRival] = ''
        unSeedDrawIndexes = Util.removeElement(unSeedDrawIndexes, indexRival)
        numEmpties--
      }
    }
    // Draw unseeds
    for (let i = 0; i < unSeedDrawIndexes.length; i++) {
      teamsDrew[unSeedDrawIndexes[i]] = unSeededTeams[i]
    }

    return teamsDrew
  },
  seededRankedDraw: (teams, numSeeds) => {
    const teamsDrew = []
    const ranksDrew = []
    const sizeBracket = BracketService.getSizeBracket(teams.length)
    let numEmpties = sizeBracket - teams.length
    const seedDrawIndexes = BracketService.getSeedDrawIndexes(teams.length, numSeeds)
    let unSeedDrawIndexes = [...Array(sizeBracket).keys()]
    let unSeededTeams = Util.copy(teams)

    // Draw seeds
    for (const position of seedDrawIndexes) {
      const index = position[0]
      let ranks = position[1]
      let numSeed = 0
      if (ranks.length > 1) {
        ranks = Util.difference(ranks, ranksDrew)
        // get random seeded team among rank
        numSeed = Util.getRandomElement(ranks)
      } else {
        numSeed = ranks
      }
      const indexTeam = numSeed - 1
      teamsDrew[index] = teams[indexTeam] + ' (' + numSeed + ')'
      ranksDrew.push(numSeed)
      unSeedDrawIndexes = Util.removeElement(unSeedDrawIndexes, index)
      unSeededTeams = Util.removeElement(unSeededTeams, teams[indexTeam])
      // Leave empty places for seed rivals
      if (numEmpties > 0) {
        const indexRival = BracketService.getIndexRival(index)
        teamsDrew[indexRival] = ''
        unSeedDrawIndexes = Util.removeElement(unSeedDrawIndexes, indexRival)
        numEmpties--
      }
    }

    // Draw unseeds
    unSeedDrawIndexes = shuffle(unSeedDrawIndexes)
    let i = 0
    for (const indexUnSeed of unSeedDrawIndexes) {
      teamsDrew[indexUnSeed] = unSeededTeams[i]
      i++
    }
    return teamsDrew
  },
  getSeedDrawIndexes (numTeams, numSeeds) {
    const sizeBracket = BracketService.getSizeBracket(numTeams)
    const element = seededDraws.filter(item => item.sizeBracket === sizeBracket)
    let seeds = []
    if (element.length === 1) {
      seeds = (element[0].seeds).slice(0, numSeeds)
    }
    return seeds
  },
  getSizeBracket (numTeams) {
    return Math.pow(2, Math.trunc(Math.log2(numTeams - 1)) + 1)
  },
  getIndexRival (index) {
    return (index % 2 === 0) ? index + 1 : index - 1
  }
}

export default BracketService
