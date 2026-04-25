import type { LegcordPluginInfo } from "../../../@types/legcordWindow.js";
import classes from "./PluginCard.module.css";

const {
    ui: { Header, HeaderTags, Switch, Button, ButtonSizes },
} = shelter;

export function PluginCard(props: {
    plugin: LegcordPluginInfo;
    busy: boolean;
    onToggle: (enabled: boolean) => void;
    onReload: () => void;
}) {
    const targets = [
        props.plugin.hasMain ? "main" : null,
        props.plugin.hasPreload ? "preload" : null,
        props.plugin.hasRenderer ? "renderer" : null,
    ]
        .filter((value): value is string => value !== null)
        .join(", ");

    return (
        <div class={classes.card}>
            <div class={classes.main}>
                <div class={classes.titleRow}>
                    <Header tag={HeaderTags.H3} class={classes.title}>
                        {props.plugin.name}
                    </Header>
                    <Switch checked={props.plugin.enabled} onChange={props.onToggle} disabled={props.busy} />
                </div>
                <div class={classes.meta}>
                    {props.plugin.id} • v{props.plugin.version}
                    {props.plugin.author ? ` • ${props.plugin.author}` : ""}
                </div>
                {props.plugin.description ? <div class={classes.description}>{props.plugin.description}</div> : null}
                <div class={classes.targets}>Targets: {targets || "none"}</div>
                {!props.plugin.compatible ? (
                    <div class={classes.description}>
                        {props.plugin.compatibilityMessage ?? "Plugin is not compatible."}
                    </div>
                ) : null}
            </div>
            <div class={classes.actions}>
                <Button
                    size={ButtonSizes.SMALL}
                    onClick={props.onReload}
                    disabled={props.busy || !props.plugin.enabled}
                >
                    Reload
                </Button>
            </div>
        </div>
    );
}
