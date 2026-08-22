/**
 * The articles this repository publishes, in the order they are seeded.
 *
 * Order is not display order - the blog sorts by publication date - but it is the order the
 * seed script writes in, so a post listed earlier gets an earlier `published_at` when the
 * whole cluster is seeded in one run. The hub article comes first for that reason.
 */
import { article as addNuraChainToYourWallet } from './add-nura-chain-to-your-wallet/article.ts';
import { article as buildADappOnNuraChain } from './build-a-dapp-on-nura-chain/article.ts';
import { article as connectToNuraChainRpc } from './connect-to-nura-chain-rpc/article.ts';
import { article as createAnErc20TokenOnNuraChain } from './create-an-erc-20-token-on-nura-chain/article.ts';
import { article as deployASmartContractOnNuraChain } from './deploy-a-smart-contract-on-nura-chain/article.ts';
import { article as howToUseNuraChainExplorer } from './how-to-use-nura-chain-explorer/article.ts';
import { article as nuraChainEvmCompatibility } from './nura-chain-evm-compatibility/article.ts';
import { article as nuraCoinTokenomics } from './nura-coin-tokenomics/article.ts';
import { article as whatIsNuraChain } from './what-is-nura-chain/article.ts';

import { article as whyBuildOnAnEvmCompatibleChain } from './why-build-on-an-evm-compatible-chain/article.ts';

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
    whyBuildOnAnEvmCompatibleChain
];
