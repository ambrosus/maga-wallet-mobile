import { APP_COMMON_TOKENS } from '@constants/tokens';
import { SWAP_SUPPORTED_TOKENS } from '@core/dex/entities';

const environments = {
  production: {
    ENV: 'production',
    CHAIN_ID: 16718,
    NETWORK_URL: 'https://network.ambrosus.io',
    actions: {
      send: true,
      swap: true,
      receive: true
    },
    ROUTER_V2_ADDRESS: '0xf7237C595425b49Eaeb3Dc930644de6DCa09c3C4',
    FACTORY_ADDRESS: '0x2b6852CeDEF193ece9814Ee99BE4A4Df7F463557',
    SWAP_TOKENS: SWAP_SUPPORTED_TOKENS.tokens.prod,
    TOKENS: APP_COMMON_TOKENS.PROD,
    // Graph Endpoints
    AMBRODEO_TOKENS_GRAPH_URL: 'https://graph.ambrosus.io/graphql',
    CURRENCY_GRAPH_URL: 'https://graph.ambrosus.io/graphql'
  },
  staging: {
    ENV: 'staging',
    CHAIN_ID: 16718,
    NETWORK_URL: 'https://network.ambrosus.io',
    actions: {
      send: true,
      swap: true,
      receive: true
    },
    ROUTER_V2_ADDRESS: '0xf7237C595425b49Eaeb3Dc930644de6DCa09c3C4',
    FACTORY_ADDRESS: '0x2b6852CeDEF193ece9814Ee99BE4A4Df7F463557',
    SWAP_TOKENS: SWAP_SUPPORTED_TOKENS.tokens.prod,
    TOKENS: APP_COMMON_TOKENS.PROD,
    // Graph Endpoints
    AMBRODEO_TOKENS_GRAPH_URL: 'https://graph.ambrosus.io/graphql',
    CURRENCY_GRAPH_URL: 'https://graph.ambrosus.io/graphql'
  },
  testnet: {
    ENV: 'testnet',
    CHAIN_ID: 22040,
    NETWORK_URL: 'https://network.ambrosus-test.io',
    actions: {
      send: true,
      swap: true,
      receive: true
    },
    ROUTER_V2_ADDRESS: '0xA3E524dFc9deA66aE32e81a5E2B4DF24F56e2CBc',
    FACTORY_ADDRESS: '0x7bf4227eDfAA6823aD577dc198DbCadECccbEb07',
    SWAP_TOKENS: SWAP_SUPPORTED_TOKENS.tokens.testnet,
    TOKENS: APP_COMMON_TOKENS.TESTNET,
    // Graph Endpoints
    CURRENCY_GRAPH_URL:
      'https://graph-node-api.ambrosus.io/subgraphs/name/airdao/astra-price-test-b',
    AMBRODEO_TOKENS_GRAPH_URL:
      'https://graph-node-api.ambrosus-test.io/subgraphs/name/airdao/ambrodeo'
  }
} as const;

export const Config = environments.testnet;
