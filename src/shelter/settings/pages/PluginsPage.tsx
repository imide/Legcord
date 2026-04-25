import { For, Show, createSignal, onMount } from "solid-js";
import type { LegcordPluginInfo } from "../../../@types/legcordWindow.js";
import { PluginCard } from "../components/PluginCard.jsx";

const {
    ui: { Header, HeaderTags, Divider, Button, ButtonSizes, showToast },
} = shelter;

export function PluginsPage() {
    const [plugins, setPlugins] = createSignal<LegcordPluginInfo[]>([]);
    const [busyIds, setBusyIds] = createSignal<string[]>([]);

    const setBusy = (pluginId: string, state: boolean) => {
        setBusyIds((current) => {
            if (state) {
                return current.includes(pluginId) ? current : [...current, pluginId];
            }
            return current.filter((id) => id !== pluginId);
        });
    };

    const isBusy = (pluginId: string) => busyIds().includes(pluginId);

    const refreshPlugins = async () => {
        const list = await window.legcord.plugins.list();
        setPlugins(list);
    };

    const onToggle = async (plugin: LegcordPluginInfo, enabled: boolean) => {
        setBusy(plugin.id, true);
        try {
            if (enabled && !plugin.compatible) {
                showToast({
                    title: "Plugins",
                    content:
                        plugin.compatibilityMessage ?? `${plugin.name} is not compatible with this Legcord version.`,
                    duration: 3500,
                });
                return;
            }
            const result = await window.legcord.plugins.setEnabled(plugin.id, enabled);
            if (!result.ok) {
                showToast({
                    title: "Plugins",
                    content: `Failed to ${enabled ? "enable" : "disable"} ${plugin.name}.`,
                    duration: 3000,
                });
            }
            await refreshPlugins();
        } finally {
            setBusy(plugin.id, false);
        }
    };

    const onReload = async (plugin: LegcordPluginInfo) => {
        setBusy(plugin.id, true);
        try {
            const result = await window.legcord.plugins.reload(plugin.id);
            showToast({
                title: "Plugins",
                content: result.ok ? `Reloaded ${plugin.name}.` : `Failed to reload ${plugin.name}.`,
                duration: 2500,
            });
            await refreshPlugins();
        } finally {
            setBusy(plugin.id, false);
        }
    };

    onMount(() => {
        void refreshPlugins();
    });

    return (
        <>
            <Header tag={HeaderTags.H1}>Plugins</Header>
            <Divider mt mb />
            <div style={{ display: "flex", gap: "8px", "margin-bottom": "12px" }}>
                <Button size={ButtonSizes.LARGE} onClick={() => void refreshPlugins()}>
                    Refresh List
                </Button>
                <Button size={ButtonSizes.LARGE} onClick={window.legcord.plugins.openFolder}>
                    Open Plugins Folder
                </Button>
            </div>
            <Show when={plugins().length === 0}>
                <Header tag={HeaderTags.H5}>No runtime plugins found in your plugins folder.</Header>
            </Show>
            <For each={plugins()}>
                {(plugin) => (
                    <PluginCard
                        plugin={plugin}
                        busy={isBusy(plugin.id)}
                        onToggle={(enabled) => void onToggle(plugin, enabled)}
                        onReload={() => void onReload(plugin)}
                    />
                )}
            </For>
        </>
    );
}
