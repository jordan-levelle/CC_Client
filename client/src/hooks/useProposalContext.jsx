import { ProposalsContext } from '../context/ProposalContext'
import { useContext } from 'react'

export const useProposalsContext = () => {
  const context = useContext(ProposalsContext)

  if (!context) {
    throw Error('useProposalsContext must be used inside an ProposalsContextProvider')
  }

  return context
}