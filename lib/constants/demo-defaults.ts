import type { BaseToken } from "@lifi/sdk";

export const DEMO_INTEGRATOR = "jackcc-lifi-public-demo";

export const SUPPORTED_CHAIN_IDS = [42161, 10, 137, 8453, 1] as const;
export const WIDGET_ALLOWED_CHAIN_IDS = [42161, 10, 137] as const;

export const CHAIN_LABELS: Record<number, string> = {
  1: "Ethereum",
  10: "Optimism",
  137: "Polygon",
  8453: "Base",
  42161: "Arbitrum",
};

export const PRIMARY_ROUTE = {
  fromChainId: 42161,
  toChainId: 10,
  fromLabel: "Arbitrum",
  toLabel: "Optimism",
  tokenSymbol: "USDC",
} as const;

export const FALLBACK_ROUTE = {
  fromChainId: 42161,
  toChainId: 137,
  fromLabel: "Arbitrum",
  toLabel: "Polygon",
  tokenSymbol: "USDC",
} as const;

export const DEMO_FROM_ADDRESS =
  "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

export const TOKEN_PRIORITY = ["USDC", "USDT", "DAI", "WETH", "ETH", "WBTC"] as const;

export const PREFERRED_TOKEN_BY_CHAIN: Record<number, string> = {
  1: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  10: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
  137: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
  8453: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
  42161: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
};

export const WIDGET_ALLOWED_TOKENS: BaseToken[] = [
  {
    chainId: PRIMARY_ROUTE.fromChainId,
    address: PREFERRED_TOKEN_BY_CHAIN[PRIMARY_ROUTE.fromChainId],
  },
  {
    chainId: PRIMARY_ROUTE.toChainId,
    address: PREFERRED_TOKEN_BY_CHAIN[PRIMARY_ROUTE.toChainId],
  },
  {
    chainId: FALLBACK_ROUTE.toChainId,
    address: PREFERRED_TOKEN_BY_CHAIN[FALLBACK_ROUTE.toChainId],
  },
];

export const WIDGET_DEFAULTS = {
  fromChain: PRIMARY_ROUTE.fromChainId,
  toChain: PRIMARY_ROUTE.toChainId,
  fromToken: PREFERRED_TOKEN_BY_CHAIN[PRIMARY_ROUTE.fromChainId],
  toToken: PREFERRED_TOKEN_BY_CHAIN[PRIMARY_ROUTE.toChainId],
} as const;

export const STATUS_HELP_TEXT =
  "Paste a previously executed cross-chain transaction hash to inspect the LI.FI status lifecycle.";

export function getPreferredTokenAddress(chainId: number) {
  return PREFERRED_TOKEN_BY_CHAIN[chainId] ?? "";
}
