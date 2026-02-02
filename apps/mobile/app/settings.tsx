import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, Alert, Platform, Linking, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import {
    ChevronLeft, Globe, Bell, Info, Shield, ChevronRight, Moon, Zap, Users,
    MessageCircle, Clock, ChevronDown, ArrowLeft, Check, Search, User, Droplets
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../theme';
import { api } from '../lib/api';
import { useUserStore } from '../store/userStore';
import { extractFingerprint } from '../lib/fingerprint';

// --- Mock Translation Hook ---
const useTranslation = () => {
    const [language, setLanguage] = useState('ru'); // Default to ru for now

    const t = (key: string) => {
        const translations: Record<string, string> = {
            'settings.title': language === 'ru' ? 'Настройки' : 'Settings',
            'settings.sections.general': language === 'ru' ? 'ОСНОВНЫЕ' : 'GENERAL',
            'settings.items.language': language === 'ru' ? 'Язык' : 'Language',
            'settings.items.theme': language === 'ru' ? 'Оформление' : 'Theme',
            'settings.items.themeValue': language === 'ru' ? 'Темная' : 'Dark',
            'settings.messages.themeToast': language === 'ru' ? 'Светлая тема скоро появится' : 'Light theme coming soon',
            'settings.sections.remix': language === 'ru' ? 'REMIX & GENERATION' : 'REMIX & GENERATION',
            'settings.items.accumulations': language === 'ru' ? 'Накопления' : 'Accumulations',
            'settings.sections.social': language === 'ru' ? 'СОЦИАЛЬНОЕ' : 'SOCIAL',
            'settings.items.subscriptions': language === 'ru' ? 'Подписки' : 'Subscriptions',
            'settings.sections.notifications': language === 'ru' ? 'УВЕДОМЛЕНИЯ' : 'NOTIFICATIONS',
            'settings.notifications.hint': language === 'ru' ? 'Нажмите для настройки' : 'Tap to configure',
            'settings.notifications.telegram': language === 'ru' ? 'Telegram Уведомления' : 'Telegram Notifications',
            'settings.notifications.options.news': language === 'ru' ? 'Новости' : 'News',
            'settings.notifications.options.remix': language === 'ru' ? 'Ремиксы' : 'Remixes',
            'settings.notifications.options.generation': language === 'ru' ? 'Генерации' : 'Generations',
            'settings.notifications.options.likes': language === 'ru' ? 'Лайки' : 'Likes',
            'settings.sections.tools': language === 'ru' ? 'ИНСТРУМЕНТЫ' : 'TOOLS',
            'watermark.title': language === 'ru' ? 'Водяной знак' : 'Watermark',
            'settings.fingerprint.title': language === 'ru' ? 'Декодер отпечатков' : 'Fingerprint Decoder',
            'settings.fingerprint.description': language === 'ru' ? 'Вставьте текст с невидимым отпечатком, чтобы узнать автора.' : 'Paste text with invisible fingerprint to find the author.',
            'settings.fingerprint.placeholder': language === 'ru' ? 'Вставьте текст здесь...' : 'Paste text here...',
            'settings.fingerprint.check': language === 'ru' ? 'Проверить' : 'Check',
            'settings.fingerprint.found': language === 'ru' ? 'Отпечаток найден!' : 'Fingerprint found!',
            'settings.fingerprint.notFound': language === 'ru' ? 'Отпечаток не найден' : 'Fingerprint not found',
            'settings.fingerprint.author': language === 'ru' ? 'Автор' : 'Author',
            'settings.fingerprint.noFingerprint': language === 'ru' ? 'В тексте нет скрытого отпечатка' : 'No hidden fingerprint in text',
            'settings.sections.about': language === 'ru' ? 'О ПРИЛОЖЕНИИ' : 'ABOUT',
            'settings.items.support': language === 'ru' ? 'Поддержка' : 'Support',
            'settings.items.storage': language === 'ru' ? 'Хранилище' : 'Storage',
            'settings.items.storageValue': language === 'ru' ? 'Очистить' : 'Clear',
            'settings.messages.storageToast': language === 'ru' ? 'Кэш очищен' : 'Cache cleared',
            'settings.items.version': language === 'ru' ? 'Версия' : 'Version',
        };
        return translations[key] || key;
    };

    const i18n = {
        language,
        changeLanguage: (lang: string) => setLanguage(lang),
    };

    return { t, i18n };
};

// --- Types ---
interface NotificationSettings {
    telegram_news: boolean
    telegram_remix: boolean
    telegram_generation: boolean
    telegram_likes: boolean
}

const defaultSettings: NotificationSettings = {
    telegram_news: false,
    telegram_remix: true,
    telegram_generation: true,
    telegram_likes: true
}

export default function SettingsScreen() {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const params = useLocalSearchParams();
    const { user } = useUserStore();

    // State
    const [notifExpanded, setNotifExpanded] = useState(false);
    const [langExpanded, setLangExpanded] = useState(false);
    const [notifSettings, setNotifSettings] = useState<NotificationSettings>(defaultSettings);
    const [showArrow, setShowArrow] = useState(false);

    // Fingerprint state
    const [fingerprintExpanded, setFingerprintExpanded] = useState(false);
    const [fingerprintInput, setFingerprintInput] = useState('');
    const [decodedAuthor, setDecodedAuthor] = useState<string | null>(null);
    const [remixCount, setRemixCount] = useState(0);

    // Initial load
    useEffect(() => {
        if (params.notif === 'open') {
            setNotifExpanded(true);
            setShowArrow(true);
            const timer = setTimeout(() => setShowArrow(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [params]);

    useEffect(() => {
        if (user?.id) {
            loadUserData();
        }
    }, [user?.id]);

    const loadUserData = async () => {
        if (!user?.id) return;
        try {
            const data = await api.get<{ remix_count?: number, notification_settings?: NotificationSettings }>(`/user/info/${user.id}`);
            if (data && typeof data.remix_count === 'number') {
                setRemixCount(data.remix_count);
            }
            if (data && data.notification_settings) {
                setNotifSettings({ ...defaultSettings, ...data.notification_settings });
            }
        } catch (e) {
            console.error('Failed to load user settings', e);
        }
    };

    const updateNotifSetting = async (key: keyof NotificationSettings, value: boolean) => {
        if (!user?.id) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const newSettings = { ...notifSettings, [key]: value };
        setNotifSettings(newSettings);

        try {
            await api.patch('/user/notification-settings', {
                user_id: user.id,
                settings: newSettings
            });
        } catch (e) {
            console.error('Failed to save notification settings', e);
        }
    };

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setLangExpanded(false);
    };

    // --- Render Helpers ---

    const renderSectionHeader = (title: string) => (
        <Text style={styles.sectionHeader}>{title}</Text>
    );

    const renderItem = (
        icon: React.ElementType,
        label: string,
        onClick: () => void,
        value?: string,
        rightElement?: React.ReactNode,
        isLast?: boolean
    ) => {
        const Icon = icon;
        return (
            <TouchableOpacity
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onClick();
                }}
                activeOpacity={0.7}
                style={[styles.itemContainer, !isLast && styles.itemBorder]}
            >
                <View style={styles.iconContainer}>
                    <Icon size={16} color={colors.textSecondary} />
                </View>
                <View style={styles.itemContent}>
                    <Text style={styles.itemLabel}>{label}</Text>
                </View>
                {value && <Text style={styles.itemValue}>{value}</Text>}
                {rightElement || <ChevronRight size={16} color={colors.textMuted} />}
            </TouchableOpacity>
        );
    };

    const notifOptions = [
        { key: 'telegram_news' as const, label: t('settings.notifications.options.news') },
        { key: 'telegram_remix' as const, label: t('settings.notifications.options.remix') },
        { key: 'telegram_generation' as const, label: t('settings.notifications.options.generation') },
        { key: 'telegram_likes' as const, label: t('settings.notifications.options.likes') },
    ];

    return (
        <View style={styles.screen}>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <ChevronLeft size={28} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{t('settings.title')}</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* General Section */}
                    <View style={styles.section}>
                        {renderSectionHeader(t('settings.sections.general'))}
                        <View style={styles.card}>
                            {/* Language */}
                            <TouchableOpacity
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    setLangExpanded(!langExpanded);
                                }}
                                style={[styles.itemContainer, styles.itemBorder]}
                            >
                                <View style={styles.iconContainer}>
                                    <Globe size={16} color={colors.textSecondary} />
                                </View>
                                <View style={styles.itemContent}>
                                    <Text style={styles.itemLabel}>{t('settings.items.language')}</Text>
                                </View>
                                <Text style={styles.itemValue}>{i18n.language.startsWith('ru') ? 'Русский' : 'English'}</Text>
                                <ChevronDown size={16} color={colors.textMuted} style={{ transform: [{ rotate: langExpanded ? '180deg' : '0deg' }] }} />
                            </TouchableOpacity>

                            {langExpanded && (
                                <View style={styles.expandedContent}>
                                    {[
                                        { label: 'Русский', value: 'ru' },
                                        { label: 'English', value: 'en' }
                                    ].map((opt) => (
                                        <TouchableOpacity
                                            key={opt.value}
                                            onPress={() => changeLanguage(opt.value)}
                                            style={styles.optionItem}
                                        >
                                            <Text style={[
                                                styles.optionLabel,
                                                i18n.language === opt.value && styles.optionLabelActive
                                            ]}>
                                                {opt.label}
                                            </Text>
                                            {i18n.language === opt.value && <Check size={16} color={colors.primary} />}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            {/* Theme */}
                            {renderItem(
                                Moon,
                                t('settings.items.theme'),
                                () => Alert.alert('Info', t('settings.messages.themeToast')),
                                t('settings.items.themeValue'),
                                null,
                                true
                            )}
                        </View>
                    </View>

                    {/* Remix Section */}
                    <View style={styles.section}>
                        {renderSectionHeader(t('settings.sections.remix'))}
                        <View style={styles.card}>
                            {renderItem(
                                Users,
                                t('settings.items.accumulations'),
                                () => router.push('/accumulations' as any), // Type cast as route might not exist yet
                                String(remixCount),
                                null,
                                true
                            )}
                        </View>
                    </View>

                    {/* Social Section */}
                    <View style={styles.section}>
                        {renderSectionHeader(t('settings.sections.social'))}
                        <View style={styles.card}>
                            {renderItem(
                                Users,
                                t('settings.items.subscriptions'),
                                () => router.push('/subscriptions' as any),
                                undefined,
                                null,
                                true
                            )}
                        </View>
                    </View>

                    {/* Notifications Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeaderContainer}>
                            {renderSectionHeader(t('settings.sections.notifications'))}
                            {showArrow && (
                                <View style={styles.pulseContainer}>
                                    <ArrowLeft size={14} color={colors.primaryLight} />
                                    <Text style={styles.pulseText}>{t('settings.notifications.hint')}</Text>
                                </View>
                            )}
                        </View>
                        <View style={[styles.card, showArrow && styles.highlightCard]}>
                            <TouchableOpacity
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    setNotifExpanded(!notifExpanded);
                                }}
                                style={[styles.itemContainer, notifExpanded && styles.itemBorder]}
                            >
                                <View style={styles.iconContainer}>
                                    <Bell size={16} color={colors.textSecondary} />
                                </View>
                                <View style={styles.itemContent}>
                                    <Text style={styles.itemLabel}>{t('settings.notifications.telegram')}</Text>
                                </View>
                                <ChevronDown size={16} color={colors.textMuted} style={{ transform: [{ rotate: notifExpanded ? '180deg' : '0deg' }] }} />
                            </TouchableOpacity>

                            {notifExpanded && (
                                <View style={styles.expandedContent}>
                                    {notifOptions.map((opt, i) => (
                                        <View key={opt.key} style={[styles.switchContainer, i !== notifOptions.length - 1 && styles.itemBorder]}>
                                            <Text style={styles.switchLabel}>{opt.label}</Text>
                                            <Switch
                                                value={notifSettings[opt.key]}
                                                onValueChange={(val) => updateNotifSetting(opt.key, val)}
                                                trackColor={{ false: colors.surfaceLight, true: colors.primary }}
                                                thumbColor={'#fff'}
                                                ios_backgroundColor={colors.surfaceLight}
                                            />
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Tools Section */}
                    <View style={styles.section}>
                        {renderSectionHeader(t('settings.sections.tools'))}
                        <View style={styles.card}>
                            {/* Watermark */}
                            {renderItem(
                                Droplets,
                                t('watermark.title'),
                                () => router.push('/watermark' as any),
                                undefined,
                                null,
                                false
                            )}

                            {/* Fingerprint Decoder */}
                            <View>
                                <TouchableOpacity
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        setFingerprintExpanded(!fingerprintExpanded);
                                    }}
                                    style={styles.itemContainer}
                                >
                                    <View style={styles.iconContainer}>
                                        <Search size={16} color={colors.textSecondary} />
                                    </View>
                                    <View style={styles.itemContent}>
                                        <Text style={styles.itemLabel}>{t('settings.fingerprint.title')}</Text>
                                    </View>
                                    <ChevronDown size={16} color={colors.textMuted} style={{ transform: [{ rotate: fingerprintExpanded ? '180deg' : '0deg' }] }} />
                                </TouchableOpacity>

                                {fingerprintExpanded && (
                                    <View style={styles.fingerprintContent}>
                                        <Text style={styles.fingerprintDesc}>{t('settings.fingerprint.description')}</Text>
                                        <TextInput
                                            value={fingerprintInput}
                                            onChangeText={setFingerprintInput}
                                            placeholder={t('settings.fingerprint.placeholder')}
                                            placeholderTextColor={colors.textMuted}
                                            multiline
                                            style={styles.fingerprintInput}
                                            textAlignVertical="top"
                                        />
                                        <TouchableOpacity
                                            onPress={() => {
                                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                                const result = extractFingerprint(fingerprintInput);
                                                setDecodedAuthor(result.identifier);
                                                if (result.identifier) {
                                                    Alert.alert(t('settings.fingerprint.found'));
                                                } else {
                                                    Alert.alert(t('settings.fingerprint.notFound'));
                                                }
                                            }}
                                            disabled={!fingerprintInput.trim()}
                                            style={[styles.checkButton, !fingerprintInput.trim() && styles.disabledButton]}
                                        >
                                            <Search size={16} color="#fff" />
                                            <Text style={styles.checkButtonText}>{t('settings.fingerprint.check')}</Text>
                                        </TouchableOpacity>

                                        {decodedAuthor !== null && (
                                            <View style={[styles.resultBox, decodedAuthor ? styles.resultSuccess : styles.resultError]}>
                                                {decodedAuthor ? (
                                                    <View style={styles.resultRow}>
                                                        <User size={16} color="#34d399" />
                                                        <Text style={styles.resultTextSuccess}>{t('settings.fingerprint.author')}: {decodedAuthor}</Text>
                                                    </View>
                                                ) : (
                                                    <Text style={styles.resultTextError}>{t('settings.fingerprint.noFingerprint')}</Text>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* About Section */}
                    <View style={styles.section}>
                        {renderSectionHeader(t('settings.sections.about'))}
                        <View style={styles.card}>
                            {renderItem(
                                MessageCircle,
                                t('settings.items.support'),
                                () => Linking.openURL('https://t.me/aiversebots?direct'),
                                undefined,
                                null,
                                false
                            )}
                            {renderItem(
                                Clock,
                                t('settings.items.storage'),
                                () => Alert.alert('Info', t('settings.messages.storageToast')),
                                t('settings.items.storageValue'),
                                null,
                                false
                            )}
                            {renderItem(
                                Info,
                                t('settings.items.version'),
                                () => { }, // No action
                                'v3.2.6',
                                null,
                                true
                            )}
                        </View>
                    </View>

                    <View style={styles.bottomSpacer} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginLeft: 4,
        marginBottom: 8,
    },
    card: {
        backgroundColor: colors.surfaceElevated,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
    },
    highlightCard: {
        borderColor: colors.primary,
        borderWidth: 2,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.surfaceElevated,
    },
    itemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    itemContent: {
        flex: 1,
    },
    itemLabel: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
    },
    itemValue: {
        fontSize: 14,
        color: colors.textSecondary,
        marginRight: 8,
    },
    expandedContent: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        paddingLeft: 64, // Indent to align with text
    },
    optionLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    optionLabelActive: {
        color: colors.text,
        fontWeight: '600',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        paddingHorizontal: 16,
        paddingLeft: 64,
    },
    switchLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    pulseContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    pulseText: {
        fontSize: 10,
        color: colors.primaryLight,
        marginLeft: 4,
    },
    fingerprintContent: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    fingerprintDesc: {
        fontSize: 12,
        color: colors.textMuted,
        marginBottom: 12,
    },
    fingerprintInput: {
        backgroundColor: colors.surfaceLight,
        borderRadius: 12,
        padding: 12,
        color: colors.text,
        height: 100,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    checkButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    disabledButton: {
        opacity: 0.5,
    },
    checkButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    resultBox: {
        marginTop: 12,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    resultSuccess: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    resultError: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    resultRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    resultTextSuccess: {
        color: '#34d399',
        fontSize: 14,
        fontWeight: '500',
    },
    resultTextError: {
        color: '#f87171',
        fontSize: 14,
    },
    bottomSpacer: {
        height: 40,
    }
});
