import { MarketTypeName } from '@augurproject/sdk-lite';
import { Icons, createBigNumber } from '@augurproject/augur-comps';
const {
  EthIcon,
  UsdIcon,
  CryptoIcon,
  EntertainmentIcon,
  FinanceIcon,
  MedicalIcon,
  PoliticsIcon,
  SportsIcon,
} = Icons;
// # Market Types
export const YES_NO = MarketTypeName.YesNo;
export const CATEGORICAL = MarketTypeName.Categorical;
export const SCALAR = MarketTypeName.Scalar;

// MAIN VIEWS
export const MARKET = 'market';
export const MARKETS = 'markets';
export const PORTFOLIO = 'portfolio';

export const YES_NO_OUTCOMES_NAMES = ['Invalid', 'No', 'Yes'];
// QUERY_PARAMS
export const MARKET_ID_PARAM_NAME = 'id';
export const AFFILIATE_NAME = 'r';
export const THEME_NAME = 't';

export const OUTCOME_YES_NAME = 'Yes';
export const OUTCOME_NO_NAME = 'No';
export const OUTCOME_INVALID_NAME = 'Invalid';

// Directions
export const BUY = 'buy';
export const SELL = 'sell';

export const ADD_LIQUIDITY = 'add liquidity';

export const ETHER = createBigNumber(10).pow(18);
export const GWEI_CONVERSION = 1000000000;
export const TEN = createBigNumber(10, 10);
export const ZERO = createBigNumber(0);
export const ONE = createBigNumber(1);
export const HUNDRED = createBigNumber(100);
export const THOUSAND = createBigNumber(1000);
export const MILLION = THOUSAND.times(THOUSAND);
export const BILLION = MILLION.times(THOUSAND);
export const TRILLION = BILLION.times(THOUSAND);
export const DAYS_IN_YEAR = createBigNumber(365);
export const SEC_IN_DAY = createBigNumber(86400);
export const PORTION_OF_INVALID_POOL_SELL = createBigNumber(0.5);
export const PORTION_OF_CASH_INVALID_POOL = createBigNumber(0.1);

// # Asset Types
export const ETH = 'ETH';
export const REP = 'REP';
export const DAI = 'DAI';
export const USDT = 'USDT';
export const USDC = 'USDC';
export const SHARES = 'SHARES';
export const ALL_CURRENCIES = 'All Currencies';

export const CASH_LABEL_FORMATS = {
  ETH: { symbol: 'Ξ', prepend: true, displayDecimals: 4, icon: EthIcon },
  USDC: { symbol: '$', prepend: true, displayDecimals: 2, icon: UsdIcon },
  SHARES: { symbol: '', prepend: true, displayDecimals: 4, icon: null },
};

// Portfolio table views
export const POSITIONS = 'positions';
export const LIQUIDITY = 'liquidity';
export const TABLES = 'TABLES';
export const ACTIVITY = 'ACTIVITY';

// top categories
export const MEDICAL = 'medical';
export const POLITICS = 'politics';
export const FINANCE = 'finance';
export const CRYPTO = 'crypto';
export const ENTERTAINMENT = 'entertainment';
export const ECONOMICS = 'economics';
export const SPORTS = 'sports';
export const OTHER = 'other';
export const ALL_MARKETS = 'all markets';

// sub categories
export const COVID = 'covid-19';
export const ELECTORAL_COLLEGE = 'electoral college';
export const FEDERAL_FUNDS = 'federal funds';
export const REPUSD = 'REP USD';
export const PRESIDENTIAL_ELECTION = 'electoral college';

export const POPULAR_CATEGORIES_ICONS = {
  [MEDICAL]: MedicalIcon,
  [POLITICS]: PoliticsIcon,
  [CRYPTO]: CryptoIcon,
  [FINANCE]: FinanceIcon,
  [SPORTS]: SportsIcon,
  [ENTERTAINMENT]: EntertainmentIcon,
};

// side bar types
export const NAVIGATION = 'NAVIGATION';
export const FILTERS = 'FILTERS';

export const SIDEBAR_TYPES = {
  [NAVIGATION]: NAVIGATION,
  [FILTERS]: FILTERS,
};

//  transaction types
export const ALL = 'all';
export const SWAP = 'swap';
export const ADD = 'add';
export const REMOVE = 'remove';

export const INVALID_OUTCOME_ID = 0;
export const NO_OUTCOME_ID = 1;
export const YES_OUTCOME_ID = 2;

export const OPEN = 'Open';
export const IN_SETTLEMENT = 'In settlement';
export const RESOLVED = 'Resolved';

export const INSUFFICIENT_LIQUIDITY = 'Insufficent Liquidity';
export const INSUFFICIENT_BALANCE = 'Insufficent Balance';
export const OVER_SLIPPAGE = 'Over Slippage Tolerance';
export const ENTER_AMOUNT = 'Enter Amount';
export const ERROR_AMOUNT = 'Amount is not valid';
export const CONNECT_ACCOUNT = 'Connect Account';
export const SET_PRICES = 'Set Prices';

export const SETTINGS_SLIPPAGE = '2';
// graph market status
export const MARKET_STATUS = {
  TRADING: 'TRADING',
  REPORTING: 'REPORTING',
  DISPUTING: 'DISPUTING',
  FINALIZED: 'FINALIZED',
  SETTLED: 'SETTLED',
};

export const categoryItems = [
  {
    label: ALL_MARKETS,
    value: ALL_MARKETS,
  },
  {
    label: CRYPTO,
    value: CRYPTO,
  },
  {
    label: ECONOMICS,
    value: ECONOMICS,
  },
  {
    label: ENTERTAINMENT,
    value: ENTERTAINMENT,
  },
  {
    label: MEDICAL,
    value: MEDICAL,
  },
  {
    label: SPORTS,
    value: SPORTS,
  },
  {
    label: OTHER,
    value: OTHER,
  },
];

export const TOTAL_VOLUME = 'Total Volume';
export const TWENTY_FOUR_HOUR_VOLUME = '24hr volume';
export const ENDING_SOON = 'ending soon';

export const sortByItems = [
  {
    label: TOTAL_VOLUME,
    value: TOTAL_VOLUME,
  },
  {
    label: TWENTY_FOUR_HOUR_VOLUME,
    value: TWENTY_FOUR_HOUR_VOLUME,
  },
  {
    label: LIQUIDITY,
    value: LIQUIDITY,
  },
  {
    label: ENDING_SOON,
    value: ENDING_SOON,
  },
];

export const marketStatusItems = [
  {
    label: OPEN,
    value: OPEN,
  },
  {
    label: IN_SETTLEMENT,
    value: IN_SETTLEMENT,
  },
  {
    label: RESOLVED,
    value: RESOLVED,
  },
];

export const currencyItems = [
  {
    label: ALL_CURRENCIES,
    value: ALL_CURRENCIES,
  },
  {
    label: ETH,
    value: ETH,
  },
  {
    label: USDC,
    value: USDC,
  },
];

export const TX_STATUS = {
  CONFIRMED: 'CONFIRMED',
  PENDING: 'PENDING',
  FAILURE: 'FAILURE',
};

// approvals
export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

export enum ApprovalAction {
  ENTER_POSITION,
  EXIT_POSITION,
  ADD_LIQUIDITY,
  REMOVE_LIQUIDITY,
}

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

// Modals
export const MODAL_ADD_LIQUIDITY = 'MODAL_ADD_LIQUIDITY';

export const DEFAULT_MARKET_VIEW_SETTINGS = {
  categories: ALL_MARKETS,
  reportingState: OPEN,
  sortBy: TOTAL_VOLUME,
  currency: ALL_CURRENCIES,
};

export const CREATE = 'create';

export const DefaultMarketOutcomes = [
  {
    id: 0,
    name: 'Invalid',
    price: '$0.00',
    isInvalid: true,
  },
  {
    id: 1,
    name: 'No',
    price: '$0.25',
  },
  {
    id: 2,
    name: 'yes',
    price: '$0.75',
  },
];
