import { z } from "zod";
import { isAddress, isHash } from "viem";

const amountSchema = z
  .string()
  .trim()
  .min(1, "Enter an amount.")
  .regex(/^\d+(\.\d+)?$/, "Amount must be a positive decimal string.")
  .refine((value) => Number(value) > 0, "Amount must be greater than 0.");

const demoTokenSchema = z.object({
  chainId: z.number().int().positive(),
  address: z.string().refine(isAddress, "Invalid token address."),
  symbol: z.string().min(1),
  name: z.string().min(1),
  decimals: z.number().int().min(0).max(36),
  logoURI: z.string().optional(),
  priceUSD: z.string().optional(),
  recommended: z.boolean().optional(),
});

export const sdkFormSchema = z
  .object({
    fromChainId: z.number().int().positive(),
    toChainId: z.number().int().positive(),
    fromTokenAddress: z.string().refine(isAddress, "Select a valid source token."),
    toTokenAddress: z.string().refine(isAddress, "Select a valid destination token."),
    amount: amountSchema,
    fromAddress: z.string().trim().refine(isAddress, "Enter a valid EVM wallet address."),
  })
  .refine((value) => value.fromChainId !== value.toChainId, {
    path: ["toChainId"],
    message: "Choose two different chains for a bridge demo.",
  });

export const sdkRequestSchema = z
  .object({
    fromChain: z.number().int().positive(),
    toChain: z.number().int().positive(),
    fromToken: demoTokenSchema,
    toToken: demoTokenSchema,
    amount: amountSchema,
    fromAddress: z.string().trim().refine(isAddress, "Enter a valid EVM wallet address."),
  })
  .superRefine((value, context) => {
    if (value.fromChain === value.toChain) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["toChain"],
        message: "Choose two different chains for a bridge demo.",
      });
    }

    if (value.fromToken.chainId !== value.fromChain) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["fromToken"],
        message: "The selected source token does not belong to the selected source chain.",
      });
    }

    if (value.toToken.chainId !== value.toChain) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["toToken"],
        message:
          "The selected destination token does not belong to the selected destination chain.",
      });
    }

    const fraction = value.amount.split(".")[1]?.length ?? 0;

    if (fraction > value.fromToken.decimals) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amount"],
        message: `Amount exceeds the token precision of ${value.fromToken.decimals} decimals.`,
      });
    }
  });

export const statusQuerySchema = z.object({
  txHash: z.string().trim().refine(isHash, "Enter a valid EVM transaction hash."),
  fromChain: z.number().int().positive().optional(),
  toChain: z.number().int().positive().optional(),
  bridge: z.string().trim().min(1).optional(),
});

export type SdkFormValues = z.input<typeof sdkFormSchema>;
