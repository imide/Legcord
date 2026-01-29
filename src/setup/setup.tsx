import {
    Box,
    ChevronLeft,
    ChevronRight,
    CircleAlert,
    LaptopMinimal,
    LaptopMinimalCheck,
    MinimizeIcon,
    Monitor,
    PuzzleIcon,
    Settings,
    Sparkles,
} from "lucide-solid";
import { For, Show, createResource, createSignal } from "solid-js";
import { render } from "solid-js/web";
import { Motion } from "solid-motionone";

const Welcome = ({ onNext, t }: { onNext: () => void; t: () => Record<string, string> | undefined }) => (
    <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} class="text-center">
        <Sparkles class="w-8 h-8 text-purple-400 mx-auto mb-4" />
        <h1 class="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 via-white to-purple-400 bg-clip-text text-transparent">
            {t()?.["setup-welcomeTitle"] ?? "Welcome to Legcord"}
        </h1>
        <p class="text-gray-400 mb-8">
            {t()?.["setup-welcomeSubtitle"] ?? "Let's get you set up with your perfect configuration."}
        </p>
        <Motion.button
            onClick={onNext}
            class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium"
        >
            {t()?.["setup-getStarted"] ?? "Get Started"}
        </Motion.button>
    </Motion.div>
);

const WindowStyle = ({
    readyToNext,
    t,
}: { readyToNext: (valid: boolean) => void; t: () => Record<string, string> | undefined }) => {
    const [selectedStyle, setSelectedStyle] = createSignal<string | null>(null);

    const handleStyleSelect = (styleId: string) => {
        const newValue = selectedStyle() === styleId ? null : styleId;
        setSelectedStyle(newValue);
        if (newValue === null) {
            readyToNext(false);
        } else {
            readyToNext(true);
            window.setup.saveSettings({ windowStyle: newValue });
        }
    };

    const styles = [
        {
            id: "native",
            titleKey: "setup-windowStyle-nativeTitle",
            descKey: "setup-windowStyle-nativeDesc",
            screenshot: "legcord://assets/native.png",
        },
        {
            id: "default",
            titleKey: "setup-windowStyle-customTitle",
            descKey: "setup-windowStyle-customDesc",
            screenshot: "legcord://assets/custom.png",
        },
    ];
    const lang = t();

    return (
        <div class="space-y-6">
            <div class="text-center">
                <Monitor class="w-8 h-8 text-purple-400 mx-auto mb-4" />
                <h2 class="text-2xl font-bold text-white mb-2">
                    {lang?.["setup-chooseWindowStyle"] ?? "Choose Window Style"}
                </h2>
                <p class="text-gray-400">
                    {lang?.["setup-selectAppearance"] ?? "Select how Legcord appears on your machine"}
                </p>
            </div>

            <div class="space-y-4">
                <For each={styles}>
                    {(item) => (
                        <Motion.button
                            onClick={() => handleStyleSelect(item.id)}
                            class={`group relative w-full p-4 rounded-xl transition-all duration-300 text-left ${
                                selectedStyle() === item.id
                                    ? "bg-purple-900/40 border border-purple-500/50 shadow-lg shadow-purple-500/20"
                                    : "bg-gray-800/40 border border-gray-700/30 hover:bg-gray-800/60"
                            }`}
                        >
                            <div class="flex items-center gap-4">
                                <div class="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                        src={item.screenshot}
                                        alt={`${lang?.[item.titleKey] ?? item.titleKey} preview`}
                                        class="w-full h-full object-cover"
                                    />
                                </div>
                                <div class="flex-1">
                                    <h3 class="text-lg font-semibold text-white">
                                        {lang?.[item.titleKey] ?? item.titleKey}
                                    </h3>
                                    <p class="text-gray-400 text-sm mt-1">{lang?.[item.descKey] ?? item.descKey}</p>
                                </div>
                                <div
                                    class={`w-5 h-5 rounded-full border-2 transition-colors ${
                                        selectedStyle() === item.id ? "border-purple-400" : "border-gray-600"
                                    }`}
                                >
                                    {selectedStyle() === item.id && (
                                        <div class="w-3 h-3 m-0.5 rounded-full bg-purple-400" />
                                    )}
                                </div>
                            </div>
                        </Motion.button>
                    )}
                </For>
            </div>
        </div>
    );
};

const TraySettings = ({
    readyToNext,
    t,
}: { readyToNext: (valid: boolean) => void; t: () => Record<string, string> | undefined }) => {
    const [selectedOption, setSelectedOption] = createSignal<string | null>(null);

    const handleOptionSelect = (optionId: string) => {
        const newValue = selectedOption() === optionId ? null : optionId;
        setSelectedOption(newValue);
        if (newValue === null) {
            readyToNext(false);
        } else {
            readyToNext(true);
            window.setup.saveSettings({ tray: newValue });
        }
    };

    const options = [
        { id: "dynamic", titleKey: "setup-trayEnableTitle", descKey: "setup-trayEnableDesc", icon: LaptopMinimalCheck },
        { id: "disabled", titleKey: "setup-trayDisableTitle", descKey: "setup-trayDisableDesc", icon: LaptopMinimal },
    ];
    const lang = t();

    return (
        <div class="space-y-6">
            <div class="text-center">
                <MinimizeIcon class="w-8 h-8 text-purple-400 mx-auto mb-4" />
                <h2 class="text-2xl font-bold text-white mb-2">{lang?.["setup-systemTray"] ?? "System Tray"}</h2>
                <p class="text-gray-400">
                    {lang?.["setup-trayChoose"] ?? "Choose whether to enable the system tray icon"}
                </p>
            </div>
            <Show when={window.setup.os === "linux"}>
                <div class="space-y-4">
                    <div class="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-3">
                        <CircleAlert class="w-5 h-5 text-yellow-400 flex-shrink-0" />
                        <div>
                            <p class="text-yellow-200/80 text-sm mt-0.5">
                                {lang?.["setup-linuxTrayWarning"] ??
                                    "System tray functionality may have issues or behave differently on Linux systems."}
                            </p>
                        </div>
                    </div>
                </div>
            </Show>
            <For each={options}>
                {(option) => (
                    <Motion.button
                        onClick={() => handleOptionSelect(option.id)}
                        class={`group relative w-full p-4 rounded-xl transition-all duration-300 text-left ${
                            selectedOption() === option.id
                                ? "bg-purple-900/40 border border-purple-500/50 shadow-lg shadow-purple-500/20"
                                : "bg-gray-800/40 border border-gray-700/30 hover:bg-gray-800/60"
                        }`}
                    >
                        <div class="flex items-start gap-4">
                            <div
                                class={`w-10 h-10 rounded-lg transition-colors flex items-center justify-center ${
                                    selectedOption() === option.id ? "bg-purple-500/20" : "bg-gray-800/40"
                                }`}
                            >
                                <option.icon class="w-6 h-6 text-purple-400" />
                            </div>
                            <div class="flex-1">
                                <h3 class="text-lg font-semibold text-white">
                                    {lang?.[option.titleKey] ?? option.titleKey}
                                </h3>
                                <p class="text-gray-400 text-sm mt-1">{lang?.[option.descKey] ?? option.descKey}</p>
                            </div>
                            <div
                                class={`w-5 h-5 rounded-full border-2 transition-colors ${
                                    selectedOption() === option.id ? "border-purple-400" : "border-gray-600"
                                }`}
                            >
                                {selectedOption() === option.id && (
                                    <div class="w-3 h-3 m-0.5 rounded-full bg-purple-400" />
                                )}
                            </div>
                        </div>
                    </Motion.button>
                )}
            </For>
        </div>
    );
};

const Finish = ({ restart, t }: { restart: () => void; t: () => Record<string, string> | undefined }) => (
    <div class="text-center">
        <Box class="w-8 h-8 text-purple-400 mx-auto mb-4" />
        <h2 class="text-2xl font-bold text-white mb-4">{t()?.["setup-finishTitle"] ?? "You're All Set!"}</h2>
        <p class="text-gray-400 mb-6">
            {t()?.["setup-finishSubtitle"] ??
                "Your Legcord configuration is complete and personalized to your preferences."}
        </p>
        <div class="p-4 rounded-xl bg-gray-800/40 border border-gray-700/30 mb-6">
            <Settings class="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p class="text-sm text-gray-400">
                {t()?.["setup-finishSettingsNote"] ??
                    "Need to make changes later? You'll find all these options in Discord's settings menu under Legcord."}
            </p>
        </div>
        <Motion.button
            onClick={restart}
            class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium"
        >
            {t()?.["setup-launchLegcord"] ?? "Launch Legcord"}
        </Motion.button>
    </div>
);

const ModSelector = ({
    readyToNext,
    t,
}: { readyToNext: (valid: boolean) => void; t: () => Record<string, string> | undefined }) => {
    const [selectedMod, setSelectedMod] = createSignal<string | null>(null);
    const handleModSelect = (optionId: string) => {
        const newValue = selectedMod() === optionId ? null : optionId;
        setSelectedMod(newValue);
        if (newValue === null) {
            readyToNext(false);
        } else {
            readyToNext(true);
            if (newValue !== "shelter") {
                window.setup.saveSettings({ mods: [newValue] });
            } else {
                window.setup.saveSettings({ mods: [] });
            }
        }
    };
    const mods = [
        {
            id: "vencord",
            titleKey: "setup-vencordTitle",
            descKey: "setup-vencordDesc",
            icon: "legcord://assets/vencord.png",
        },
        {
            id: "equicord",
            titleKey: "setup-equicordTitle",
            descKey: "setup-equicordDesc",
            icon: "legcord://assets/equicord.png",
        },
    ];
    const lang = t();

    return (
        <div class="space-y-6">
            <div class="text-center">
                <PuzzleIcon class="w-8 h-8 text-purple-400 mx-auto mb-4" />
                <h2 class="text-2xl font-bold text-white mb-2">
                    {lang?.["setup-modSelectorTitle"] ?? "Choose Your Client Mod"}
                </h2>
                <p class="text-gray-400">
                    {lang?.["setup-modSelectorSubtitle"] ??
                        "Legcord includes Shelter out of the box, but you can also choose another client mod if wanted."}
                </p>
            </div>

            <div class="space-y-3">
                <For each={mods} fallback={<div>{lang?.["setup-loading"] ?? "Loading..."}</div>}>
                    {(mod) => (
                        <Motion.button
                            onClick={() => handleModSelect(mod.id)}
                            class={`group relative w-full p-4 rounded-xl transition-all duration-300 text-left ${
                                selectedMod() === mod.id
                                    ? "bg-purple-900/40 border border-purple-500/50 shadow-lg shadow-purple-500/20"
                                    : "bg-gray-800/40 border border-gray-700/30 hover:bg-gray-800/60"
                            }`}
                        >
                            <div class="flex items-start gap-4">
                                <div
                                    class={`w-10 h-10 rounded-lg transition-colors overflow-hidden ${
                                        selectedMod() === mod.id ? "bg-purple-500/20" : "bg-gray-800/40"
                                    }`}
                                >
                                    <img
                                        src={mod.icon}
                                        alt={`${lang?.[mod.titleKey] ?? mod.titleKey} icon`}
                                        class="w-full h-full object-contain p-1.5"
                                    />
                                </div>
                                <div class="flex-1">
                                    <h3 class="text-lg font-semibold text-white">
                                        {lang?.[mod.titleKey] ?? mod.titleKey}
                                    </h3>
                                    <p class="text-gray-400 text-sm mt-1">{lang?.[mod.descKey] ?? mod.descKey}</p>
                                </div>
                                <div
                                    class={`w-5 h-5 rounded-full border-2 transition-colors ${
                                        selectedMod() === mod.id ? "border-purple-400" : "border-gray-600"
                                    }`}
                                >
                                    {selectedMod() === mod.id && (
                                        <div class="w-3 h-3 m-0.5 rounded-full bg-purple-400" />
                                    )}
                                </div>
                            </div>
                        </Motion.button>
                    )}
                </For>
            </div>

            <Motion.button
                onClick={() => handleModSelect("shelter")}
                class={`w-full px-6 py-2.5 rounded-xl border transition-colors font-medium
          ${
              selectedMod() === "shelter"
                  ? "border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                  : "border-gray-700/30 text-gray-500 hover:border-purple-500/50 hover:text-purple-400 hover:bg-purple-500/10"
          }`}
            >
                {lang?.["setup-useShelterOnly"] ?? "Use Shelter Only"}
            </Motion.button>
        </div>
    );
};

function Stepper() {
    const [t] = createResource(() => window.setup.getRawLang());
    const [currentStep, setCurrentStep] = createSignal(0);
    const [isValid, setValid] = createSignal(true);
    const maxSteps = 5;
    const handleNext = () => {
        if (!isValid()) return;
        setCurrentStep((prev) => prev + 1);
        setValid(false);
    };
    const handleBack = () => {
        setCurrentStep((prev) => prev - 1);
        if (currentStep() === 0) {
            setValid(true);
        }
    };
    const setReady = (valid: boolean) => {
        setValid(valid);
    };
    const restart = () => {
        console.log("Restarting...");
        window.setup.saveSettings({ doneSetup: true });
        window.setup.restart();
    };
    const stepOfText = () => {
        const lang = t();
        const template = lang?.["setup-stepOf"] ?? "Step {current} of {total}";
        return template.replace("{current}", String(currentStep() + 1)).replace("{total}", String(maxSteps));
    };
    return (
        <div class="min-h-screen flex items-center justify-center">
            <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                class="w-full max-w-md p-8 rounded-3xl bg-gradient-to-br from-[#171631] via-gray-900 to-[#171631] backdrop-blur-xl border border-gray-800/50 shadow-2xl"
            >
                <Show when={currentStep() === 0}>
                    <Welcome onNext={handleNext} t={t} />
                </Show>
                <Show when={currentStep() === 1}>
                    <WindowStyle readyToNext={setReady} t={t} />
                </Show>
                <Show when={currentStep() === 2}>
                    <ModSelector readyToNext={setReady} t={t} />
                </Show>
                <Show when={currentStep() === 3}>
                    <TraySettings readyToNext={setReady} t={t} />
                </Show>
                <Show when={currentStep() === 4}>
                    <Finish restart={restart} t={t} />
                </Show>

                <Show when={currentStep() !== 0 && currentStep() !== 4}>
                    <div class="mt-8 flex items-center justify-between">
                        <Motion.button
                            onClick={handleBack}
                            class="px-6 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-medium transition-colors inline-flex items-center gap-2"
                        >
                            <ChevronLeft class="w-4 h-4" />
                            {t()?.["setup-back"] ?? "Back"}
                        </Motion.button>

                        <div class="px-4 py-1 rounded-full bg-gray-800/50 text-gray-400 font-medium text-sm">
                            {stepOfText()}
                        </div>

                        <Motion.button
                            onClick={handleNext}
                            class={`px-6 py-2.5 rounded-xl text-white font-medium transition-colors inline-flex items-center gap-2 ${
                                isValid()
                                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
                                    : "bg-gray-700 cursor-not-allowed opacity-50"
                            }`}
                        >
                            {t()?.["setup-next"] ?? "Next"}
                            <ChevronRight class="w-4 h-4" />
                        </Motion.button>
                    </div>
                </Show>
            </Motion.div>
        </div>
    );
}

const rootElement = document.getElementById("root");
if (rootElement) {
    render(Stepper, rootElement);
} else {
    console.error("Root element not found");
}
