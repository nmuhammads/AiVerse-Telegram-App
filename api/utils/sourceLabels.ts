/**
 * Human-readable labels for order source identifiers.
 * Used in admin notifications to show where the purchase was made.
 */

const SOURCE_LABELS: Record<string, string> = {
    'aiverse_telegram_app': '📱 Mini App',
    'aiverse_hub_bot': '🤖 Хаб-бот',
    'nanobanana_bot': '🍌 @BananNanoBot',
    'seedream_bot': '⚡ @seedreameditbot',
    'gptimage_bot': '🤖 @GPTimagePro_bot',
    'sora_pro_bot': '🎬 Sora Pro Bot',
    'seedance_bot': '🌸 @seedancepro_bot',
    'tryon_bot': '👗 @TryOnAI_bot',
    'wan3_bot': '🎥 @wan3bot',
    'klingpro_bot': '🎬 @klingprobot',
}

/**
 * Get a human-readable label for the given source.
 * Falls back to the raw source string if no label is found.
 */
export function getSourceLabel(source?: string | null): string {
    if (!source) return '📱 Mini App'
    return SOURCE_LABELS[source] || source
}
