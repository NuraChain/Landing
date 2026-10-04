/**
 * The articles this repository publishes, in the order they are seeded.
 *
 * Order is not display order - the blog sorts by publication date - but it IS the tiebreak
 * within one date, reversed: an article listed later reads as the newer of two that share a
 * timestamp. The hub article comes first because the evergreen cluster was written as one
 * batch and shares its dates; the topical articles below each carry a date of their own.
 */
import { article as addNuraChainToYourWallet } from './add-nura-chain-to-your-wallet/article.ts';
import { article as aiAgentPaymentsCardsAndX402 } from './ai-agent-payments-cards-and-x402/article.ts';
import { article as aiAgentsOnchainPaymentsX402 } from './ai-agents-onchain-payments-x402/article.ts';
import { article as buildADappOnNuraChain } from './build-a-dapp-on-nura-chain/article.ts';
import { article as circleArcMainnetStablecoinChain } from './circle-arc-mainnet-stablecoin-chain/article.ts';
import { article as clarityActSenateVoteFails } from './clarity-act-senate-vote-fails/article.ts';
import { article as connectToNuraChainRpc } from './connect-to-nura-chain-rpc/article.ts';
import { article as createAnErc20TokenOnNuraChain } from './create-an-erc-20-token-on-nura-chain/article.ts';
import { article as crossChainIntentsErc7683 } from './cross-chain-intents-erc-7683/article.ts';
import { article as defiTvlQ32026 } from './defi-tvl-q3-2026/article.ts';
import { article as deployASmartContractOnNuraChain } from './deploy-a-smart-contract-on-nura-chain/article.ts';
import { article as eip7702SmartAccounts } from './eip-7702-smart-accounts/article.ts';
import { article as ethereumGlamsterdamUpgrade } from './ethereum-glamsterdam-upgrade/article.ts';
import { article as geniusActStablecoinRules } from './genius-act-stablecoin-rules/article.ts';
import { article as howToUseNuraChainExplorer } from './how-to-use-nura-chain-explorer/article.ts';
import { article as liquidNetworkExploitExplained } from './liquid-network-exploit-explained/article.ts';
import { article as micaBankCryptoCustodyEurope } from './mica-bank-crypto-custody-europe/article.ts';
import { article as nuraChainEvmCompatibility } from './nura-chain-evm-compatibility/article.ts';
import { article as nuraCoinTokenomics } from './nura-coin-tokenomics/article.ts';
import { article as postQuantumBlockchain2029 } from './post-quantum-blockchain-2029/article.ts';
import { article as predictionMarketsNewYorkLawsuit } from './prediction-markets-new-york-lawsuit/article.ts';
import { article as solanaAlpenglowUpgrade } from './solana-alpenglow-upgrade/article.ts';
import { article as southKoreaTokenizedSecurities2027 } from './south-korea-tokenized-securities-2027/article.ts';
import { article as tokenUnlocksAndSupplySchedules } from './token-unlocks-and-supply-schedules/article.ts';
import { article as tokenizedDepositsSwiftWeekendPayment } from './tokenized-deposits-swift-weekend-payment/article.ts';
import { article as tokenizedTreasuriesRwa2026 } from './tokenized-treasuries-rwa-2026/article.ts';
import { article as whatGasActuallyCostsIn2026 } from './what-gas-actually-costs-in-2026/article.ts';
import { article as whatIsNuraChain } from './what-is-nura-chain/article.ts';
import { article as whyAuditedContractsGetDrained } from './why-audited-contracts-get-drained/article.ts';

import { article as whyBuildOnAnEvmCompatibleChain } from './why-build-on-an-evm-compatible-chain/article.ts';
import { article as whySoManyEvmChains } from './why-so-many-evm-chains/article.ts';
import { article as zkevmProofsEthereumEip8025 } from './zkevm-proofs-ethereum-eip-8025/article.ts';

import type { Article } from './types.ts';

export const ARTICLES: readonly Article[] = [
    whatIsNuraChain,
    nuraChainEvmCompatibility,
    connectToNuraChainRpc,
    addNuraChainToYourWallet,
    deployASmartContractOnNuraChain,
    createAnErc20TokenOnNuraChain,
    howToUseNuraChainExplorer,
    buildADappOnNuraChain,
    nuraCoinTokenomics,
    whyBuildOnAnEvmCompatibleChain,

    // Topical, newest last. Each carries its own publishedAt, so this block's order
    // only matters to a reader of this file.
    tokenUnlocksAndSupplySchedules,
    whatGasActuallyCostsIn2026,
    whySoManyEvmChains,
    crossChainIntentsErc7683,
    whyAuditedContractsGetDrained,
    tokenizedTreasuriesRwa2026,
    aiAgentsOnchainPaymentsX402,
    geniusActStablecoinRules,
    eip7702SmartAccounts,
    ethereumGlamsterdamUpgrade,

    // The news batch of early October 2026: each reports a dated event, and none is dated
    // earlier than the event it reports.
    southKoreaTokenizedSecurities2027,
    tokenizedDepositsSwiftWeekendPayment,
    liquidNetworkExploitExplained,
    postQuantumBlockchain2029,
    clarityActSenateVoteFails,
    circleArcMainnetStablecoinChain,
    micaBankCryptoCustodyEurope,
    zkevmProofsEthereumEip8025,
    aiAgentPaymentsCardsAndX402,
    solanaAlpenglowUpgrade,
    defiTvlQ32026,
    predictionMarketsNewYorkLawsuit
];
