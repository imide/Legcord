import { createSignal } from "solid-js";
import type { ThemeManifest } from "../../../@types/themeManifest.js";
import { refreshThemes } from "../settings.js";
import classes from "./ThemesCard.module.css";

const {
    ui: { Header, Switch, HeaderTags, showToast },
    plugin: { store },
} = shelter;

export const ThemesCard = (props: { theme: ThemeManifest }) => {
    const [switchState, setSwitchState] = createSignal(props.theme.enabled);

    function toggleTheme(state: boolean) {
        setSwitchState(state);
        if (props.theme.id) {
            window.legcord.themes.set(props.theme.id, switchState());
        }
        refreshThemes();
    }
    function removeTheme() {
        if (props.theme.id) {
            window.legcord.themes.uninstall(props.theme.id);
        }
        refreshThemes();
    }
    function editTheme() {
        if (props.theme.id) {
            window.legcord.themes.edit(props.theme.id);
        }
    }
    function updateTheme() {
        if (props.theme.updateSrc) {
            window.legcord.themes.install(props.theme.updateSrc);
        }
        setTimeout(() => {
            refreshThemes();
        }, 1000);
        showToast({
            title: store.i18n["themes-success"],
            content: store.i18n["themes-updated"],
            duration: 3000,
        });
    }
    function openThemesFolder() {
        if (props.theme.id) {
            window.legcord.themes.folder(props.theme.id);
        }
    }
    return (
        <div class={classes.card}>
            <div class={classes.info}>
                <div class={classes.mainInfo}>
                    <Header tag={HeaderTags.H2} class={classes.title}>
                        {props.theme.name}
                    </Header>
                    <Header tag={HeaderTags.H3}>{store.i18n["themes-by"]}</Header>
                    <Header class={classes.eyebrow} tag={HeaderTags.EYEBROW}>
                        {props.theme.author}
                    </Header>
                    <div class={classes.switch}>
                        <Switch checked={switchState()} onChange={toggleTheme} />
                    </div>
                </div>
                <Header tag={HeaderTags.H5}>{props.theme.description}</Header>
            </div>
            <button title={store.i18n["themes-delete"]} type="button" onClick={removeTheme} class={classes.btn}>
                <img class={classes.icon} alt={store.i18n["themes-delete"]} src="legcord://assets/Trash.png" />
            </button>
            <button title={store.i18n["themes-edit"]} type="button" onClick={editTheme} class={classes.btn}>
                <img class={classes.icon} alt={store.i18n["themes-edit"]} src="legcord://assets/Edit.png" />
            </button>
            <button title={store.i18n["themes-update"]} type="button" onClick={updateTheme} class={classes.btn}>
                <img class={classes.icon} alt={store.i18n["themes-update"]} src="legcord://assets/UpgradeArrow.png" />
            </button>
            <button title={store.i18n["themes-open"]} type="button" onClick={openThemesFolder} class={classes.btn}>
                <img class={classes.icon} alt={store.i18n["themes-open"]} src="legcord://assets/Folder.png" />
            </button>
        </div>
    );
};
