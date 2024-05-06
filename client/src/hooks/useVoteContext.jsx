import { VoteContext } from '../context/VoteContext'
import { useContext } from 'react'

export const useVoteContext = () => {
  const context = useContext(VoteContext)

  if (!context) {
    throw Error('useDetailContext must be used inside an DetailContextProvider')
  }

  return context
}