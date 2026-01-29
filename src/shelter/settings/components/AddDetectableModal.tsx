import type { Game } from "arrpc";
import { createSignal } from "solid-js";
const {
    ui: {
        ModalRoot,
        ModalBody,
        ModalConfirmFooter,
        ModalSizes,
        ModalHeader,
        TextBox,
        Header,
        HeaderTags,
        Divider,
        showToast,
    },
    plugin: { store },
} = shelter;
export const AddDetectableModal = (props: { close: () => void; executable: string }) => {
    const [appName, setAppName] = createSignal("");
    const [appId, setAppId] = createSignal("");
    const [themes, setThemes] = createSignal("");
    const [aliases, setAliases] = createSignal("");
    const [enabled, setEnabled] = createSignal(true);

    function save() {
        if (!appName().trim() || !appId().trim() || !props.executable) {
            return showToast({
                title: store.i18n["detectable-missingFields"],
                content: store.i18n["detectable-fillAllFields"],
                duration: 3000,
            });
        }
        const current = store.settings.detectables || [];
        const game: Game = {
            name: appName().trim(),
            executables: [
                {
                    name: props.executable,
                    is_launcher: false,
                    os: window.legcord.platform as "win32" | "linux" | "darwin",
                },
            ],
            id: appId().trim(),
            aliases:
                aliases()
                    .split(",")
                    .map((a) => a.trim()) || [],
            hook: false,
            overlay: true,
            overlay_compatibility_hook: false,
            overlay_methods: null,
            overlay_warn: false,
            themes:
                themes()
                    .split(",")
                    .map((t) => t.trim()) || [],
        };
        current.push(game);
        store.settings.detectables = current;
        window.legcord.rpc.addDetectable(game);
        props.close();
    }

    const t = store.i18n;
    return (
        <ModalRoot size={ModalSizes.SMALL}>
            <ModalHeader close={props.close}>{t["detectable-addApp"]}</ModalHeader>
            <ModalBody>
                <Header tag={HeaderTags.H5}>{t["detectable-appName"]}</Header>
                <TextBox value={appName()} onInput={setAppName} placeholder={t["detectable-placeholderName"]} />
                <Divider mt mb />
                <Header tag={HeaderTags.H5}>{t["detectable-appId"]}</Header>
                <TextBox value={appId()} onInput={setAppId} placeholder={t["detectable-placeholderId"]} />
                <Divider mt mb />
                <Header tag={HeaderTags.H5}>{t["detectable-themes"]}</Header>
                <TextBox value={themes()} onInput={setThemes} placeholder={t["detectable-placeholderThemes"]} />
                <Divider mt mb />
                <Header tag={HeaderTags.H5}>{t["detectable-aliases"]}</Header>
                <TextBox value={aliases()} onInput={setAliases} placeholder={t["detectable-placeholderAliases"]} />
                <label style={{ display: "flex", "align-items": "center", gap: "0.5em" }}>
                    <input
                        type="checkbox"
                        checked={enabled()}
                        onChange={(e) => setEnabled((e.target as HTMLInputElement).checked)}
                    />
                    {t["detectable-enabled"]}
                </label>
            </ModalBody>
            <ModalConfirmFooter confirmText={t["keybind-add"]} onConfirm={save} close={props.close} />
        </ModalRoot>
    );
};
