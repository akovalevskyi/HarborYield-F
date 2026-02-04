"use client";

import { createAppKit } from "@reown/appkit/react";
import { appKitConfig } from "src/config/appkit";

if (!globalThis.__appKit) {
  globalThis.__appKit = createAppKit(appKitConfig);
}

export const appKit = globalThis.__appKit;
