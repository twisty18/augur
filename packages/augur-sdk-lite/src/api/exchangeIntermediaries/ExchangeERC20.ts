import { TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumber } from 'bignumber.js';
import { ethers } from 'ethers';
import { SignerOrProvider } from '../../constants';
import {ExchangeCommon, generateSymbols} from './ExchangeCommon';
import { ExchangeContractIntermediary } from './index';



export class ExchangeERC20 extends ExchangeCommon implements ExchangeContractIntermediary {
  readonly factory: ethers.Contract;
  readonly signerOrProvider: SignerOrProvider;

  constructor(signerOrProvider: SignerOrProvider, factoryAddress: string) {
    super(factoryAddress, signerOrProvider);
  }

  get forEth() {
    return false
  }

  async rateAddAMMWithLiquidity(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, ratio: BigNumber, keepLong: Boolean, recipient: string, symbolRoot:string): Promise<BigNumber> {
    return this.factory.callStatic.addAMMWithLiquidity(market, paraShareToken, fee.toFixed(), cash.toFixed(), ratio.toFixed(), keepLong, recipient, generateSymbols(symbolRoot));
  }

  async addAMMWithLiquidity(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, ratio: BigNumber, keepLong: Boolean, recipient: string, symbolRoot: string): Promise<TransactionResponse> {
    return this.factory.addAMMWithLiquidity(market, paraShareToken, fee.toFixed(), cash.toFixed(), ratio.toFixed(), keepLong, recipient, generateSymbols(symbolRoot));
  }

  async addInitialLiquidity(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, ratio: BigNumber, keepLong: Boolean, recipient: string): Promise<TransactionResponse> {
    return this.factory.addInitialLiquidity(market, paraShareToken, fee.toFixed(), cash.toFixed(), ratio.toFixed(), keepLong, recipient);
  }

  async enterPosition(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, buyLong: Boolean, minShares: BigNumber): Promise<TransactionResponse> {
    const exchangeAddress = await this.calculateExchangeAddress(market, paraShareToken, fee);
    const amm = this.exchangeContract(exchangeAddress);
    return amm.enterPosition(cash.toFixed(), buyLong, minShares.toFixed());
  }

  async exitPosition(market: string, paraShareToken: string, fee: BigNumber, shortShares: BigNumber, longShares: BigNumber, minCash: BigNumber): Promise<TransactionResponse> {
    const exchangeAddress = await this.calculateExchangeAddress(market, paraShareToken, fee);
    const amm = this.exchangeContract(exchangeAddress);
    return amm.exitPosition(shortShares.toFixed(), longShares.toFixed(), minCash.toFixed());
  }

}
