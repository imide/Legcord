import { fetchApp, fetchAssetId, fetchExternalAsset } from "./asset.js";

const {
    flux: { dispatcher: FluxDispatcher },
} = shelter;

const LAST_DETECTED_MAX = 5;
let lastDetectedGames: string[] = [];

async function listen(msg: {
    activity: {
        assets: { large_image: string | null | undefined; small_image: string | null | undefined };
        application_id: number;
        name: string;
    };
}) {
    if (!msg.activity) return;

    const appId = msg.activity.application_id;
    const app = await fetchApp(appId);
    const gameName = msg.activity.name || app.name;
    if (!msg.activity.name) msg.activity.name = gameName;

    lastDetectedGames = [gameName, ...lastDetectedGames.filter((n) => n !== gameName)].slice(0, LAST_DETECTED_MAX);
    window.dispatchEvent(new CustomEvent("legcord-lastDetectedGamesUpdate", { detail: lastDetectedGames }));

    const blacklist: string[] = window.legcord.settings.getConfig().rpcActivityBlacklist ?? [];
    if (blacklist.includes(gameName)) return;

    if (
        msg.activity?.assets?.large_image?.startsWith("https://") ??
        msg.activity?.assets?.small_image?.startsWith("https://")
    ) {
        if (typeof msg.activity.assets.large_image === "string") {
            msg.activity.assets.large_image = await fetchExternalAsset(
                msg.activity.application_id,
                msg.activity.assets.large_image,
            );
        }
        if (typeof msg.activity.assets.small_image === "string") {
            msg.activity.assets.small_image = await fetchExternalAsset(
                msg.activity.application_id,
                msg.activity.assets.small_image,
            );
        }
    } else {
        if (msg.activity?.assets?.large_image)
            msg.activity.assets.large_image = await fetchAssetId(
                msg.activity.application_id,
                msg.activity.assets.large_image,
            );
        if (msg.activity?.assets?.small_image)
            msg.activity.assets.small_image = await fetchAssetId(
                msg.activity.application_id,
                msg.activity.assets.small_image,
            );
    }
    console.log("RPC activity update", msg.activity);
    FluxDispatcher.dispatch({ type: "LOCAL_ACTIVITY_UPDATE", ...msg }); // set RPC status
}

export function onLoad() {
    // @ts-expect-error
    window.legcordRPC = { listen };
}
