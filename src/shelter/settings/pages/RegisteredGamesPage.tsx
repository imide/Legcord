import type { GameList, ProcessInfo } from "arrpc";
import { For, Show, createSignal, onMount } from "solid-js";
import { sleep } from "../../../common/sleep.js";
import { AddDetectableModal } from "../components/AddDetectableModal.jsx";
import { DetectableCard } from "../components/DetectableCard.jsx";
import { Dropdown } from "../components/Dropdown.jsx";
import classes from "./RegisteredGames.module.css";

const {
    ui: { Header, HeaderTags, Divider, Button, ButtonSizes, openModal },
} = shelter;

export function RegisteredGamesPage() {
    const [processList, setProcessList] = createSignal<ProcessInfo[]>();
    const [detectables, setDetectables] = createSignal<GameList>([]);
    const [selectedDetectable, setSelectedDetectable] = createSignal("refresh");

    function refreshDetectables() {
        window.legcord.rpc.refreshProcessList();
        setDetectables(window.legcord.rpc.getDetectables());
        sleep(500).then(() => {
            setProcessList(window.legcord.rpc.getProcessList());
        });
    }

    onMount(() => {
        refreshDetectables();
    });

    function addNewGame() {
        openModal(({ close }: { close: () => void }) => (
            <AddDetectableModal
                close={() => {
                    close();
                    refreshDetectables();
                }}
                executable={selectedDetectable()}
            />
        ));
    }

    const t = shelter.plugin.store.i18n;

    return (
        <>
            <Header tag={HeaderTags.H1}>{t["games-registeredGames"]}</Header>
            <Divider mt mb />
            <div class={classes.addBox}>
                <Dropdown
                    class={classes.dropdown}
                    value={selectedDetectable()}
                    onChange={(v) => {
                        if (v === "refresh") {
                            refreshDetectables();
                            setSelectedDetectable("");
                        } else {
                            setSelectedDetectable(v);
                        }
                    }}
                    options={[
                        ...(processList()?.map((p) => ({ label: p[1], value: p[1] })) ?? []),
                        { label: t["games-refreshList"], value: "refresh" },
                    ]}
                />
                <Button
                    size={ButtonSizes.MEDIUM}
                    onClick={addNewGame}
                    disabled={!selectedDetectable() || selectedDetectable() === "refresh"}
                >
                    {t["games-add"]}
                </Button>
            </div>
            <Show
                when={(detectables()?.length ?? 0) > 0}
                fallback={
                    <Header tag={HeaderTags.H5} class={classes.empty}>
                        {t["games-empty"]}
                    </Header>
                }
            >
                <For each={detectables()}>
                    {(detectable) => <DetectableCard detectable={detectable} onRemove={refreshDetectables} />}
                </For>
            </Show>
        </>
    );
}
