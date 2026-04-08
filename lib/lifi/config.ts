import { DEMO_INTEGRATOR } from "@/lib/constants/demo-defaults";

export const lifiConfig = {
  integrator: process.env.LIFI_INTEGRATOR?.trim() || DEMO_INTEGRATOR,
  apiKey: process.env.LIFI_API_KEY?.trim() || undefined,
};
