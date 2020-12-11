import React, { useState } from 'react';
import Styles from 'modules/common/tables.styles.less';
import { UsdIcon } from './icons';
import { PrimaryButton, SecondaryButton } from 'modules/common/buttons';
import classNames from 'classnames';
import {
  POSITIONS,
  LIQUIDITY,
  fakeLiquidityData,
  fakePositionsData,
  fakeTransactionsData,
} from 'modules/constants';
import { Pagination } from 'modules/common/pagination';

interface Position {
  id: string;
  outcome: string;
  quantityOwned: number;
  avgPricePaid: string;
  initialValue: string;
  currentValue: string;
  profitLoss: string;
}

interface PositionsTableProps {
  market: MarketPosition;
  singleMarket?: boolean;
}

interface Liquidity {
  id: string;
  liquiditySharesOwned: number;
  feesEarned: string;
  currentValue: string;
}

interface MarketLiquidity {
  id: string;
  description: string;
  asset: string;
  liquidity: Liquidity[];
}

interface MarketPosition {
  description: string;
  asset: string;
  positions: Position[];
  claimableWinnings?: string;
}

interface LiquidityTableProps {
  market: MarketLiquidity;
  singleMarket?: boolean;
}

const MarketTableHeader = ({ market }) => {
  return (
    <div className={Styles.MarketTableHeader}>
      <span>{market.description}</span>
      {UsdIcon}
    </div>
  );
};

const PositionHeader = () => {
  return (
    <ul className={Styles.PositionHeader}>
      <li>outcome</li>
      <li>quantity owned</li>
      <li>avg. price paid</li>
      <li>init. value</li>
      <li>cur. value</li>
      <li>p/l</li>
    </ul>
  );
};

const PositionRow = ({ position }) => {
  return (
    <ul className={Styles.PositionRow}>
      <li>{position.outcome}</li>
      <li>{position.quantityOwned}</li>
      <li>{position.avgPricePaid}</li>
      <li>{position.initialValue}</li>
      <li>{position.currentValue}</li>
      <li>{position.profitLoss}</li>
    </ul>
  );
};

interface PositionFooterProps {
  claimableWinnings?: string;
}
export const PositionFooter = ({ claimableWinnings }: PositionFooterProps) => {
  return (
    <div className={Styles.PositionFooter}>
      {claimableWinnings && (
        <SecondaryButton text={`${claimableWinnings} in Winnings to claim`} />
      )}
      <PrimaryButton text="trade" />
    </div>
  );
};

export const PositionTable = ({
  market,
  singleMarket,
}: PositionsTableProps) => {
  return (
    <div className={Styles.PositionTable}>
      {!singleMarket && <MarketTableHeader market={market} />}
      <PositionHeader />
      {market.positions.map((position) => (
        <PositionRow key={position.id} position={position} />
      ))}
      {!singleMarket && (
        <PositionFooter claimableWinnings={market.claimableWinnings} />
      )}
      {singleMarket && (
        <div className={Styles.PaginationFooter}>
          <Pagination
            page={1}
            itemCount={10}
            itemsPerPage={9}
            action={() => null}
            updateLimit={() => null}
          />
        </div>
      )}
    </div>
  );
};

const LiquidityHeader = () => {
  return (
    <ul className={Styles.LiquidityHeader}>
      <li>liquidity shares owned</li>
      <li>cur. value</li>
      <li>fees earned</li>
      <li>fees earned</li>
    </ul>
  );
};

const LiquidityRow = ({ liquidity }) => {
  return (
    <ul className={Styles.LiquidityRow}>
      <li>{liquidity.liquiditySharesOwned}</li>
      <li>{liquidity.currentValue}</li>
      <li>{liquidity.feesEarned}</li>
      <li>{liquidity.feesEarned}</li>
    </ul>
  );
};

export const LiquidityFooter = () => {
  return (
    <div className={Styles.LiquidityFooter}>
      <PrimaryButton text="remove liquidity" />
      <SecondaryButton text="add liquidity" />
    </div>
  );
};

export const LiquidityTable = ({
  market,
  singleMarket,
}: LiquidityTableProps) => {
  return (
    <div className={Styles.LiquidityTable}>
      {!singleMarket && <MarketTableHeader market={market} />}
      <LiquidityHeader />
      {market.liquidity.map((liquidity) => (
        <LiquidityRow key={liquidity.id} liquidity={liquidity} />
      ))}
      {!singleMarket && <LiquidityFooter />}
      {singleMarket && (
        <div className={Styles.PaginationFooter}>
          <Pagination
            page={1}
            itemCount={10}
            itemsPerPage={9}
            action={() => null}
            updateLimit={() => null}
          />
        </div>
      )}
    </div>
  );
};

interface PositionsLiquidityViewSwitcherProps {
  marketId?: string;
}

export const PositionsLiquidityViewSwitcher = ({
  marketId,
}: PositionsLiquidityViewSwitcherProps) => {
  const [tableView, setTableView] = useState(POSITIONS);

  return (
    <div className={Styles.PositionsLiquidityViewSwitcher}>
      <div>
        <span
          onClick={() => setTableView(POSITIONS)}
          className={classNames({
            [Styles.Selected]: tableView === POSITIONS,
          })}
        >
          {POSITIONS}
        </span>
        <span
          onClick={() => setTableView(LIQUIDITY)}
          className={classNames({
            [Styles.Selected]: tableView === LIQUIDITY,
          })}
        >
          {LIQUIDITY}
        </span>
      </div>
      <div>
        {!marketId && (
          <>
            {tableView === POSITIONS &&
              fakePositionsData.map((market) => (
                <PositionTable key={market.id} market={market} />
              ))}
            {tableView === LIQUIDITY &&
              fakeLiquidityData.map((market) => (
                <LiquidityTable key={market.id} market={market} />
              ))}
            <Pagination
              page={1}
              itemCount={10}
              itemsPerPage={9}
              action={() => null}
              updateLimit={() => null}
            />
          </>
        )}
        {marketId && (
          <>
            {tableView === POSITIONS && (
              <PositionTable singleMarket market={fakePositionsData[0]} />
            )}
            {tableView === LIQUIDITY && (
              <LiquidityTable singleMarket market={fakeLiquidityData[0]} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

const TransactionsHeader = () => {
  return (
    <ul className={Styles.TransactionsHeader}>
      <li>
        <span>all</span>
        <span>swaps</span>
        <span>adds</span>
        <span>removes</span>
      </li>
      <li>total value</li>
      <li>token amount</li>
      <li>share amount</li>
      <li>account</li>
      <li>time</li>
    </ul>
  );
};

const TransactionRow = ({ transaction }) => {
  return (
    <ul className={Styles.TransactionRow}>
      <li>{transaction.title}</li>
      <li>{transaction.totalValue}</li>
      <li>{transaction.tokenAmount}</li>
      <li>{transaction.shareAmount}</li>
      <li>{transaction.account}</li>
      <li>{transaction.time}</li>
    </ul>
  );
};

export const TransactionsTable = () => {
  return (
    <div className={Styles.TransactionsTable}>
      <TransactionsHeader />
      {fakeTransactionsData[0].transactions.map((transaction) => (
        <TransactionRow key={transaction.id} transaction={transaction} />
      ))}
      <div className={Styles.PaginationFooter}>
        <Pagination
          page={1}
          itemCount={10}
          itemsPerPage={9}
          action={() => null}
          updateLimit={() => null}
        />
      </div>
    </div>
  );
};