import { AboutPopup } from "./AboutPopup.jsx";
import classes from "./SupportBanner.module.css";
import { InfoIcon } from "./icons/InfoIcon.jsx";

const {
    plugin: { store },
    ui: { openModal },
} = shelter;

function openAboutModal() {
    openModal((close: () => void) => <AboutPopup close={close} />);
}

export function SupportBanner() {
    return (
        <div class={classes.supportBanner}>
            <div class={classes.bannerTopRow}>
                <button type="button" class={classes.infoButton} onClick={openAboutModal} title="About Legcord">
                    <InfoIcon />
                </button>
                <h3 class={classes.topRowTitle}>{store.i18n["supportBanner-title"]}</h3>
                <button
                    type="button"
                    class={classes.dismissButton}
                    onClick={() => window.legcord.settings.setConfig("supportBannerDismissed", true)}
                    title="Dismiss this banner"
                >
                    X
                </button>
            </div>
            <div class={classes.supportBannerContent}>
                <p>{store.i18n["supportBanner-subtitle"]}</p>
                <button
                    type="button"
                    class={classes.donateButton}
                    onClick={() => window.open("https://github.com/sponsors/smartfrigde", "_blank")}
                >
                    {store.i18n["supportBanner-donate"]}
                </button>
            </div>
        </div>
    );
}
