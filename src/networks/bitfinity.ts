import { getProviderForNetwork, proxyRpcEndpoint } from '@/handlers/web3';
import { Network, NetworkProperties } from './types';
import { gasUtils } from '@/utils';
import { getBlastGasPrices } from '@/redux/gas';
import { getRemoteConfig } from '@/model/remoteConfig';
import { BITFINITY_TESTNET_RPC } from 'react-native-dotenv';
import { BTF_BITFINITY_ADDRESS } from '@/references';

const BITFINITY_CHAIN_ID = 355113;

export const getBitfinityNetworkObject = (): NetworkProperties => {
  const { bitfinity_enabled, bitfinity_tx_enabled } = getRemoteConfig();
  return {
    // network related data
    id: BITFINITY_CHAIN_ID,
    name: 'Bitfinity',
    enabled: bitfinity_enabled,
    network: 'bitfinity',
    longName: 'Bitfinity',
    value: Network.bitfinity,
    networkType: 'testnet',
    blockTimeInMs: 5_000,

    nativeCurrency: {
      name: 'BTF',
      symbol: 'BTF',
      decimals: 18,
      address: BTF_BITFINITY_ADDRESS,
    },

    balanceCheckerAddress: '',
    rpc: proxyRpcEndpoint(BITFINITY_CHAIN_ID),
    getProvider: getProviderForNetwork(Network.bitfinity),

    // features
    features: {
      txHistory: true,
      flashbots: false,
      walletconnect: true,
      swaps: false,
      nfts: true,
      pools: true,
      txs: bitfinity_tx_enabled,
    },

    gas: {
      speeds: [gasUtils.NORMAL, gasUtils.FAST, gasUtils.URGENT, gasUtils.CUSTOM],
      // ?
      gasType: 'eip1559',
      roundGasDisplay: true,

      // this prob can just be blockTime,
      pollingIntervalInMs: 5_000,

      getGasPrices: getBlastGasPrices,
    },

    swaps: {
      defaultSlippage: 200,
    },

    nfts: {},

    // design tings
    colors: {
      light: '#25292E',
      dark: '#FCFC03',
    },

    rpcUrls: {
      public: { http: [BITFINITY_TESTNET_RPC as string] },
      default: {
        http: [BITFINITY_TESTNET_RPC as string],
      },
    },
  };
};
