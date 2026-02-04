(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/components/Banner.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Banner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$wagmi$2f$core$2f$dist$2f$esm$2f$actions$2f$waitForTransactionReceipt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@wagmi/core/dist/esm/actions/waitForTransactionReceipt.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useConnection__as__useAccount$3e$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/useConnection.js [app-client] (ecmascript) <export useConnection as useAccount>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useChainId$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/useChainId.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useSwitchChain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/useSwitchChain.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useWriteContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/useWriteContract.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'src/config/appkit'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module 'src/data/assets.json'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const usdxFaucetAbi = [
    {
        type: "function",
        name: "faucet",
        stateMutability: "nonpayable",
        inputs: [],
        outputs: []
    }
];
const SEPOLIA_ID = 11155111;
const AMOY_ID = 80002;
function Banner() {
    _s();
    const { address, isConnected } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useConnection__as__useAccount$3e$__["useAccount"])();
    const chainId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useChainId$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChainId"])();
    const { switchChainAsync } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useSwitchChain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSwitchChain"])();
    const { writeContractAsync } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useWriteContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWriteContract"])();
    const [faucetBusy, setFaucetBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleAddNetwork = async (targetChainId)=>{
        const ethereum = globalThis?.ethereum;
        if (!ethereum?.request) return;
        try {
            if (targetChainId === SEPOLIA_ID) {
                const chainParams = {
                    chainId: "0xaa36a7",
                    chainName: "Sepolia",
                    nativeCurrency: {
                        name: "Sepolia ETH",
                        symbol: "ETH",
                        decimals: 18
                    },
                    rpcUrls: [
                        "https://ethereum-sepolia-rpc.publicnode.com"
                    ],
                    blockExplorerUrls: [
                        "https://sepolia.etherscan.io"
                    ]
                };
                try {
                    await ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [
                            {
                                chainId: chainParams.chainId
                            }
                        ]
                    });
                } catch (err) {
                    if (err?.code !== 4902) throw err;
                    await ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            chainParams
                        ]
                    });
                }
                return;
            }
            if (targetChainId === AMOY_ID) {
                const chainParams = {
                    chainId: "0x13882",
                    chainName: "Polygon Amoy",
                    nativeCurrency: {
                        name: "Polygon",
                        symbol: "POL",
                        decimals: 18
                    },
                    rpcUrls: [
                        "https://polygon-amoy-bor-rpc.publicnode.com"
                    ],
                    blockExplorerUrls: [
                        "https://amoy.polygonscan.com"
                    ]
                };
                try {
                    await ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [
                            {
                                chainId: chainParams.chainId
                            }
                        ]
                    });
                } catch (err) {
                    if (err?.code !== 4902) throw err;
                    await ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            chainParams
                        ]
                    });
                }
            }
        } catch (err) {
            console.warn("Add network error:", err);
        }
    };
    const handleAddToken = async (targetChainId)=>{
        const network = assetsData?.networks?.[String(targetChainId)];
        if (!network) return;
        if (chainId !== targetChainId) {
            try {
                await switchChainAsync({
                    chainId: targetChainId
                });
            } catch (err) {
                console.warn("Switch chain error:", err);
                return;
            }
        }
        const target = assetsData?.networks?.[String(targetChainId)];
        if (!target?.usdx) return;
        const ethereum = globalThis?.ethereum;
        if (!ethereum?.request) return;
        try {
            await ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20",
                    options: {
                        address: target.usdx,
                        symbol: "USDx",
                        decimals: 6
                    }
                }
            });
        } catch (err) {
            console.warn("Add token error:", err);
        }
    };
    const handleFaucet = async (targetChainId)=>{
        const target = assetsData?.networks?.[String(targetChainId)];
        if (!target?.usdx || !isConnected || !address) return;
        try {
            setFaucetBusy(targetChainId);
            if (chainId !== targetChainId) {
                await switchChainAsync({
                    chainId: targetChainId
                });
            }
            const hash = await writeContractAsync({
                address: target.usdx,
                abi: usdxFaucetAbi,
                functionName: "faucet",
                args: [],
                chainId: targetChainId
            });
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$wagmi$2f$core$2f$dist$2f$esm$2f$actions$2f$waitForTransactionReceipt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["waitForTransactionReceipt"])(wagmiConfig, {
                hash
            });
        } catch (err) {
            console.warn("Faucet error:", err);
        } finally{
            setFaucetBusy(null);
        }
    };
    const buttons = [
        {
            label: faucetBusy === SEPOLIA_ID ? "Faucet USDx (Sepolia)..." : "Faucet USDx (Sepolia)",
            onClick: ()=>handleFaucet(SEPOLIA_ID),
            disabled: faucetBusy === SEPOLIA_ID
        },
        {
            label: faucetBusy === AMOY_ID ? "Faucet USDx (Amoy)..." : "Faucet USDx (Amoy)",
            onClick: ()=>handleFaucet(AMOY_ID),
            disabled: faucetBusy === AMOY_ID
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "banner",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "banner-text",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: "This project runs on test networks: Sepolia, Amoy, Oasis Sapphire. Use USDx (USDC/USDT-like) to interact."
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Banner.js",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Sepolia USDx: ",
                            assetsData?.networks?.["11155111"]?.usdx ?? "—"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/Banner.js",
                        lineNumber: 156,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Amoy USDx: ",
                            assetsData?.networks?.["80002"]?.usdx ?? "—"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/Banner.js",
                        lineNumber: 157,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/Banner.js",
                lineNumber: 151,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "banner-actions",
                children: buttons.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "pill",
                        type: "button",
                        onClick: item.onClick,
                        disabled: item.disabled,
                        children: item.label
                    }, item.label, false, {
                        fileName: "[project]/src/app/components/Banner.js",
                        lineNumber: 161,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/components/Banner.js",
                lineNumber: 159,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/Banner.js",
        lineNumber: 150,
        columnNumber: 5
    }, this);
}
_s(Banner, "P47Q+g/0BpSsJLKk+hqh5BzYwJk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useConnection__as__useAccount$3e$__["useAccount"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useChainId$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChainId"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useSwitchChain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSwitchChain"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useWriteContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWriteContract"]
    ];
});
_c = Banner;
var _c;
__turbopack_context__.k.register(_c, "Banner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/Header.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useConnection__as__useAccount$3e$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/useConnection.js [app-client] (ecmascript) <export useConnection as useAccount>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useChainId$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/useChainId.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/useReadContract.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$constants$2f$abis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/constants/abis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$formatUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/utils/unit/formatUnits.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'src/app/lib/appkitClient'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module 'src/app/lib/usdx'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const chainIconMap = {
    11155111: "/eth.svg",
    80002: "/pol.svg"
};
function shortAddress(address) {
    if (!address) return "";
    return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
function formatBalance(value) {
    if (value == null) return "--";
    const num = Number(value);
    if (!Number.isFinite(num)) return "--";
    return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 2
    }).format(num);
}
function Header() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { address, isConnected } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useConnection__as__useAccount$3e$__["useAccount"])();
    const chainId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useChainId$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChainId"])();
    const usdxAddress = USDX_BY_CHAIN[chainId];
    const { data: balance } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"])({
        abi: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$constants$2f$abis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["erc20Abi"],
        address: usdxAddress ?? "0x0000000000000000000000000000000000000000",
        functionName: "balanceOf",
        args: address ? [
            address
        ] : undefined,
        query: {
            enabled: Boolean(isConnected && address && usdxAddress),
            refetchInterval: 12000
        }
    });
    const balanceDisplay = isConnected && balance ? formatBalance((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$formatUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatUnits"])(balance, USDX_DECIMALS)) : "--";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "header",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "logo",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "logo-mark",
                    children: "RWA Hub"
                }, void 0, false, {
                    fileName: "[project]/src/app/components/Header.js",
                    lineNumber: 51,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/components/Header.js",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "nav",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        className: pathname === "/" ? "active" : "",
                        href: "/",
                        children: "Shop"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Header.js",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        className: pathname === "/marketplace" ? "active" : "",
                        href: "/marketplace",
                        children: "Marketplace"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Header.js",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        className: pathname === "/dashboard" ? "active" : "",
                        href: "/dashboard",
                        children: "Dashboard"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Header.js",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/Header.js",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "wallet",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "balance",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "label",
                                children: "USDx Balance:"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/Header.js",
                                lineNumber: 66,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "value",
                                children: balanceDisplay
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/Header.js",
                                lineNumber: 67,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/Header.js",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `connect ${isConnected ? "connected" : ""}`,
                        type: "button",
                        onClick: ()=>{
                            appKit?.open?.();
                        },
                        children: isConnected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "connect-inner",
                            children: [
                                chainIconMap[chainId] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    className: "chain-icon",
                                    src: chainIconMap[chainId],
                                    alt: "",
                                    "aria-hidden": "true"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/Header.js",
                                    lineNumber: 79,
                                    columnNumber: 17
                                }, this) : null,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: shortAddress(address)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/Header.js",
                                    lineNumber: 81,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/Header.js",
                            lineNumber: 77,
                            columnNumber: 13
                        }, this) : "Connect Wallet"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/Header.js",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/Header.js",
                lineNumber: 64,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/Header.js",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_s(Header, "Czos0X4d0upRcy24SkLNY+jGQtM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useConnection__as__useAccount$3e$__["useAccount"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useChainId$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChainId"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"]
    ];
});
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/Footer.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function Footer() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "footer",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "footer-left",
                children: "HackMoney 2026 Project"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Footer.js",
                lineNumber: 4,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "footer-right",
                children: "In Code we trust"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Footer.js",
                lineNumber: 5,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/Footer.js",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
_c = Footer;
var _c;
__turbopack_context__.k.register(_c, "Footer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/Shell.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Shell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$Banner$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/Banner.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$Header$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/Header.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$Footer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/Footer.js [app-client] (ecmascript)");
;
;
;
;
function Shell({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$Banner$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/components/Shell.js",
                lineNumber: 8,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$Header$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/components/Shell.js",
                lineNumber: 9,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "main",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/app/components/Shell.js",
                lineNumber: 10,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$Footer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/components/Shell.js",
                lineNumber: 11,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/Shell.js",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Shell;
var _c;
__turbopack_context__.k.register(_c, "Shell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/BlockingModal.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BlockingModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function BlockingModal({ open, message }) {
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "modal-backdrop",
        role: "status",
        "aria-live": "polite",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "modal modal-processing",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "spinner",
                    "aria-hidden": "true"
                }, void 0, false, {
                    fileName: "[project]/src/app/components/BlockingModal.js",
                    lineNumber: 8,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "modal-title",
                    children: "Processing"
                }, void 0, false, {
                    fileName: "[project]/src/app/components/BlockingModal.js",
                    lineNumber: 9,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "modal-text",
                    children: message ?? "Please wait..."
                }, void 0, false, {
                    fileName: "[project]/src/app/components/BlockingModal.js",
                    lineNumber: 10,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "modal-note",
                    children: "Testnet transactions can take up to 2 minutes. Thanks for your patience."
                }, void 0, false, {
                    fileName: "[project]/src/app/components/BlockingModal.js",
                    lineNumber: 11,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/components/BlockingModal.js",
            lineNumber: 7,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/components/BlockingModal.js",
        lineNumber: 6,
        columnNumber: 5
    }, this);
}
_c = BlockingModal;
var _c;
__turbopack_context__.k.register(_c, "BlockingModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/ReceiptModal.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ReceiptModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function ReceiptModal({ open, href, label, title, subtitle, onClose }) {
    if (!open || !href) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "modal-backdrop",
        role: "dialog",
        "aria-modal": "true",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "modal modal-receipt",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "modal-title",
                    children: title ?? "Receipt Ready"
                }, void 0, false, {
                    fileName: "[project]/src/app/components/ReceiptModal.js",
                    lineNumber: 8,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "modal-text",
                    children: subtitle ?? "Your Oasis receipt is recorded."
                }, void 0, false, {
                    fileName: "[project]/src/app/components/ReceiptModal.js",
                    lineNumber: 9,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                    className: "receipt-link",
                    href: href,
                    target: "_blank",
                    rel: "noreferrer",
                    children: label ?? "View receipt in Oasis"
                }, void 0, false, {
                    fileName: "[project]/src/app/components/ReceiptModal.js",
                    lineNumber: 10,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "receipt-close",
                    onClick: onClose,
                    children: "Close"
                }, void 0, false, {
                    fileName: "[project]/src/app/components/ReceiptModal.js",
                    lineNumber: 13,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/components/ReceiptModal.js",
            lineNumber: 7,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/components/ReceiptModal.js",
        lineNumber: 6,
        columnNumber: 5
    }, this);
}
_c = ReceiptModal;
var _c;
__turbopack_context__.k.register(_c, "ReceiptModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/assets.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v(JSON.parse("{\"networks\":{\"11155111\":{\"name\":\"sepolia\",\"explorer\":\"https://sepolia.etherscan.io\",\"usdx\":\"0x7A99E83131C7bbc0568b59D64Fc547992a604515\",\"rwa1155\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"routerAndDelivery\":\"0x7BeFFe7cC797f3680eFCB48A46F960A087D46A35\",\"minterRole\":\"0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6\",\"faucet\":\"https://cloud.google.com/application/web3/faucet/ethereum/sepolia\"},\"80002\":{\"name\":\"amoy\",\"explorer\":\"https://amoy.polygonscan.com\",\"usdx\":\"0xa1db3C7Cea6Ae35ECB84773D8CdF58562e32C95e\",\"rwa1155\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"routerAndDelivery\":\"0x9CdbF3CbA0692779afa57Fc6E1Cf27B5eB82343F\",\"minterRole\":\"0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6\",\"faucet\":\"https://faucet.stakepool.dev.br/amoy\"}},\"assets\":[{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":101,\"name\":\"Villa\",\"subname\":\"Private Estate\",\"description\":\"A coastal villa with private gardens, fractionalized into on-chain units.\",\"category\":\"Real Estate\",\"healthScore\":75,\"priceUSDx\":40,\"image\":\"https://www.amaviacollection.com/wp-content/uploads/2022/05/Villa-Gaia-1-scaled.jpeg\",\"supplyForDemo\":500000},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":201,\"name\":\"Van Gogh Painting\",\"subname\":\"Post-Impressionist Masterpiece\",\"description\":\"Museum-grade artwork with provenance, issued as a tradable digital share.\",\"category\":\"Art\",\"healthScore\":95,\"priceUSDx\":20,\"image\":\"https://www.nationalgallery.org.uk/media/b2gj4uld/n-3861-00-000081-xl-hd.jpg\",\"supplyForDemo\":1000000},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":202,\"name\":\"Skyline Plaza Tokyo\",\"subname\":\"Metropoly\",\"description\":\"Fractional on-chain units tracking Skyline Plaza Tokyo, issued by Metropoly on Ethereum. Designed for demo exposure; yield-bearing. Indicative APR: 6.2%.\",\"category\":\"Real Estate\",\"healthScore\":35,\"issuer_score\":82,\"asset_url\":\"https://metropoly.io/skyline-tokyo\",\"priceUSDx\":100,\"image\":\"\",\"supplyForDemo\":850000,\"icon\":\"\",\"apr\":6.2,\"liquidity\":\"Mid\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":102,\"name\":\"Azure Coast Villa\",\"subname\":\"RealT\",\"description\":\"Fractional on-chain units tracking Azure Coast Villa, issued by RealT on Polygon. Designed for demo exposure; yield-bearing. Indicative APR: 8.5%.\",\"category\":\"Real Estate\",\"healthScore\":42,\"issuer_score\":91,\"asset_url\":\"https://realt.co/azure-villa\",\"priceUSDx\":100,\"image\":\"\",\"supplyForDemo\":42000,\"icon\":\"\",\"apr\":8.5,\"liquidity\":\"Low\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":203,\"name\":\"Berlin Tech Loft\",\"subname\":\"Brickken\",\"description\":\"Fractional on-chain units tracking Berlin Tech Loft, issued by Brickken on Base. Designed for demo exposure; yield-bearing. Indicative APR: 5.8%.\",\"category\":\"Real Estate\",\"healthScore\":38,\"issuer_score\":78,\"asset_url\":\"https://brickken.com/berlin-loft\",\"priceUSDx\":100,\"image\":\"\",\"supplyForDemo\":11000,\"icon\":\"\",\"apr\":5.8,\"liquidity\":\"Mid\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":103,\"name\":\"Manhattan Soho\",\"subname\":\"Lofty.ai\",\"description\":\"Fractional on-chain units tracking Manhattan Soho, issued by Lofty.ai on Ethereum. Designed for demo exposure; yield-bearing. Indicative APR: 4.5%.\",\"category\":\"Real Estate\",\"healthScore\":25,\"issuer_score\":89,\"asset_url\":\"https://lofty.ai/manhattan-soho\",\"priceUSDx\":50,\"image\":\"\",\"supplyForDemo\":250000,\"icon\":\"\",\"apr\":4.5,\"liquidity\":\"High\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":204,\"name\":\"London Shard U42\",\"subname\":\"EstateProtocol\",\"description\":\"Fractional on-chain units tracking London Shard U42, issued by EstateProtocol on Arbitrum. Designed for demo exposure; yield-bearing. Indicative APR: 4.2%.\",\"category\":\"Real Estate\",\"healthScore\":30,\"issuer_score\":75,\"asset_url\":\"https://ep.io/london-shard\",\"priceUSDx\":50,\"image\":\"\",\"supplyForDemo\":156000,\"icon\":\"\",\"apr\":4.2,\"liquidity\":\"Mid\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":104,\"name\":\"Dubai Marina Pent.\",\"subname\":\"Propbase\",\"description\":\"Fractional on-chain units tracking Dubai Marina Pent., issued by Propbase on BSC. Designed for demo exposure; yield-bearing. Indicative APR: 9.1%.\",\"category\":\"Real Estate\",\"healthScore\":55,\"issuer_score\":72,\"asset_url\":\"https://propbase.app/dubai-pm\",\"priceUSDx\":100,\"image\":\"\",\"supplyForDemo\":35000,\"icon\":\"\",\"apr\":9.1,\"liquidity\":\"Low\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":205,\"name\":\"Lisbon Heritage\",\"subname\":\"Landshare\",\"description\":\"Fractional on-chain units tracking Lisbon Heritage, issued by Landshare on Polygon. Designed for demo exposure; yield-bearing. Indicative APR: 7.3%.\",\"category\":\"Real Estate\",\"healthScore\":45,\"issuer_score\":80,\"asset_url\":\"https://landshare.io/lisbon\",\"priceUSDx\":100,\"image\":\"\",\"supplyForDemo\":180000,\"icon\":\"\",\"apr\":7.3,\"liquidity\":\"Mid\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":105,\"name\":\"Austin Eco-Village\",\"subname\":\"Vesta\",\"description\":\"Fractional on-chain units tracking Austin Eco-Village, issued by Vesta on Base. Designed for demo exposure; yield-bearing. Indicative APR: 10.2%.\",\"category\":\"Real Estate\",\"healthScore\":48,\"issuer_score\":68,\"asset_url\":\"https://vesta.equity/austin\",\"priceUSDx\":100,\"image\":\"\",\"supplyForDemo\":54000,\"icon\":\"\",\"apr\":10.2,\"liquidity\":\"Low\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":206,\"name\":\"Singapore Orchard\",\"subname\":\"DigiShare\",\"description\":\"Fractional on-chain units tracking Singapore Orchard, issued by DigiShare on Ethereum. Designed for demo exposure; yield-bearing. Indicative APR: 3.9%.\",\"category\":\"Real Estate\",\"healthScore\":22,\"issuer_score\":84,\"asset_url\":\"https://digishares.io/singapore\",\"priceUSDx\":50,\"image\":\"\",\"supplyForDemo\":124000,\"icon\":\"\",\"apr\":3.9,\"liquidity\":\"High\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":106,\"name\":\"Tulum Jungle Ret.\",\"subname\":\"SoluRWA\",\"description\":\"Fractional on-chain units tracking Tulum Jungle Ret., issued by SoluRWA on BSC. Designed for demo exposure; yield-bearing. Indicative APR: 12.5%.\",\"category\":\"Real Estate\",\"healthScore\":65,\"issuer_score\":65,\"asset_url\":\"https://solulab.com/tulum\",\"priceUSDx\":50,\"image\":\"\",\"supplyForDemo\":42000,\"icon\":\"\",\"apr\":12.5,\"liquidity\":\"Low\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":207,\"name\":\"Toronto Data Ctr\",\"subname\":\"InfraChain\",\"description\":\"Fractional on-chain units tracking Toronto Data Ctr, issued by InfraChain on Arbitrum. Designed for demo exposure; yield-bearing. Indicative APR: 6.8%.\",\"category\":\"Real Estate\",\"healthScore\":28,\"issuer_score\":79,\"asset_url\":\"https://infrachain.io/toronto\",\"priceUSDx\":100,\"image\":\"\",\"supplyForDemo\":450000,\"icon\":\"\",\"apr\":6.8,\"liquidity\":\"Mid\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":107,\"name\":\"Paris Boutique Hot.\",\"subname\":\"Curio\",\"description\":\"Fractional on-chain units tracking Paris Boutique Hot., issued by Curio on Polygon. Designed for demo exposure; yield-bearing. Indicative APR: 7.9%.\",\"category\":\"Real Estate\",\"healthScore\":40,\"issuer_score\":86,\"asset_url\":\"https://curioinvest.com/paris\",\"priceUSDx\":100,\"image\":\"\",\"supplyForDemo\":95000,\"icon\":\"\",\"apr\":7.9,\"liquidity\":\"Low\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":208,\"name\":\"Gold Bullion (LBMA)\",\"subname\":\"PAXOS\",\"description\":\"Tokenized demo exposure referencing Gold Bullion (LBMA), issued by PAXOS on Ethereum. Designed for commodity-style tracking; non-yield.\",\"category\":\"Commodities\",\"healthScore\":12,\"issuer_score\":97,\"asset_url\":\"https://paxos.com/paxg\",\"priceUSDx\":1000,\"image\":\"\",\"supplyForDemo\":2350,\"icon\":\"\",\"apr\":false,\"liquidity\":\"High\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":108,\"name\":\"Brent Crude 2026\",\"subname\":\"OilToken\",\"description\":\"Tokenized demo exposure referencing Brent Crude 2026, issued by OilToken on BSC. Designed for commodity-style tracking; non-yield.\",\"category\":\"Commodities\",\"healthScore\":60,\"issuer_score\":60,\"asset_url\":\"https://oiltoken.io/brent\",\"priceUSDx\":56,\"image\":\"\",\"supplyForDemo\":100000,\"icon\":\"\",\"apr\":false,\"liquidity\":\"Mid\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":209,\"name\":\"Premium Arabica\",\"subname\":\"AgroChain\",\"description\":\"Tokenized demo exposure referencing Premium Arabica, issued by AgroChain on Polygon. Designed for commodity-style tracking; non-yield.\",\"category\":\"Commodities\",\"healthScore\":52,\"issuer_score\":58,\"asset_url\":\"https://agrochain.com/coffee\",\"priceUSDx\":50,\"image\":\"\",\"supplyForDemo\":8400,\"icon\":\"\",\"apr\":false,\"liquidity\":\"Low\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":109,\"name\":\"SME Loan Pool\",\"subname\":\"Credix\",\"description\":\"Tokenized demo note referencing SME Loan Pool, issued by Credix on Polygon. Structured for credit-style exposure; yield-bearing. Indicative APR: 14.2%.\",\"category\":\"Private Credit\",\"healthScore\":58,\"issuer_score\":81,\"asset_url\":\"https://credix.finance/sme\",\"priceUSDx\":100,\"image\":\"\",\"supplyForDemo\":12000,\"icon\":\"\",\"apr\":14.2,\"liquidity\":\"Mid\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":210,\"name\":\"Solar Farm Bond\",\"subname\":\"Centrifuge\",\"description\":\"Tokenized demo note referencing Solar Farm Bond, issued by Centrifuge on Base. Structured for credit-style exposure; yield-bearing. Indicative APR: 9.5%.\",\"category\":\"Private Credit\",\"healthScore\":35,\"issuer_score\":92,\"asset_url\":\"https://centrifuge.io/solar\",\"priceUSDx\":50,\"image\":\"\",\"supplyForDemo\":200000,\"icon\":\"\",\"apr\":9.5,\"liquidity\":\"Low\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":110,\"name\":\"LatAm Micro-Fin.\",\"subname\":\"Goldfinch\",\"description\":\"Tokenized demo note referencing LatAm Micro-Fin., issued by Goldfinch on BSC. Structured for credit-style exposure; yield-bearing. Indicative APR: 18%.\",\"category\":\"Private Credit\",\"healthScore\":72,\"issuer_score\":88,\"asset_url\":\"https://goldfinch.finance/latam\",\"priceUSDx\":10,\"image\":\"\",\"supplyForDemo\":50000,\"icon\":\"\",\"apr\":18.0,\"liquidity\":\"Low\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":211,\"name\":\"RE Bridge Loan\",\"subname\":\"Maple Fin\",\"description\":\"Tokenized demo note referencing RE Bridge Loan, issued by Maple Fin on Ethereum. Structured for credit-style exposure; yield-bearing. Indicative APR: 11.5%.\",\"category\":\"Private Credit\",\"healthScore\":45,\"issuer_score\":90,\"asset_url\":\"https://maple.finance/re-bridge\",\"priceUSDx\":100,\"image\":\"\",\"supplyForDemo\":34000,\"icon\":\"\",\"apr\":11.5,\"liquidity\":\"Mid\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":111,\"name\":\"Supply Chain Fin.\",\"subname\":\"Clearpool\",\"description\":\"Tokenized demo note referencing Supply Chain Fin., issued by Clearpool on Arbitrum. Structured for credit-style exposure; yield-bearing. Indicative APR: 12.2%.\",\"category\":\"Private Credit\",\"healthScore\":50,\"issuer_score\":85,\"asset_url\":\"https://clearpool.finance/sc\",\"priceUSDx\":100,\"image\":\"\",\"supplyForDemo\":25000,\"icon\":\"\",\"apr\":12.2,\"liquidity\":\"Mid\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":212,\"name\":\"SpaceX Secondary\",\"subname\":\"Forge\",\"description\":\"Tokenized demo allocation referencing SpaceX Secondary, issued by Forge on Arbitrum. Intended for simulated PE-style exposure; non-yield.\",\"category\":\"Private Equity\",\"healthScore\":75,\"issuer_score\":91,\"asset_url\":\"https://forge.com/spacex\",\"priceUSDx\":100,\"image\":\"\",\"supplyForDemo\":500000,\"icon\":\"\",\"apr\":false,\"liquidity\":\"Low\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":112,\"name\":\"OpenAI Series E\",\"subname\":\"EquityZen\",\"description\":\"Tokenized demo allocation referencing OpenAI Series E, issued by EquityZen on Ethereum. Intended for simulated PE-style exposure; non-yield.\",\"category\":\"Private Equity\",\"healthScore\":80,\"issuer_score\":88,\"asset_url\":\"https://equityzen.com/openai\",\"priceUSDx\":50,\"image\":\"\",\"supplyForDemo\":1500000,\"icon\":\"\",\"apr\":false,\"liquidity\":\"Low\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":213,\"name\":\"Revolut Growth\",\"subname\":\"Seedrs\",\"description\":\"Tokenized demo allocation referencing Revolut Growth, issued by Seedrs on Polygon. Intended for simulated PE-style exposure; non-yield.\",\"category\":\"Private Equity\",\"healthScore\":68,\"issuer_score\":83,\"asset_url\":\"https://seedrs.com/revolut\",\"priceUSDx\":100,\"image\":\"\",\"supplyForDemo\":200000,\"icon\":\"\",\"apr\":false,\"liquidity\":\"Low\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":113,\"name\":\"Databricks Pre-IPO\",\"subname\":\"Netcapital\",\"description\":\"Tokenized demo allocation referencing Databricks Pre-IPO, issued by Netcapital on Base. Intended for simulated PE-style exposure; non-yield.\",\"category\":\"Private Equity\",\"healthScore\":70,\"issuer_score\":76,\"asset_url\":\"https://netcapital.com/db\",\"priceUSDx\":100,\"image\":\"\",\"supplyForDemo\":150000,\"icon\":\"\",\"apr\":false,\"liquidity\":\"Low\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":214,\"name\":\"Canva Employee\",\"subname\":\"Crowdcube\",\"description\":\"Tokenized demo allocation referencing Canva Employee, issued by Crowdcube on Ethereum. Intended for simulated PE-style exposure; non-yield.\",\"category\":\"Private Equity\",\"healthScore\":65,\"issuer_score\":85,\"asset_url\":\"https://crowdcube.com/canva\",\"priceUSDx\":100,\"image\":\"\",\"supplyForDemo\":80000,\"icon\":\"\",\"apr\":false,\"liquidity\":\"Low\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":114,\"name\":\"Epic Games Stake\",\"subname\":\"Republic\",\"description\":\"Tokenized demo allocation referencing Epic Games Stake, issued by Republic on BSC. Intended for simulated PE-style exposure; non-yield.\",\"category\":\"Private Equity\",\"healthScore\":72,\"issuer_score\":87,\"asset_url\":\"https://republic.com/epic\",\"priceUSDx\":100,\"image\":\"\",\"supplyForDemo\":120000,\"icon\":\"\",\"apr\":false,\"liquidity\":\"Low\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":215,\"name\":\"Klarna Common\",\"subname\":\"Moonfare\",\"description\":\"Tokenized demo allocation referencing Klarna Common, issued by Moonfare on Arbitrum. Intended for simulated PE-style exposure; non-yield.\",\"category\":\"Private Equity\",\"healthScore\":78,\"issuer_score\":82,\"asset_url\":\"https://moonfare.com/klarna\",\"priceUSDx\":100,\"image\":\"\",\"supplyForDemo\":45000,\"icon\":\"\",\"apr\":false,\"liquidity\":\"Low\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":115,\"name\":\"Stripe Series I\",\"subname\":\"OurCrowd\",\"description\":\"Tokenized demo allocation referencing Stripe Series I, issued by OurCrowd on Ethereum. Intended for simulated PE-style exposure; non-yield.\",\"category\":\"Private Equity\",\"healthScore\":62,\"issuer_score\":89,\"asset_url\":\"https://ourcrowd.com/stripe\",\"priceUSDx\":100,\"image\":\"\",\"supplyForDemo\":300000,\"icon\":\"\",\"apr\":false,\"liquidity\":\"Low\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":216,\"name\":\"ByteDance Cayman\",\"subname\":\"Zanbato\",\"description\":\"Tokenized demo allocation referencing ByteDance Cayman, issued by Zanbato on Polygon. Intended for simulated PE-style exposure; non-yield.\",\"category\":\"Private Equity\",\"healthScore\":85,\"issuer_score\":70,\"asset_url\":\"https://zanbato.com/bd\",\"priceUSDx\":50,\"image\":\"\",\"supplyForDemo\":500000,\"icon\":\"\",\"apr\":false,\"liquidity\":\"Low\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":116,\"name\":\"Chime Series G\",\"subname\":\"YieldStreet\",\"description\":\"Tokenized demo allocation referencing Chime Series G, issued by YieldStreet on Base. Intended for simulated PE-style exposure; non-yield.\",\"category\":\"Private Equity\",\"healthScore\":74,\"issuer_score\":86,\"asset_url\":\"https://yieldstreet.com/chime\",\"priceUSDx\":100,\"image\":\"\",\"supplyForDemo\":60000,\"icon\":\"\",\"apr\":false,\"liquidity\":\"Low\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":217,\"name\":\"Banksy \\\"Love\\\"\",\"subname\":\"Masterworks\",\"description\":\"Tokenized demo share representing Banksy \\\"Love\\\", issued by Masterworks on Ethereum. Built for collectible-style exposure; non-yield.\",\"category\":\"Art\",\"healthScore\":65,\"issuer_score\":93,\"asset_url\":\"https://masterworks.com/banksy\",\"priceUSDx\":100,\"image\":\"\",\"supplyForDemo\":120000,\"icon\":\"\",\"apr\":false,\"liquidity\":\"Mid\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":117,\"name\":\"1962 Ferrari GTO\",\"subname\":\"Curio Cards\",\"description\":\"Tokenized demo share representing 1962 Ferrari GTO, issued by Curio Cards on Polygon. Built for collectible-style exposure; non-yield.\",\"category\":\"Art\",\"healthScore\":55,\"issuer_score\":86,\"asset_url\":\"https://curioinvest.com/ferrari\",\"priceUSDx\":100,\"image\":\"\",\"supplyForDemo\":480000,\"icon\":\"\",\"apr\":false,\"liquidity\":\"Low\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":218,\"name\":\"Basquiat Untitled\",\"subname\":\"Art Square\",\"description\":\"Tokenized demo share representing Basquiat Untitled, issued by Art Square on Arbitrum. Built for collectible-style exposure; non-yield.\",\"category\":\"Art\",\"healthScore\":60,\"issuer_score\":78,\"asset_url\":\"https://artsquare.io/basquiat\",\"priceUSDx\":50,\"image\":\"\",\"supplyForDemo\":440000,\"icon\":\"\",\"apr\":false,\"liquidity\":\"Low\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":118,\"name\":\"Vintage Rolex Set\",\"subname\":\"WatchFund\",\"description\":\"Tokenized demo share representing Vintage Rolex Set, issued by WatchFund on BSC. Built for collectible-style exposure; non-yield.\",\"category\":\"Art\",\"healthScore\":45,\"issuer_score\":74,\"asset_url\":\"https://watchfund.com/rolex\",\"priceUSDx\":50,\"image\":\"\",\"supplyForDemo\":17000,\"icon\":\"\",\"apr\":false,\"liquidity\":\"Mid\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":219,\"name\":\"Blue Diamond 5ct\",\"subname\":\"DiamondVault\",\"description\":\"Tokenized demo share representing Blue Diamond 5ct, issued by DiamondVault on Ethereum. Built for collectible-style exposure; non-yield.\",\"category\":\"Art\",\"healthScore\":40,\"issuer_score\":60,\"asset_url\":\"https://dvault.io/diamond\",\"priceUSDx\":100,\"image\":\"\",\"supplyForDemo\":150000,\"icon\":\"\",\"apr\":false,\"liquidity\":\"Low\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":119,\"name\":\"Bordeaux Cellar\",\"subname\":\"WiV\",\"description\":\"Tokenized demo share representing Bordeaux Cellar, issued by WiV on Polygon. Built for collectible-style exposure; non-yield.\",\"category\":\"Art\",\"healthScore\":38,\"issuer_score\":81,\"asset_url\":\"https://wiv.io/wine\",\"priceUSDx\":50,\"image\":\"\",\"supplyForDemo\":6400,\"icon\":\"\",\"apr\":false,\"liquidity\":\"Mid\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":220,\"name\":\"Pikachu Card\",\"subname\":\"Collectable\",\"description\":\"Tokenized demo share representing Pikachu Card, issued by Collectable on Base. Built for collectible-style exposure; non-yield.\",\"category\":\"Art\",\"healthScore\":70,\"issuer_score\":83,\"asset_url\":\"https://collectable.com/pk\",\"priceUSDx\":50,\"image\":\"\",\"supplyForDemo\":18000,\"icon\":\"\",\"apr\":false,\"liquidity\":\"High\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":120,\"name\":\"BlackRock BUIDL II\",\"subname\":\"BlackRock\",\"description\":\"Tokenized demo fund unit referencing BlackRock BUIDL II, issued by BlackRock on Ethereum. Built for index/fund-style exposure; yield-bearing. Indicative APR: 4.8%.\",\"category\":\"Fund\",\"healthScore\":5,\"issuer_score\":99,\"asset_url\":\"https://blackrock.com/buidl\",\"priceUSDx\":1,\"image\":\"\",\"supplyForDemo\":1500000000,\"icon\":\"\",\"apr\":4.8,\"liquidity\":\"High\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":221,\"name\":\"Franklin MMF\",\"subname\":\"Franklin Temp\",\"description\":\"Tokenized demo fund unit referencing Franklin MMF, issued by Franklin Temp on Polygon. Built for index/fund-style exposure; yield-bearing. Indicative APR: 5.1%.\",\"category\":\"Fund\",\"healthScore\":8,\"issuer_score\":98,\"asset_url\":\"https://franklin.com/benji\",\"priceUSDx\":1,\"image\":\"\",\"supplyForDemo\":850000000,\"icon\":\"\",\"apr\":5.1,\"liquidity\":\"High\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":121,\"name\":\"KKR Strategic PE\",\"subname\":\"KKR/Securitize\",\"description\":\"Tokenized demo fund unit referencing KKR Strategic PE, issued by KKR/Securitize on Arbitrum. Built for index/fund-style exposure; yield-bearing. Indicative APR: 15.4%.\",\"category\":\"Fund\",\"healthScore\":45,\"issuer_score\":95,\"asset_url\":\"https://securitize.io/kkr\",\"priceUSDx\":100,\"image\":\"\",\"supplyForDemo\":2500000,\"icon\":\"\",\"apr\":15.4,\"liquidity\":\"Mid\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":222,\"name\":\"Amazon Carbon Cr.\",\"subname\":\"Toucan\",\"description\":\"Tokenized demo asset referencing Amazon Carbon Cr., issued by Toucan on Polygon. non-yield.\",\"category\":\"Other\",\"healthScore\":68,\"issuer_score\":84,\"asset_url\":\"https://toucan.earth/nct\",\"priceUSDx\":25,\"image\":\"\",\"supplyForDemo\":100000,\"icon\":\"\",\"apr\":false,\"liquidity\":\"High\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":122,\"name\":\"Music Royalty (Pop)\",\"subname\":\"Royal.io\",\"description\":\"Tokenized demo asset referencing Music Royalty (Pop), issued by Royal.io on Base. yield-bearing. Indicative APR: 11.2%.\",\"category\":\"Other\",\"healthScore\":55,\"issuer_score\":88,\"asset_url\":\"https://royal.io/track1\",\"priceUSDx\":10,\"image\":\"\",\"supplyForDemo\":10000,\"icon\":\"\",\"apr\":11.2,\"liquidity\":\"Mid\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":223,\"name\":\"Lithium Mine rts\",\"subname\":\"MineToken\",\"description\":\"Tokenized demo asset referencing Lithium Mine rts, issued by MineToken on BSC. non-yield.\",\"category\":\"Other\",\"healthScore\":78,\"issuer_score\":55,\"asset_url\":\"https://minetoken.io/li\",\"priceUSDx\":500,\"image\":\"\",\"supplyForDemo\":10000,\"icon\":\"\",\"apr\":false,\"liquidity\":\"Low\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":123,\"name\":\"Patent: EV Battery\",\"subname\":\"IPwe\",\"description\":\"Tokenized demo asset referencing Patent: EV Battery, issued by IPwe on Ethereum. yield-bearing. Indicative APR: 20%.\",\"category\":\"Other\",\"healthScore\":82,\"issuer_score\":79,\"asset_url\":\"https://ipwe.com/ev-pat\",\"priceUSDx\":1000,\"image\":\"\",\"supplyForDemo\":10000,\"icon\":\"\",\"apr\":20.0,\"liquidity\":\"Low\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":224,\"name\":\"Satellite BW\",\"subname\":\"SkyLink\",\"description\":\"Tokenized demo asset referencing Satellite BW, issued by SkyLink on Arbitrum. yield-bearing. Indicative APR: 14.5%.\",\"category\":\"Other\",\"healthScore\":60,\"issuer_score\":62,\"asset_url\":\"https://skylink.io/bw\",\"priceUSDx\":250,\"image\":\"\",\"supplyForDemo\":10000,\"icon\":\"\",\"apr\":14.5,\"liquidity\":\"Low\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":124,\"name\":\"NVIDIA (nvSTK)\",\"subname\":\"Backed Fin\",\"description\":\"Synthetic on-chain exposure token linked to NVIDIA (nvSTK), issued by Backed Fin on Ethereum. Demo asset; non-yield.\",\"category\":\"Stocks\",\"healthScore\":30,\"issuer_score\":92,\"asset_url\":\"https://backed.fi/nvda\",\"priceUSDx\":840,\"image\":\"\",\"supplyForDemo\":28214,\"icon\":\"\",\"apr\":false,\"liquidity\":\"High\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":225,\"name\":\"Tesla (tsSTK)\",\"subname\":\"Swarm Markets\",\"description\":\"Synthetic on-chain exposure token linked to Tesla (tsSTK), issued by Swarm Markets on BSC. Demo asset; non-yield.\",\"category\":\"Stocks\",\"healthScore\":45,\"issuer_score\":90,\"asset_url\":\"https://swarm.com/tsla\",\"priceUSDx\":220,\"image\":\"\",\"supplyForDemo\":322272,\"icon\":\"\",\"apr\":false,\"liquidity\":\"High\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":125,\"name\":\"Apple (apSTK)\",\"subname\":\"Dinari\",\"description\":\"Synthetic on-chain exposure token linked to Apple (apSTK), issued by Dinari on Polygon. Demo asset; yield-bearing. Indicative APR: 0.5%.\",\"category\":\"Stocks\",\"healthScore\":15,\"issuer_score\":91,\"asset_url\":\"https://dinari.com/aapl\",\"priceUSDx\":190,\"image\":\"\",\"supplyForDemo\":55789,\"icon\":\"\",\"apr\":0.5,\"liquidity\":\"High\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":226,\"name\":\"Microsoft (msSTK)\",\"subname\":\"Backed Fin\",\"description\":\"Synthetic on-chain exposure token linked to Microsoft (msSTK), issued by Backed Fin on Arbitrum. Demo asset; yield-bearing. Indicative APR: 0.8%.\",\"category\":\"Stocks\",\"healthScore\":18,\"issuer_score\":92,\"asset_url\":\"https://backed.fi/msft\",\"priceUSDx\":410,\"image\":\"\",\"supplyForDemo\":36585,\"icon\":\"\",\"apr\":0.8,\"liquidity\":\"High\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":126,\"name\":\"Amazon (azSTK)\",\"subname\":\"Dinari\",\"description\":\"Synthetic on-chain exposure token linked to Amazon (azSTK), issued by Dinari on Base. Demo asset; non-yield.\",\"category\":\"Stocks\",\"healthScore\":25,\"issuer_score\":91,\"asset_url\":\"https://dinari.com/amzn\",\"priceUSDx\":175,\"image\":\"\",\"supplyForDemo\":48571,\"icon\":\"\",\"apr\":false,\"liquidity\":\"High\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":227,\"name\":\"Google (goSTK)\",\"subname\":\"Swarm Markets\",\"description\":\"Synthetic on-chain exposure token linked to Google (goSTK), issued by Swarm Markets on Ethereum. Demo asset; non-yield.\",\"category\":\"Stocks\",\"healthScore\":20,\"issuer_score\":90,\"asset_url\":\"https://swarm.com/goog\",\"priceUSDx\":145,\"image\":\"\",\"supplyForDemo\":248275,\"icon\":\"\",\"apr\":false,\"liquidity\":\"High\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":127,\"name\":\"Meta (meSTK)\",\"subname\":\"Backed Fin\",\"description\":\"Synthetic on-chain exposure token linked to Meta (meSTK), issued by Backed Fin on Polygon. Demo asset; non-yield.\",\"category\":\"Stocks\",\"healthScore\":35,\"issuer_score\":92,\"asset_url\":\"https://backed.fi/meta\",\"priceUSDx\":480,\"image\":\"\",\"supplyForDemo\":25000,\"icon\":\"\",\"apr\":false,\"liquidity\":\"High\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":228,\"name\":\"Netflix (nfSTK)\",\"subname\":\"Dinari\",\"description\":\"Synthetic on-chain exposure token linked to Netflix (nfSTK), issued by Dinari on Arbitrum. Demo asset; non-yield.\",\"category\":\"Stocks\",\"healthScore\":42,\"issuer_score\":91,\"asset_url\":\"https://dinari.com/nflx\",\"priceUSDx\":610,\"image\":\"\",\"supplyForDemo\":10000,\"icon\":\"\",\"apr\":false,\"liquidity\":\"High\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":128,\"name\":\"AMD (amSTK)\",\"subname\":\"Swarm Markets\",\"description\":\"Synthetic on-chain exposure token linked to AMD (amSTK), issued by Swarm Markets on BSC. Demo asset; non-yield.\",\"category\":\"Stocks\",\"healthScore\":40,\"issuer_score\":90,\"asset_url\":\"https://swarm.com/amd\",\"priceUSDx\":160,\"image\":\"\",\"supplyForDemo\":20000,\"icon\":\"\",\"apr\":false,\"liquidity\":\"High\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":229,\"name\":\"Palantir (plSTK)\",\"subname\":\"Backed Fin\",\"description\":\"Synthetic on-chain exposure token linked to Palantir (plSTK), issued by Backed Fin on Base. Demo asset; non-yield.\",\"category\":\"Stocks\",\"healthScore\":55,\"issuer_score\":92,\"asset_url\":\"https://backed.fi/pltr\",\"priceUSDx\":25,\"image\":\"\",\"supplyForDemo\":50000,\"icon\":\"\",\"apr\":false,\"liquidity\":\"High\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":129,\"name\":\"Coinbase (cbSTK)\",\"subname\":\"Dinari\",\"description\":\"Synthetic on-chain exposure token linked to Coinbase (cbSTK), issued by Dinari on Ethereum. Demo asset; non-yield.\",\"category\":\"Stocks\",\"healthScore\":60,\"issuer_score\":91,\"asset_url\":\"https://dinari.com/coin\",\"priceUSDx\":210,\"image\":\"\",\"supplyForDemo\":48571,\"icon\":\"\",\"apr\":false,\"liquidity\":\"High\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":230,\"name\":\"MicroStrategy\",\"subname\":\"Backed Fin\",\"description\":\"Synthetic on-chain exposure token linked to MicroStrategy, issued by Backed Fin on Polygon. Demo asset; non-yield.\",\"category\":\"Stocks\",\"healthScore\":85,\"issuer_score\":92,\"asset_url\":\"https://backed.fi/mstr\",\"priceUSDx\":1200,\"image\":\"\",\"supplyForDemo\":11000,\"icon\":\"\",\"apr\":false,\"liquidity\":\"High\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":130,\"name\":\"Disney (diSTK)\",\"subname\":\"Swarm Markets\",\"description\":\"Synthetic on-chain exposure token linked to Disney (diSTK), issued by Swarm Markets on Arbitrum. Demo asset; yield-bearing. Indicative APR: 1.2%.\",\"category\":\"Stocks\",\"healthScore\":30,\"issuer_score\":90,\"asset_url\":\"https://swarm.com/dis\",\"priceUSDx\":110,\"image\":\"\",\"supplyForDemo\":50000,\"icon\":\"\",\"apr\":1.2,\"liquidity\":\"High\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":231,\"name\":\"JPMorgan (jpSTK)\",\"subname\":\"Dinari\",\"description\":\"Synthetic on-chain exposure token linked to JPMorgan (jpSTK), issued by Dinari on Base. Demo asset; yield-bearing. Indicative APR: 2.4%.\",\"category\":\"Stocks\",\"healthScore\":20,\"issuer_score\":91,\"asset_url\":\"https://dinari.com/jpm\",\"priceUSDx\":185,\"image\":\"\",\"supplyForDemo\":100000,\"icon\":\"\",\"apr\":2.4,\"liquidity\":\"High\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":131,\"name\":\"Exxon (exSTK)\",\"subname\":\"Backed Fin\",\"description\":\"Synthetic on-chain exposure token linked to Exxon (exSTK), issued by Backed Fin on Ethereum. Demo asset; yield-bearing. Indicative APR: 3.5%.\",\"category\":\"Stocks\",\"healthScore\":28,\"issuer_score\":92,\"asset_url\":\"https://backed.fi/xom\",\"priceUSDx\":115,\"image\":\"\",\"supplyForDemo\":100000,\"icon\":\"\",\"apr\":3.5,\"liquidity\":\"High\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":232,\"name\":\"Walmart (waSTK)\",\"subname\":\"Swarm Markets\",\"description\":\"Synthetic on-chain exposure token linked to Walmart (waSTK), issued by Swarm Markets on BSC. Demo asset; yield-bearing. Indicative APR: 1.8%.\",\"category\":\"Stocks\",\"healthScore\":15,\"issuer_score\":90,\"asset_url\":\"https://swarm.com/wmt\",\"priceUSDx\":165,\"image\":\"\",\"supplyForDemo\":100000,\"icon\":\"\",\"apr\":1.8,\"liquidity\":\"High\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":132,\"name\":\"Pfizer (pfSTK)\",\"subname\":\"Dinari\",\"description\":\"Synthetic on-chain exposure token linked to Pfizer (pfSTK), issued by Dinari on Polygon. Demo asset; yield-bearing. Indicative APR: 4.1%.\",\"category\":\"Stocks\",\"healthScore\":32,\"issuer_score\":91,\"asset_url\":\"https://dinari.com/pfe\",\"priceUSDx\":28,\"image\":\"\",\"supplyForDemo\":100000,\"icon\":\"\",\"apr\":4.1,\"liquidity\":\"High\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":233,\"name\":\"Coca-Cola (ccSTK)\",\"subname\":\"Backed Fin\",\"description\":\"Synthetic on-chain exposure token linked to Coca-Cola (ccSTK), issued by Backed Fin on Arbitrum. Demo asset; yield-bearing. Indicative APR: 2.9%.\",\"category\":\"Stocks\",\"healthScore\":12,\"issuer_score\":92,\"asset_url\":\"https://backed.fi/ko\",\"priceUSDx\":62,\"image\":\"\",\"supplyForDemo\":100000,\"icon\":\"\",\"apr\":2.9,\"liquidity\":\"High\",\"options\":[]},{\"chainId\":11155111,\"contract\":\"0x7055E13F116Dd8359485F6BC7A7280Fb5740479A\",\"tokenId\":133,\"name\":\"Uber (ubSTK)\",\"subname\":\"Swarm Markets\",\"description\":\"Synthetic on-chain exposure token linked to Uber (ubSTK), issued by Swarm Markets on Base. Demo asset; non-yield.\",\"category\":\"Stocks\",\"healthScore\":50,\"issuer_score\":90,\"asset_url\":\"https://swarm.com/uber\",\"priceUSDx\":75,\"image\":\"\",\"supplyForDemo\":100000,\"icon\":\"\",\"apr\":false,\"liquidity\":\"High\",\"options\":[]},{\"chainId\":80002,\"contract\":\"0x416cec74453905Ce8BD49ad3301AF0Ce6b8070e2\",\"tokenId\":234,\"name\":\"Airbnb (abSTK)\",\"subname\":\"Dinari\",\"description\":\"Synthetic on-chain exposure token linked to Airbnb (abSTK), issued by Dinari on Ethereum. Demo asset; non-yield.\",\"category\":\"Stocks\",\"healthScore\":48,\"issuer_score\":91,\"asset_url\":\"https://dinari.com/abnb\",\"priceUSDx\":150,\"image\":\"\",\"supplyForDemo\":100000,\"icon\":\"\",\"apr\":false,\"liquidity\":\"High\",\"options\":[]}]}"));}),
"[project]/src/app/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ShopPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$wagmi$2f$core$2f$dist$2f$esm$2f$actions$2f$waitForTransactionReceipt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@wagmi/core/dist/esm/actions/waitForTransactionReceipt.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$abi$2f$decodeEventLog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/utils/abi/decodeEventLog.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$constants$2f$abis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/constants/abis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$formatUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/utils/unit/formatUnits.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$abi$2f$parseEventLogs$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/utils/abi/parseEventLogs.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$parseGwei$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/utils/unit/parseGwei.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$parseUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/utils/unit/parseUnits.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useConnection__as__useAccount$3e$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/useConnection.js [app-client] (ecmascript) <export useConnection as useAccount>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useChainId$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/useChainId.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$usePublicClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/usePublicClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContracts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/useReadContracts.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useSwitchChain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/useSwitchChain.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useWriteContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/useWriteContract.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$Shell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/Shell.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$BlockingModal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/BlockingModal.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ReceiptModal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/ReceiptModal.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$assets$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/data/assets.json (json)");
(()=>{
    const e = new Error("Cannot find module 'src/config/appkit'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
const CHAIN_META = {
    11155111: {
        name: "Sepolia",
        icon: "/eth.svg"
    },
    80002: {
        name: "Polygon Amoy",
        icon: "/pol.svg"
    }
};
const numberFormat = new Intl.NumberFormat("en-US");
const formatNumber = (value)=>{
    if (typeof value === "number" && Number.isFinite(value)) {
        return numberFormat.format(value);
    }
    return value ?? "—";
};
const toNumber = (value)=>{
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
        const cleaned = value.replace(/,/g, "").trim();
        if (!cleaned) return null;
        const parsed = Number(cleaned);
        return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
};
const formatScore = (value)=>{
    if (value === undefined || value === null || value === "") return "—";
    if (typeof value === "string") return value;
    if (typeof value === "number" && Number.isFinite(value)) return `${value}/100`;
    return String(value);
};
const formatPrice = (value)=>{
    if (value === undefined || value === null || value === "") return "—";
    if (typeof value === "string") {
        return value.includes("USDx") ? value : `${value} USDx`;
    }
    if (typeof value === "number" && Number.isFinite(value)) {
        return `${numberFormat.format(value)} USDx`;
    }
    return String(value);
};
const formatApr = (value)=>{
    if (value === undefined || value === null || value === false) return null;
    if (typeof value === "string") return value.includes("%") ? value : `${value}%`;
    if (typeof value === "number" && Number.isFinite(value)) return `${value}%`;
    return String(value);
};
const parseAmountBase = (value, decimals)=>{
    const cleaned = String(value ?? "").replace(/,/g, ".").trim();
    if (!cleaned) return 0n;
    try {
        const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$parseUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseUnits"])(cleaned, decimals);
        return parsed > 0n ? parsed : 0n;
    } catch  {
        return 0n;
    }
};
const totalSupplyAbi = [
    {
        type: "function",
        name: "totalSupply",
        stateMutability: "view",
        inputs: [
            {
                name: "id",
                type: "uint256"
            }
        ],
        outputs: [
            {
                name: "supply",
                type: "uint256"
            }
        ]
    }
];
const maxSupplyAbi = [
    {
        type: "function",
        name: "maxSupply",
        stateMutability: "view",
        inputs: [
            {
                name: "id",
                type: "uint256"
            }
        ],
        outputs: [
            {
                name: "supply",
                type: "uint256"
            }
        ]
    }
];
const routerAbi = [
    {
        type: "event",
        name: "Paid",
        inputs: [
            {
                indexed: true,
                name: "batchId",
                type: "bytes32"
            },
            {
                indexed: true,
                name: "payer",
                type: "address"
            },
            {
                indexed: false,
                name: "amount",
                type: "uint256"
            },
            {
                indexed: true,
                name: "basketHash",
                type: "bytes32"
            },
            {
                indexed: false,
                name: "encryptedBasket",
                type: "bytes"
            }
        ],
        anonymous: false
    },
    {
        type: "function",
        name: "pay",
        stateMutability: "nonpayable",
        inputs: [
            {
                name: "amount",
                type: "uint256"
            },
            {
                name: "basketHash",
                type: "bytes32"
            },
            {
                name: "encryptedBasket",
                type: "bytes"
            }
        ],
        outputs: [
            {
                name: "batchId",
                type: "bytes32"
            }
        ]
    }
];
const apiBase = "/api";
const normalizeAssets = (data)=>{
    const assets = Array.isArray(data?.assets) ? data.assets : Array.isArray(data) ? data : [];
    return assets.map((asset)=>{
        const chainId = Number(asset.chainId);
        const meta = CHAIN_META[chainId] || {
            name: `Chain ${chainId || "?"}`,
            icon: "/eth.svg"
        };
        const image = typeof asset.image === "string" && asset.image.trim().length > 0 ? asset.image : null;
        const priceUSDx = toNumber(asset.priceUSDx ?? asset.price) ?? 0;
        const maxSupply = toNumber(asset.supplyForDemo ?? asset.maxSupply ?? asset.available ?? asset.issued) ?? null;
        const issuedHint = toNumber(asset.issued ?? asset.minted ?? asset.supply) ?? null;
        const availableHint = toNumber(asset.available ?? asset.supplyForDemo ?? asset.supply) ?? null;
        const issuerScoreValue = toNumber(asset.issuer_score ?? asset.issuerScore ?? asset.issuerRate) ?? null;
        const healthScore = toNumber(asset.healthScore ?? asset.health_score) ?? null;
        return {
            name: asset.name ?? "Untitled",
            issuer: asset.subname ?? asset.issuer ?? asset.issuer_name ?? "—",
            category: asset.category ?? "Other",
            network: meta.name,
            chainIcon: meta.icon,
            chainId,
            tokenId: Number(asset.tokenId),
            contract: asset.contract ?? asset.rwa1155 ?? null,
            price: formatPrice(asset.priceUSDx ?? asset.price),
            priceUSDx,
            apr: formatApr(asset.apr),
            aprValue: typeof asset.apr === "number" ? asset.apr : null,
            image,
            description: asset.description ?? "",
            maxSupply,
            issuedHint,
            availableHint,
            issuerScore: formatScore(asset.issuer_score ?? asset.issuerScore ?? asset.issuerRate),
            issuerScoreValue,
            healthScore
        };
    });
};
function ShopPage() {
    _s();
    const { address, isConnected } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useConnection__as__useAccount$3e$__["useAccount"])();
    const walletChainId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useChainId$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChainId"])();
    const { switchChainAsync } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useSwitchChain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSwitchChain"])();
    const { writeContractAsync } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useWriteContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWriteContract"])();
    const cards = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ShopPage.useMemo[cards]": ()=>normalizeAssets(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$assets$2e$json__$28$json$29$__["default"])
    }["ShopPage.useMemo[cards]"], []);
    const networks = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$assets$2e$json__$28$json$29$__["default"]?.networks ?? {};
    const categories = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ShopPage.useMemo[categories]": ()=>{
            const unique = new Set(cards.map({
                "ShopPage.useMemo[categories]": (card)=>card.category
            }["ShopPage.useMemo[categories]"]).filter(Boolean));
            const list = Array.from(unique);
            const hasOther = list.includes("Other");
            const sorted = list.filter({
                "ShopPage.useMemo[categories].sorted": (label)=>label !== "Other"
            }["ShopPage.useMemo[categories].sorted"]).sort();
            if (hasOther) sorted.push("Other");
            return [
                "All",
                ...sorted
            ];
        }
    }["ShopPage.useMemo[categories]"], [
        cards
    ]);
    const [activeCategory, setActiveCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("All");
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [strategyAmount, setStrategyAmount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [strategyKey, setStrategyKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [strategyQuantities, setStrategyQuantities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [payChainId, setPayChainId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(11155111);
    const publicClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$usePublicClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePublicClient"])({
        chainId: payChainId
    });
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("Ready.");
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [receiptTx, setReceiptTx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [receiptOpen, setReceiptOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const supplyCards = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ShopPage.useMemo[supplyCards]": ()=>cards.filter({
                "ShopPage.useMemo[supplyCards]": (card)=>card.contract && card.tokenId
            }["ShopPage.useMemo[supplyCards]"])
    }["ShopPage.useMemo[supplyCards]"], [
        cards
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShopPage.useEffect": ()=>{
            if (walletChainId && networks[String(walletChainId)]) {
                setPayChainId(walletChainId);
            }
        }
    }["ShopPage.useEffect"], [
        walletChainId,
        networks
    ]);
    const totalSupplyQueries = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ShopPage.useMemo[totalSupplyQueries]": ()=>supplyCards.map({
                "ShopPage.useMemo[totalSupplyQueries]": (card)=>({
                        abi: totalSupplyAbi,
                        address: card.contract,
                        functionName: "totalSupply",
                        args: [
                            BigInt(card.tokenId)
                        ],
                        chainId: card.chainId
                    })
            }["ShopPage.useMemo[totalSupplyQueries]"])
    }["ShopPage.useMemo[totalSupplyQueries]"], [
        supplyCards
    ]);
    const maxSupplyQueries = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ShopPage.useMemo[maxSupplyQueries]": ()=>supplyCards.map({
                "ShopPage.useMemo[maxSupplyQueries]": (card)=>({
                        abi: maxSupplyAbi,
                        address: card.contract,
                        functionName: "maxSupply",
                        args: [
                            BigInt(card.tokenId)
                        ],
                        chainId: card.chainId
                    })
            }["ShopPage.useMemo[maxSupplyQueries]"])
    }["ShopPage.useMemo[maxSupplyQueries]"], [
        supplyCards
    ]);
    const { data: totalSupplyData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContracts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContracts"])({
        contracts: totalSupplyQueries,
        query: {
            enabled: totalSupplyQueries.length > 0,
            refetchInterval: 15000
        }
    });
    const { data: maxSupplyData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContracts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContracts"])({
        contracts: maxSupplyQueries,
        query: {
            enabled: maxSupplyQueries.length > 0,
            refetchInterval: 60000
        }
    });
    const mintedMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ShopPage.useMemo[mintedMap]": ()=>{
            const map = {};
            if (!totalSupplyData) return map;
            totalSupplyData.forEach({
                "ShopPage.useMemo[mintedMap]": (item, idx)=>{
                    const card = supplyCards[idx];
                    if (!card) return;
                    const value = item?.result;
                    if (typeof value === "bigint") {
                        map[`${card.chainId}:${card.tokenId}`] = Number(value);
                    }
                }
            }["ShopPage.useMemo[mintedMap]"]);
            return map;
        }
    }["ShopPage.useMemo[mintedMap]"], [
        totalSupplyData,
        supplyCards
    ]);
    const maxMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ShopPage.useMemo[maxMap]": ()=>{
            const map = {};
            if (!maxSupplyData) return map;
            maxSupplyData.forEach({
                "ShopPage.useMemo[maxMap]": (item, idx)=>{
                    const card = supplyCards[idx];
                    if (!card) return;
                    const value = item?.result;
                    if (typeof value === "bigint") {
                        map[`${card.chainId}:${card.tokenId}`] = Number(value);
                    }
                }
            }["ShopPage.useMemo[maxMap]"]);
            return map;
        }
    }["ShopPage.useMemo[maxMap]"], [
        maxSupplyData,
        supplyCards
    ]);
    const payNetwork = networks[String(payChainId)];
    const usdxQueries = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ShopPage.useMemo[usdxQueries]": ()=>{
            if (!address || !payNetwork?.usdx) return [];
            return [
                {
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$constants$2f$abis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["erc20Abi"],
                    address: payNetwork.usdx,
                    functionName: "balanceOf",
                    args: [
                        address
                    ],
                    chainId: payChainId
                },
                {
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$constants$2f$abis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["erc20Abi"],
                    address: payNetwork.usdx,
                    functionName: "decimals",
                    args: [],
                    chainId: payChainId
                }
            ];
        }
    }["ShopPage.useMemo[usdxQueries]"], [
        address,
        payChainId,
        payNetwork?.usdx
    ]);
    const { data: usdxData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContracts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContracts"])({
        contracts: usdxQueries,
        query: {
            enabled: usdxQueries.length > 0,
            refetchInterval: 15000
        }
    });
    const usdxBalanceBase = usdxData?.[0]?.result ?? 0n;
    const usdxDecimals = Number(usdxData?.[1]?.result ?? 6);
    const usdxBalanceValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ShopPage.useMemo[usdxBalanceValue]": ()=>{
            if (!isConnected || !address || !usdxData) return null;
            return Number((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$formatUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatUnits"])(usdxBalanceBase, usdxDecimals));
        }
    }["ShopPage.useMemo[usdxBalanceValue]"], [
        address,
        isConnected,
        usdxBalanceBase,
        usdxDecimals,
        usdxData
    ]);
    const strategyBudgetBase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ShopPage.useMemo[strategyBudgetBase]": ()=>parseAmountBase(strategyAmount, usdxDecimals)
    }["ShopPage.useMemo[strategyBudgetBase]"], [
        strategyAmount,
        usdxDecimals
    ]);
    const strategyValid = isConnected && strategyBudgetBase > 0n && usdxBalanceBase > 0n && strategyBudgetBase <= usdxBalanceBase;
    const getAvailable = (card)=>{
        const key = `${card.chainId}:${card.tokenId}`;
        const minted = mintedMap[key] ?? 0;
        const maxSupply = maxMap[key] && maxMap[key] > 0 ? maxMap[key] : card.maxSupply;
        if (maxSupply == null) return Infinity;
        return Math.max(maxSupply - minted, 0);
    };
    const getStrategyAssets = (key)=>{
        const list = cards.filter((card)=>card.priceUSDx > 0 && getAvailable(card) > 0);
        if (!list.length) return [];
        if (key === "D") {
            return [
                ...list
            ].sort((a, b)=>a.priceUSDx - b.priceUSDx).slice(0, 6);
        }
        return [
            ...list
        ].sort((a, b)=>a.priceUSDx - b.priceUSDx).slice(0, 6);
    };
    const getWeight = (card, key)=>{
        const issuer = Math.max(card.issuerScoreValue ?? 50, 1);
        const health = Math.max(card.healthScore ?? 50, 1);
        const apr = typeof card.aprValue === "number" ? card.aprValue : 0;
        if (key === "A") return issuer * health;
        if (key === "B") return Math.max(apr, 0) * (issuer / 100);
        if (key === "C") return issuer * 0.5 + health * 0.5;
        return 1 / Math.max(card.priceUSDx, 1);
    };
    const selectedSummary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ShopPage.useMemo[selectedSummary]": ()=>{
            const entries = Object.entries(strategyQuantities).filter({
                "ShopPage.useMemo[selectedSummary].entries": ([, qty])=>qty > 0
            }["ShopPage.useMemo[selectedSummary].entries"]);
            const totalAssets = entries.length;
            const totalTokens = entries.reduce({
                "ShopPage.useMemo[selectedSummary].totalTokens": (acc, [, qty])=>acc + qty
            }["ShopPage.useMemo[selectedSummary].totalTokens"], 0);
            return {
                totalAssets,
                totalTokens
            };
        }
    }["ShopPage.useMemo[selectedSummary]"], [
        strategyQuantities
    ]);
    const selectedKeys = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ShopPage.useMemo[selectedKeys]": ()=>{
            const keys = Object.keys(strategyQuantities).filter({
                "ShopPage.useMemo[selectedKeys].keys": (key)=>strategyQuantities[key] > 0
            }["ShopPage.useMemo[selectedKeys].keys"]);
            return new Set(keys);
        }
    }["ShopPage.useMemo[selectedKeys]"], [
        strategyQuantities
    ]);
    const hasSelection = selectedSummary.totalAssets > 0;
    const getFeeOverrides = async ()=>{
        if (!publicClient) return {};
        const fees = await publicClient.estimateFeesPerGas();
        const maxFeeCap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$parseGwei$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseGwei"])("1000");
        const priorityFeeCap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$parseGwei$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseGwei"])("30");
        const maxFeePerGas = fees.maxFeePerGas && fees.maxFeePerGas < maxFeeCap ? fees.maxFeePerGas : maxFeeCap;
        const maxPriorityFeePerGas = fees.maxPriorityFeePerGas && fees.maxPriorityFeePerGas < priorityFeeCap ? fees.maxPriorityFeePerGas : priorityFeeCap;
        return {
            maxFeePerGas,
            maxPriorityFeePerGas
        };
    };
    const handleStrategy = (key)=>{
        if (!strategyValid) {
            setStatus("Enter a valid amount within your balance.");
            return;
        }
        setActiveCategory("All");
        setQuery("");
        const pool = getStrategyAssets(key);
        if (!pool.length) {
            setStatus("No assets available for this strategy.");
            return;
        }
        const budgetNumber = Number((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$formatUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatUnits"])(strategyBudgetBase, usdxDecimals));
        const maxShare = key === "B" ? 0.35 : key === "D" ? 0.4 : 0.3;
        const weights = pool.map((card)=>Math.max(getWeight(card, key), 0));
        const totalWeight = weights.reduce((acc, w)=>acc + w, 0);
        const next = {};
        let spent = 0;
        pool.forEach((card, idx)=>{
            const share = totalWeight ? budgetNumber * weights[idx] / totalWeight : 0;
            const rawQty = Math.floor(share / card.priceUSDx);
            const maxQtyByCap = Math.floor(budgetNumber * maxShare / card.priceUSDx);
            const maxQty = Math.min(getAvailable(card), maxQtyByCap);
            const qty = Math.max(0, Math.min(rawQty, maxQty));
            next[`${card.chainId}:${card.tokenId}`] = qty;
            spent += qty * card.priceUSDx;
        });
        const withQty = pool.filter((card)=>(next[`${card.chainId}:${card.tokenId}`] ?? 0) > 0);
        if (withQty.length < 3) {
            const candidates = pool.filter((card)=>(next[`${card.chainId}:${card.tokenId}`] ?? 0) === 0).sort((a, b)=>a.priceUSDx - b.priceUSDx);
            for (const card of candidates){
                if (withQty.length >= 3) break;
                if (spent + card.priceUSDx > budgetNumber) break;
                if (getAvailable(card) < 1) continue;
                const keyCard = `${card.chainId}:${card.tokenId}`;
                next[keyCard] = 1;
                spent += card.priceUSDx;
                withQty.push(card);
            }
        }
        const cheapest = [
            ...pool
        ].sort((a, b)=>a.priceUSDx - b.priceUSDx)[0];
        if (cheapest) {
            const keyCheapest = `${cheapest.chainId}:${cheapest.tokenId}`;
            const maxQty = getAvailable(cheapest);
            while(spent + cheapest.priceUSDx <= budgetNumber && (next[keyCheapest] ?? 0) + 1 <= maxQty){
                next[keyCheapest] = (next[keyCheapest] ?? 0) + 1;
                spent += cheapest.priceUSDx;
            }
        }
        setStrategyKey(key);
        setStrategyQuantities(next);
        setStatus("Strategy applied.");
    };
    const handleBuySuggested = async ()=>{
        if (!isConnected || !address) {
            setStatus("Connect wallet first.");
            return;
        }
        if (!payNetwork?.usdx || !payNetwork?.routerAndDelivery) {
            setStatus("Unknown pay network.");
            return;
        }
        const selected = cards.map((card)=>({
                card,
                qty: strategyQuantities[`${card.chainId}:${card.tokenId}`] ?? 0
            })).filter((item)=>item.qty > 0 && item.card.contract);
        if (!selected.length) {
            setStatus("Select a strategy first.");
            return;
        }
        if (walletChainId !== payChainId) {
            setStatus("Switching wallet network...");
            try {
                await switchChainAsync({
                    chainId: payChainId
                });
                setStatus("Network switched. Click buy again.");
            } catch (err) {
                setStatus(`Switch failed: ${String(err?.message ?? err)}`);
            }
            return;
        }
        const totalBase = selected.reduce((acc, item)=>{
            const unitBase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$parseUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseUnits"])(String(item.card.priceUSDx || 0), usdxDecimals);
            return acc + unitBase * BigInt(item.qty);
        }, 0n);
        if (totalBase <= 0n) {
            setStatus("Invalid total amount.");
            return;
        }
        if (usdxBalanceBase && totalBase > usdxBalanceBase) {
            setStatus("Insufficient USDx balance.");
            return;
        }
        const basket = {
            to: address,
            legs: []
        };
        const legs = new Map();
        selected.forEach(({ card, qty })=>{
            const key = `${card.chainId}:${card.contract}`;
            const leg = legs.get(key) ?? {
                chainId: card.chainId,
                rwa1155: card.contract,
                tokenIds: [],
                amounts: []
            };
            leg.tokenIds.push(card.tokenId);
            leg.amounts.push(qty);
            legs.set(key, leg);
        });
        basket.legs = Array.from(legs.values());
        setBusy(true);
        try {
            setStatus("Encrypting basket...");
            const encResp = await fetch(`${apiBase}/encryptBasket`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    basket
                })
            });
            if (!encResp.ok) {
                throw new Error(`encryptBasket failed: ${encResp.status}`);
            }
            const { basketHash, encryptedBasket } = await encResp.json();
            setStatus("Approving USDx...");
            const feeOverrides = await getFeeOverrides();
            const approveHash = await writeContractAsync({
                address: payNetwork.usdx,
                abi: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$constants$2f$abis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["erc20Abi"],
                functionName: "approve",
                args: [
                    payNetwork.routerAndDelivery,
                    totalBase
                ],
                chainId: payChainId,
                ...feeOverrides
            });
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$wagmi$2f$core$2f$dist$2f$esm$2f$actions$2f$waitForTransactionReceipt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["waitForTransactionReceipt"])(wagmiConfig, {
                hash: approveHash
            });
            setStatus("Processing payment...");
            const payHash = await writeContractAsync({
                address: payNetwork.routerAndDelivery,
                abi: routerAbi,
                functionName: "pay",
                args: [
                    totalBase,
                    basketHash,
                    encryptedBasket
                ],
                chainId: payChainId,
                ...feeOverrides
            });
            const receipt = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$wagmi$2f$core$2f$dist$2f$esm$2f$actions$2f$waitForTransactionReceipt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["waitForTransactionReceipt"])(wagmiConfig, {
                hash: payHash
            });
            let batchId = null;
            try {
                const paidLogs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$abi$2f$parseEventLogs$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseEventLogs"])({
                    abi: routerAbi,
                    logs: receipt.logs,
                    eventName: "Paid"
                });
                batchId = paidLogs?.[0]?.args?.batchId ?? null;
            } catch (_err) {
                batchId = null;
            }
            if (!batchId) {
                for (const log of receipt.logs ?? []){
                    try {
                        const decoded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$abi$2f$decodeEventLog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decodeEventLog"])({
                            abi: routerAbi,
                            data: log.data,
                            topics: log.topics,
                            eventName: "Paid"
                        });
                        batchId = decoded?.args?.batchId ?? null;
                        if (batchId) break;
                    } catch (_err) {
                    // ignore
                    }
                }
            }
            if (!batchId) {
                throw new Error("Paid event not found in receipt");
            }
            setStatus("Recording receipt on Oasis...");
            const execResp = await fetch(`${apiBase}/execute`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    payChainId,
                    batchId,
                    payTxHash: payHash
                })
            });
            const execJson = await execResp.json();
            if (!execResp.ok) {
                throw new Error(`execute failed: ${JSON.stringify(execJson)}`);
            }
            const oasisTx = execJson?.result?.paymentTxHash ?? null;
            setReceiptTx(oasisTx);
            if (oasisTx) setReceiptOpen(true);
            setStatus(`Done. Batch ${batchId}`);
            setStrategyQuantities({});
            setStrategyKey(null);
            setStrategyAmount("");
        } catch (err) {
            setStatus(`Error: ${String(err?.message ?? err)}`);
        } finally{
            setBusy(false);
        }
    };
    const filteredCards = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ShopPage.useMemo[filteredCards]": ()=>{
            if (selectedKeys.size > 0) {
                return cards.filter({
                    "ShopPage.useMemo[filteredCards]": (card)=>selectedKeys.has(`${card.chainId}:${card.tokenId}`)
                }["ShopPage.useMemo[filteredCards]"]);
            }
            const q = query.trim().toLowerCase();
            return cards.filter({
                "ShopPage.useMemo[filteredCards]": (card)=>{
                    const matchesCategory = activeCategory === "All" || card.category === activeCategory;
                    if (!matchesCategory) return false;
                    if (!q) return true;
                    const haystack = [
                        card.name,
                        card.issuer,
                        card.category,
                        card.description,
                        card.network
                    ].filter(Boolean).join(" ").toLowerCase();
                    return haystack.includes(q);
                }
            }["ShopPage.useMemo[filteredCards]"]);
        }
    }["ShopPage.useMemo[filteredCards]"], [
        cards,
        activeCategory,
        query,
        selectedKeys
    ]);
    const getCardBackground = (image)=>{
        if (!image) return undefined;
        if (typeof image === "string" && image.startsWith("http")) {
            return {
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
            };
        }
        return {
            background: image
        };
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$Shell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$BlockingModal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: busy,
                message: status
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 625,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ReceiptModal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: receiptOpen,
                href: receiptTx ? `https://explorer.oasis.io/testnet/sapphire/tx/${receiptTx}` : null,
                label: "View receipt in Oasis",
                onClose: ()=>setReceiptOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 626,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "hero",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "hero-top",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            children: "Multi-chain RWAs, one control plane."
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.js",
                            lineNumber: 634,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "RWAs are fragmented across chains and wallets. RWA Hub unifies them so you can discover, buy, and manage from one network."
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.js",
                            lineNumber: 635,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "Your positions live here. Oasis Sapphire keeps the canonical history with asset privacy, while your wallet reflects what you own right now."
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.js",
                            lineNumber: 639,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.js",
                    lineNumber: 633,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 632,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "placeholder",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "strategies",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "strategies-header",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "eyebrow",
                                        children: "Portfolio helper"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.js",
                                        lineNumber: 649,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `muted ${hasSelection ? "is-active" : ""}`,
                                        children: hasSelection ? `Selected ${selectedSummary.totalAssets} assets, total tokens ${selectedSummary.totalTokens}` : "Build a balanced portfolio for a target amount."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.js",
                                        lineNumber: 650,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.js",
                                lineNumber: 648,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "strategies-row",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "strategy-input",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            placeholder: "Target amount (USDx)",
                                            min: "0",
                                            step: "1",
                                            value: strategyAmount,
                                            onChange: (e)=>{
                                                setStrategyAmount(e.target.value);
                                                setStrategyKey(null);
                                                setStrategyQuantities({});
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.js",
                                            lineNumber: 658,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.js",
                                        lineNumber: 657,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "strategy-actions",
                                        children: [
                                            {
                                                key: "A",
                                                label: "Low-risk"
                                            },
                                            {
                                                key: "C",
                                                label: "Balanced"
                                            },
                                            {
                                                key: "B",
                                                label: "Growth"
                                            },
                                            {
                                                key: "D",
                                                label: "High-profit"
                                            }
                                        ].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: `strategy-button ${strategyValid ? "is-ready" : ""} ${strategyKey === item.key ? "is-active" : ""}`,
                                                type: "button",
                                                onClick: ()=>handleStrategy(item.key),
                                                disabled: !strategyValid || busy,
                                                children: item.label
                                            }, item.key, false, {
                                                fileName: "[project]/src/app/page.js",
                                                lineNumber: 678,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.js",
                                        lineNumber: 671,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "buy-button",
                                        type: "button",
                                        onClick: handleBuySuggested,
                                        disabled: !hasSelection || busy,
                                        children: "Buy Suggested Assets"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.js",
                                        lineNumber: 691,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.js",
                                lineNumber: 656,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.js",
                        lineNumber: 647,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "filters-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "filters",
                                children: categories.map((label)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: `pill filter-pill ${activeCategory === label ? "is-active" : ""}`,
                                        type: "button",
                                        onClick: ()=>{
                                            if (hasSelection) {
                                                setStrategyKey(null);
                                                setStrategyQuantities({});
                                            }
                                            setActiveCategory(label);
                                        },
                                        children: label
                                    }, label, false, {
                                        fileName: "[project]/src/app/page.js",
                                        lineNumber: 704,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.js",
                                lineNumber: 702,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "search",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    placeholder: "Search assets",
                                    value: query,
                                    onChange: (e)=>{
                                        if (hasSelection) {
                                            setStrategyKey(null);
                                            setStrategyQuantities({});
                                        }
                                        setQuery(e.target.value);
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.js",
                                    lineNumber: 721,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.js",
                                lineNumber: 720,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.js",
                        lineNumber: 701,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid",
                        children: filteredCards.map((card)=>{
                            const key = `${card.chainId}:${card.tokenId}`;
                            const minted = mintedMap[key];
                            const maxSupply = maxMap[key] && maxMap[key] > 0 ? maxMap[key] : card.maxSupply;
                            const available = maxSupply != null && minted != null ? Math.max(maxSupply - minted, 0) : card.availableHint;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                className: "card",
                                href: `/asset/${card.chainId}/${card.tokenId}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `card-media ${card.image ? "has-image" : "no-image"}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "card-media-bg",
                                                style: getCardBackground(card.image)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.js",
                                                lineNumber: 746,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "card-media-top",
                                                children: [
                                                    card.apr ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "badge",
                                                        children: [
                                                            "APR ",
                                                            card.apr
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/page.js",
                                                        lineNumber: 748,
                                                        columnNumber: 33
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                                        fileName: "[project]/src/app/page.js",
                                                        lineNumber: 748,
                                                        columnNumber: 81
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "network-pill",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: card.chainIcon,
                                                            alt: "",
                                                            "aria-hidden": "true"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.js",
                                                            lineNumber: 750,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.js",
                                                        lineNumber: 749,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/page.js",
                                                lineNumber: 747,
                                                columnNumber: 19
                                            }, this),
                                            !card.image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "glyph",
                                                children: card.category.slice(0, 2)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.js",
                                                lineNumber: 753,
                                                columnNumber: 34
                                            }, this) : null
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.js",
                                        lineNumber: 745,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "card-body",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "card-category",
                                                children: card.category
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.js",
                                                lineNumber: 756,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "card-title",
                                                children: card.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.js",
                                                lineNumber: 757,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "card-sub",
                                                children: card.issuer
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.js",
                                                lineNumber: 758,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "card-description",
                                                children: card.description
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.js",
                                                lineNumber: 759,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "card-stats",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Issuer Rate"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/page.js",
                                                                lineNumber: 762,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: card.issuerScore
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/page.js",
                                                                lineNumber: 763,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/page.js",
                                                        lineNumber: 761,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Available"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/page.js",
                                                                lineNumber: 766,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: formatNumber(available)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/page.js",
                                                                lineNumber: 767,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/page.js",
                                                        lineNumber: 765,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Issued"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/page.js",
                                                                lineNumber: 770,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: formatNumber(maxSupply ?? card.issuedHint)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/page.js",
                                                                lineNumber: 771,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/page.js",
                                                        lineNumber: 769,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/page.js",
                                                lineNumber: 760,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "card-price",
                                                children: card.price
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.js",
                                                lineNumber: 774,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.js",
                                        lineNumber: 755,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, key, true, {
                                fileName: "[project]/src/app/page.js",
                                lineNumber: 744,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.js",
                        lineNumber: 735,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 646,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.js",
        lineNumber: 624,
        columnNumber: 5
    }, this);
}
_s(ShopPage, "YLw4rC7kz2mkw9Qgkwbx02DQZCc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useConnection__as__useAccount$3e$__["useAccount"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useChainId$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChainId"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useSwitchChain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSwitchChain"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useWriteContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWriteContract"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$usePublicClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePublicClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContracts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContracts"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContracts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContracts"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContracts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContracts"]
    ];
});
_c = ShopPage;
var _c;
__turbopack_context__.k.register(_c, "ShopPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_bbf7d426._.js.map