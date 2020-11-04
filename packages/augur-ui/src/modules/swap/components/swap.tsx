import React, { useEffect, useState } from 'react';

import {
  ETH,
  DAI,
  REP,
  TRANSACTIONS,
  SWAPEXACTTOKENSFORTOKENS,
  SWAPETHFOREXACTTOKENS,
  ZERO,
  USDC,
  USDT,
  SWAPTOKENSFOREXACTETH, APPROVE
} from 'modules/common/constants';
import { FormattedNumber } from 'modules/types';
import {
  SwapArrow,
} from 'modules/common/icons';
import { formatEther } from 'utils/format-number';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import { Rate } from 'modules/swap/components/rate';
import { SwapRow } from 'modules/swap/components/swap-row';
import {
  uniswapEthForDai,
  uniswapEthForRep,
  checkSetApprovalAmount,
  uniswapTokenForDai,
  uniswapTokenForRep,
  uniswapTokenForETH, setTokenApproval, checkTokenApproval
} from 'modules/contracts/actions/contractCalls';

import Styles from 'modules/swap/components/index.styles.less';
import { ProcessingButton } from 'modules/common/buttons';
import { augurSdk } from 'services/augursdk';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { ApprovalTxButtonLabel } from 'modules/common/labels';


const tokenOptions = {
  [DAI]: {
    label: DAI,
    value: DAI,
    comp: null,
  },
  [REP]: {
    label: 'REPv2',
    value: REP,
    comp: null,
  },
  [ETH]: {
    label: ETH,
    value: ETH,
    comp: null,
  },
  [USDC]: {
    label: USDC,
    value: USDC,
    comp: null,
  },
  [USDT]: {
    label: USDT,
    value: USDT,
    comp: null,
  },
};

const getFromTokenOptions = () => {
  return [
    tokenOptions[DAI],
    tokenOptions[ETH],
    tokenOptions[REP],
    tokenOptions[USDC],
    tokenOptions[USDT],
  ];
};

const getToTokenOptions = (token) => {
  if (token === ETH) {
    return [tokenOptions[DAI], tokenOptions[REP]];
  } else if (token === DAI) {
    return [tokenOptions[REP], tokenOptions[ETH]];
  } else if (token === REP) {
    return [tokenOptions[ETH], tokenOptions[DAI]];
  } else if (token === USDT || token === USDC) {
    return [tokenOptions[DAI]];
  }

  return [tokenOptions[DAI], tokenOptions[ETH], tokenOptions[REP]];
};

export const Swap = () => {
  const {
    ethToDaiRate,
    repToDaiRate,
    usdtToDaiRate,
    usdcToDaiRate,
    gasPriceInfo,
    env: config,
    loginAccount: {
      address,
      balances,
    },
    modal: {
      toToken = DAI,
      fromToken = null,
    },
  } = useAppStatusStore();
  const gasPrice = gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average;
  const VALID_TOKENS = [DAI, REP, ETH, USDC, USDT];
  const [toTokenType, setToTokenType] = useState(toToken);
  const toTokenBalance = balances[toTokenType.toLowerCase()] || 0;
  const hasEth = createBigNumber(balances.eth || 0).gt(ZERO);
  const hasRep = createBigNumber(balances.rep || 0).gt(ZERO);
  const hasDai = createBigNumber(balances.dai || 0).gt(ZERO);
  const hasUSDC = createBigNumber(balances.usdc || 0).gt(ZERO);
  const hasUSDT = createBigNumber(balances.usdt || 0).gt(ZERO);

  const ETH_RATE = createBigNumber(1).dividedBy(
    ethToDaiRate?.value || createBigNumber(1)
  );
  const REP_RATE = createBigNumber(ETH_RATE).times(
    repToDaiRate?.value || createBigNumber(1)
  );

  let tokenSwapTypes = [];

  if (hasEth) {
    tokenSwapTypes = tokenSwapTypes.concat(ETH);
  }

  if (hasRep) {
    tokenSwapTypes = tokenSwapTypes.concat(REP);
  }

  if (hasDai) {
    tokenSwapTypes = tokenSwapTypes.concat(DAI);
  }

  // Only add USDC/USDT to convert to DAI/ETH since there are no USDC/USDT -> REPV2 liquidity pools at this time
  if (toTokenType !== REP) {
    if (hasUSDC) {
      tokenSwapTypes = tokenSwapTypes.concat(USDC);
    }
    if (hasUSDT) {
      tokenSwapTypes = tokenSwapTypes.concat(USDT);
    }
  }

  // remove the token that is being swaapped for
  tokenSwapTypes = tokenSwapTypes.filter((token) => token !== toTokenType);

  // If user has no token balanaces, show all tokens
  if (tokenSwapTypes.length === 0) {
    tokenSwapTypes = VALID_TOKENS.filter((token) => token !== toTokenType);
  }

  let formattedInputAmount: FormattedNumber;
  let outputAmount: FormattedNumber = formatEther(0);

  const getBalanceForToken = (token) => {
    if (!token) {
      return 0;
    }

    let balance = 0;
    balance = balances[token.toLowerCase()] || 0;
    return balance;
  };

  const setAmountToSwap = (
    amount: BigNumber,
    formattedInputAmount: BigNumber
  ) => {
    setErrorMessage('');
    if (amount.lt(0) || isNaN(amount.toNumber())) {
      setErrorMessage('Check conversion amount');
    } else if (amount.gt(formattedInputAmount)) {
      setErrorMessage('Check amount is not greater than balance');
    } else {
      setInputAmount(amount);
    }
  };

  const clearForm = () => {
    setInputAmount(createBigNumber(0));
    outputAmount = formatEther(0);
  };

  const makeTrade = async () => {
    const { contracts } = augurSdk.get();

    const input = inputAmount;
    const output = createBigNumber(outputAmount.value);
    const exchangeRateBufferMultiplier =
      config.uniswap?.exchangeRateBufferMultiplier || 1.005;

    try {
      if (fromTokenType === DAI) {
        await checkSetApprovalAmount(address, contracts.cash);
        if (toTokenType === ETH) {
          await uniswapTokenForETH(
            contracts.cash.address,
            input,
            output,
            exchangeRateBufferMultiplier
          );
        } else if (toTokenType === REP) {
          await uniswapTokenForRep(
            contracts.cash.address,
            input,
            output,
            exchangeRateBufferMultiplier
          );
        }
        clearForm();
      } else if (fromTokenType === REP) {
        await checkSetApprovalAmount(address, contracts.reputationToken);
        if (toTokenType === ETH) {
          await uniswapTokenForETH(
            contracts.reputationToken.address,
            input,
            output,
            exchangeRateBufferMultiplier
          );
        } else if (toTokenType === DAI) {
          await uniswapTokenForDai(
            contracts.reputationToken.address,
            input,
            output,
            exchangeRateBufferMultiplier
          );
        }
        clearForm();
      } else if (fromTokenType === ETH) {
        await checkSetApprovalAmount(address, contracts.weth);
        if (toTokenType === DAI) {
          await uniswapEthForDai(input, output, exchangeRateBufferMultiplier);
        } else if (toTokenType === REP) {
          await uniswapEthForRep(input, output, exchangeRateBufferMultiplier);
        }
        clearForm();
      } else if (fromTokenType === USDC) {
        await checkSetApprovalAmount(address, contracts.usdc);
        if (toTokenType === DAI) {
          await uniswapTokenForDai(
            contracts.usdc.address,
            input,
            output,
            exchangeRateBufferMultiplier
          );
        } else if (toTokenType === REP) {
          await uniswapTokenForRep(
            contracts.usdc.address,
            input,
            output,
            exchangeRateBufferMultiplier
          );
        }
        else if (toTokenType === ETH) {
          await uniswapTokenForETH(
            contracts.usdc.address,
            input,
            output,
            exchangeRateBufferMultiplier
          );
        }
        clearForm();
      } else if (fromTokenType === USDT) {
        await checkSetApprovalAmount(address, contracts.usdt);
        if (toTokenType === DAI) {
          await uniswapTokenForDai(
            contracts.usdt.address,
            input,
            output,
            exchangeRateBufferMultiplier
          );
        } else if (toTokenType === REP) {
          await uniswapTokenForRep(
            contracts.usdt.address,
            input,
            output,
            exchangeRateBufferMultiplier
          );
        }
        else if (toTokenType === ETH) {
          await uniswapTokenForETH(
            contracts.usdt.address,
            input,
            output,
            exchangeRateBufferMultiplier
          );
        }
        clearForm();
      }
    } catch (error) {
      if (error && error.message.indexOf('denied') === -1) {
        setErrorMessage(
          'Liquidity error, please try reducing the size of your trade to avoid a price slippage.'
        );
      }
    }
  };

  const handleSetToken = (token) => {
    setErrorMessage('');
    setFromTokenType(token);
    if (token === DAI) {
      setToTokenType(ETH);
    } else {
      setToTokenType(DAI);
    }
    updateBalance(getBalanceForToken(token));
    clearForm();
  };

  const [inputAmount, setInputAmount] = useState(createBigNumber(0.0));
  const [fromTokenType, setFromTokenType] = useState(
    fromToken ? fromToken : tokenSwapTypes[0]
  );
  const [balance, updateBalance] = useState(getBalanceForToken(fromTokenType));
  const [errorMessage, setErrorMessage] = useState(null);

  if (!VALID_TOKENS.includes(fromTokenType)) {
    throw Error('unsupported uniswap token');
  }

  formattedInputAmount = formatEther(Number(balance) || 0);

  let altExchangeMessage = null;
  if (toTokenType === ETH) {
    altExchangeMessage =
      'Have USDC, USDT, DAI or REPv2 and looking to get a large quantity of ETH at lower slippage?';
  } else if (toTokenType === DAI) {
    altExchangeMessage =
      'Have USDC, USDT, REPv2 or ETH and looking to get a large quantity of DAI at lower slippage?';
  } else if (toTokenType === REP) {
    altExchangeMessage =
      'Have USDC, USDT, DAI or ETH and looking to get a large quantity of REPv2 at lower slippage?';
  }

  if (!inputAmount || inputAmount.lt(0)) {
    outputAmount = formatEther(0);
  } else {
    const rateUSDT = createBigNumber(usdtToDaiRate.value / 10**12);
    const rateUSDC = createBigNumber(usdcToDaiRate.value / 10**12);

    if (toTokenType === REP) {
      const inputValueRepInDai = createBigNumber(1)
        .dividedBy(repToDaiRate.value)
        .multipliedBy(inputAmount);

      if (fromTokenType === DAI) {
        outputAmount = formatEther(inputValueRepInDai);
      } else if (fromTokenType === ETH) {
        outputAmount = formatEther(
          createBigNumber(ethToDaiRate.value)
            .multipliedBy(inputAmount)
            .dividedBy(repToDaiRate.value)
        );
      } else if (fromTokenType === USDC) {
        outputAmount = formatEther(rateUSDC.multipliedBy(inputValueRepInDai));
      } else if (fromTokenType === USDT) {
        outputAmount = formatEther(rateUSDT.multipliedBy(inputValueRepInDai));
      }
    } else if (toTokenType === DAI) {
      if (fromTokenType === REP) {
        outputAmount = formatEther(
          createBigNumber(repToDaiRate.value).multipliedBy(inputAmount)
        );
      } else if (fromTokenType === ETH) {
        outputAmount = formatEther(
          createBigNumber(inputAmount).dividedBy(ETH_RATE)
        );
      } else if (fromTokenType === USDC) {
        outputAmount = formatEther(rateUSDC.multipliedBy(inputAmount));
      } else if (fromTokenType === USDT) {
        outputAmount = formatEther(rateUSDT.multipliedBy(inputAmount));
      }
    } else if (toTokenType === ETH) {
      if (fromTokenType === DAI) {
        outputAmount = formatEther(
          createBigNumber(ETH_RATE).multipliedBy(inputAmount)
        );
      } else if (fromTokenType === REP) {
        outputAmount = formatEther(
          createBigNumber(REP_RATE).multipliedBy(inputAmount)
        );
      } else if (fromTokenType === USDT) {
        outputAmount = formatEther(
          rateUSDT.multipliedBy(ETH_RATE).multipliedBy(inputAmount)
        );
      } else if (fromTokenType === USDC) {
        outputAmount = formatEther(
          rateUSDC.multipliedBy(ETH_RATE).multipliedBy(inputAmount)
        );
      }
    }
  }

  const getCurrentTokenContract = () => {
    const { contracts } = augurSdk.get();

    let tokenContract = null;
    if (fromTokenType === DAI) {
      tokenContract = contracts.cash;
    } else if (fromTokenType === REP) {
      tokenContract = contracts.reputationToken;
    } else if (fromTokenType === USDT) {
      tokenContract = contracts.usdt;
    } else if (fromTokenType === USDC) {
      tokenContract = contracts.usdc;
    } else {
      tokenContract = contracts.weth;
    }
    return tokenContract;
  }

  const setTokenApprovalSwap = async () => {
    const tokenContract = getCurrentTokenContract();
    await setTokenApproval(address, tokenContract);
  }

  const [tokenUnlocked, setTokenUnlocked] = useState(false);
  const [isApproved, setIsApproved] = useState({
    eth: false,
    dai: false,
    rep: false,
    usdc: false,
    usdt: false,
  });

  const showUnlockForToken = async () => {
    const tokenContract = getCurrentTokenContract();
    const approved = await checkTokenApproval(address, tokenContract);
    setIsApproved({
      ...isApproved,
      [fromTokenType.toLowerCase()]: approved
    });

    return approved;
  }

  useEffect(() => {
    if (!isApproved[fromTokenType.toLowerCase()]) {
      const getData = async () => {
        const tokenUnlocked = await showUnlockForToken();
        setTokenUnlocked(tokenUnlocked);
      }
      getData();
    } else {
      setTokenUnlocked(true);
    }
  }, [fromTokenType, balances]);

  const queueId = fromTokenType === ETH ?
    SWAPETHFOREXACTTOKENS :
    toTokenType === ETH ?
    SWAPTOKENSFOREXACTETH :
    SWAPEXACTTOKENSFORTOKENS


  return (
    <div className={Styles.Swap}>
      <>
        <SwapRow
          amount={formatEther(inputAmount)}
          token={fromTokenType}
          label={'Input'}
          balance={formattedInputAmount}
          setAmount={setAmountToSwap}
          setMaxAmount={setInputAmount}
          setToken={(token) => handleSetToken(token)}
          tokenOptions={getFromTokenOptions()}
        />

        <div>{SwapArrow}</div>

        <SwapRow
          amount={outputAmount}
          token={toTokenType}
          label={'Output (estimated)'}
          balance={formatEther(toTokenBalance)}
          setToken={(token) => {
            setToTokenType(token);
          }}
          tokenOptions={getToTokenOptions(fromTokenType)}
        />
      </>
      <Rate
        baseToken={fromTokenType}
        swapForToken={toTokenType}
        repRate={REP_RATE}
        ethRate={ETH_RATE}
        ethToDaiRate={ethToDaiRate}
        repToDaiRate={repToDaiRate}
        usdcToDaiRate={usdcToDaiRate}
        usdtToDaiRate={usdtToDaiRate}
      />

      {!tokenUnlocked &&
        <ApprovalTxButtonLabel
          className={Styles.ApprovalNotice}
          title={`Unlock ${fromTokenType}`}
          buttonName={'Approve'}
          userEthBalance={String(balances.eth)}
          gasPrice={gasPrice}
          checkApprovals={async () => {
            const unlocked = await showUnlockForToken();
            if (unlocked) {
              return 0;
            }
            return 1;
          }}
          doApprovals={() => setTokenApprovalSwap()}
          account={address}
          approvalType={APPROVE}
          isApprovalCallback={() => null}
          hideAddFunds={true}
        />
      }

      <div>
        {tokenUnlocked &&
          <ProcessingButton
            text={!inputAmount || inputAmount.lte(0) ? 'Enter an amount' : 'Convert'}
            action={() => makeTrade()}
            queueName={TRANSACTIONS}
            disabled={
              !outputAmount ||
              outputAmount.value <= 0 ||
              (errorMessage && errorMessage.indexOf('Liquidity') === -1)
            }
            queueId={queueId}
            autoHideConfirm={true}
            customConfirmedButtonText={'Conversion Confirmed!'}
          />
        }

        {errorMessage && <div className={Styles.SwapError}>{errorMessage}</div>}
      </div>
    </div>
  );
};
