import { Percent, Token, TokenAmount } from '@uniswap/sdk'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useActiveWeb3React } from '../../hooks'
import { formatShares, getRemoveLiquidity } from '../../utils'
import { AppDispatch, AppState } from '../index'
import { Field, typeInput } from './actions'

export function useBurnState(): AppState['burn'] {
  return useSelector<AppState, AppState['burn']>(state => state.burn)
}

export function useDerivedBurnInfo(
  currencyLp: Token | undefined,
  userLiquidity: string | undefined
): {
  parsedAmounts: {
    [Field.LIQUIDITY_PERCENT]: Percent
    [Field.LIQUIDITY]?: TokenAmount
    [Field.YES_SHARES]?: string
    [Field.NO_SHARES]?: string
    [Field.COLLATERAL]?: string
  }
  error?: string
} {
  const { account } = useActiveWeb3React()
  const { independentField, typedValue } = useBurnState()

  let percentToRemove: Percent = new Percent('0', '100')
  // user specified a %
  if (independentField === Field.LIQUIDITY_PERCENT) {
    percentToRemove = new Percent(typedValue, '100')
  }
  const parsedAmounts = {
    [Field.LIQUIDITY_PERCENT]: percentToRemove,
    [Field.LIQUIDITY]:
      userLiquidity && percentToRemove && percentToRemove.greaterThan('0')
        ? new TokenAmount(currencyLp, percentToRemove.multiply(userLiquidity).quotient)
        : undefined
  }

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }

  if (!parsedAmounts[Field.LIQUIDITY]) {
    error = error ?? 'Enter an amount'
  }

  return { parsedAmounts, error }
}

export function getRemoveLiquidityBreakdown(augurClient, currencyLp: string, userLiquidity: string, setMethod: Function) {
  return getRemoveLiquidity({
    ammAddress: currencyLp,
    augurClient,
    lpTokens: userLiquidity
  }).then(results => {
    const breakdown = {
      noShares: formatShares(results.noShares),
      yesShares: formatShares(results.yesShares),
      cashShares: results.cashShares
    }
    setMethod(breakdown)
  })
}

export function useBurnActionHandlers(): {
  onUserInput: (field: Field, typedValue: string) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch]
  )

  return {
    onUserInput
  }
}