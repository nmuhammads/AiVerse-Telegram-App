// Custom context for expo-router in monorepo
// This file overrides the default _ctx.android.js to work in monorepo structure

export const ctx = require.context(
    './app',
    true,
    /^(?:\.\/(?!(?:(?:(?:.*\+api)|(?:\+html)|(?:\+middleware)))\.[tj]sx?$)).*(?:\.android|\.native)?\.(?:[tj]sx?|json)$/
);
