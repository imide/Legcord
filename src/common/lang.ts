import fs from "node:fs";
import path from "node:path";
import { app } from "electron";
import type { i18nStrings } from "../@types/i18nStrings.js";

// Performance optimization: Cache language files to avoid reading on every call
let languageCache: i18nStrings | null = null;
let languageCacheTime = 0;
let languageConfigCache: string | null = null;
let languageConfigCacheTime = 0;
const LANGUAGE_CACHE_TTL = 5000; // Cache for 5 seconds

export function setLang(language: string): void {
    const langConfigFile = `${path.join(app.getPath("userData"), "/storage/")}lang.json`;
    if (!fs.existsSync(langConfigFile)) {
        fs.writeFileSync(langConfigFile, "{}", "utf-8");
    }
    const rawData = fs.readFileSync(langConfigFile, "utf-8");
    const parsed = JSON.parse(rawData) as i18nStrings;
    parsed.lang = language;
    const toSave = JSON.stringify(parsed, null, 4);
    console.log(`Setting language to ${language}`);
    fs.writeFileSync(langConfigFile, toSave, "utf-8");

    // Performance optimization: Invalidate cache when language changes
    languageConfigCache = language;
    languageConfigCacheTime = Date.now();
    languageCache = null; // Invalidate language file cache
}
let language: string;
export function getLang(object: string): string {
    // Performance optimization: Use cached language config if available
    const now = Date.now();
    if (languageConfigCache && now - languageConfigCacheTime < LANGUAGE_CACHE_TTL) {
        language = languageConfigCache;
    } else if (language === undefined) {
        try {
            const userDataPath = app.getPath("userData");
            const storagePath = path.join(userDataPath, "/storage/");
            const langConfigFile = `${storagePath}lang.json`;
            const rawData = fs.readFileSync(langConfigFile, "utf-8");
            const parsed = JSON.parse(rawData) as i18nStrings;
            language = parsed.lang;
            languageConfigCache = language;
            languageConfigCacheTime = now;
        } catch (_e) {
            console.log("Language config file doesn't exist. Fallback to English.");
            language = "en-US";
            languageConfigCache = language;
            languageConfigCacheTime = now;
        }
    }
    if (language.length === 2) {
        language = `${language}-${language.toUpperCase()}`;
    }

    // Performance optimization: Use cached language file if available
    const normalizedLang = language;
    if (languageCache && now - languageCacheTime < LANGUAGE_CACHE_TTL) {
        if (languageCache[object] !== undefined) {
            return languageCache[object];
        }
    }

    let langPath = path.join(import.meta.dirname, "../", `/assets/lang/${normalizedLang}.json`);
    if (!fs.existsSync(langPath)) {
        langPath = path.join(import.meta.dirname, "../", "/assets/lang/en-US.json");
    }
    let rawData = fs.readFileSync(langPath, "utf-8");
    let parsed = JSON.parse(rawData) as i18nStrings;
    if (parsed[object] === undefined) {
        console.log(`${object} is undefined in ${normalizedLang}`);
        langPath = path.join(import.meta.dirname, "../", "/assets/lang/en-US.json");
        rawData = fs.readFileSync(langPath, "utf-8");
        parsed = JSON.parse(rawData) as i18nStrings;
    }

    // Update cache
    languageCache = parsed;
    languageCacheTime = now;

    return parsed[object];
}
export function getRawLang(): i18nStrings {
    // Performance optimization: Use cached result if available
    const now = Date.now();
    if (languageCache && now - languageCacheTime < LANGUAGE_CACHE_TTL) {
        return languageCache;
    }

    if (language === undefined) {
        try {
            const userDataPath = app.getPath("userData");
            const storagePath = path.join(userDataPath, "/storage/");
            const langConfigFile = `${storagePath}lang.json`;
            const rawData = fs.readFileSync(langConfigFile, "utf-8");
            const parsed = JSON.parse(rawData) as i18nStrings;
            language = parsed.lang;
            languageConfigCache = language;
            languageConfigCacheTime = now;
        } catch (_e) {
            console.log("Language config file doesn't exist. Fallback to English.");
            language = "en-US";
            languageConfigCache = language;
            languageConfigCacheTime = now;
        }
    }
    if (language.length === 2) {
        language = `${language}-${language.toUpperCase()}`;
    }
    let langPath = path.join(import.meta.dirname, "../", `/assets/lang/${language}.json`);
    if (!fs.existsSync(langPath)) {
        langPath = path.join(import.meta.dirname, "../", "/assets/lang/en-US.json");
    }
    const fallbackPath = path.join(import.meta.dirname, "../", "/assets/lang/en-US.json");
    const rawData = fs.readFileSync(langPath, "utf-8");
    const parsed = JSON.parse(rawData) as i18nStrings;
    const fallbackData = fs.readFileSync(fallbackPath, "utf-8");
    const fallbackParsed = JSON.parse(fallbackData) as i18nStrings;
    for (const key in fallbackParsed) {
        if (parsed[key] === undefined) {
            parsed[key] = fallbackParsed[key];
        }
    }

    // Update cache
    languageCache = parsed;
    languageCacheTime = now;

    return parsed;
}
export function getLangName(): string {
    // Performance optimization: Use cached language config if available
    const now = Date.now();
    if (languageConfigCache && now - languageConfigCacheTime < LANGUAGE_CACHE_TTL) {
        return languageConfigCache;
    }

    if (language === undefined) {
        try {
            const userDataPath = app.getPath("userData");
            const storagePath = path.join(userDataPath, "/storage/");
            const langConfigFile = `${storagePath}lang.json`;
            const rawData = fs.readFileSync(langConfigFile, "utf-8");
            const parsed = JSON.parse(rawData) as i18nStrings;
            language = parsed.lang;
            languageConfigCache = language;
            languageConfigCacheTime = now;
        } catch (_e) {
            console.log("Language config file doesn't exist. Fallback to English.");
            language = "en-US";
            languageConfigCache = language;
            languageConfigCacheTime = now;
        }
    }
    if (language.length === 2) {
        language = `${language}-${language.toUpperCase()}`;
    }
    return language;
}
