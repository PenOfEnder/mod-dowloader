<script>
    import Navbar from "$lib/components/ui/navbar.svelte";
    import Footer from "$lib/components/ui/footer.svelte";
    import GenericModal from "$lib/components/ui/generic_modal.svelte";
    import LoadingModal from "$lib/components/ui/loading_modal.svelte";

    import ArrowLeftIcon from "$lib/svg_icons/arrow_left.svelte";
    import ArrowRightIcon from "$lib/svg_icons/arrow_right.svelte";
    import ArrowBarIcon from "$lib/svg_icons/arrow_bar.svelte";

    import ModList from "$lib/components/files/mods_list.svelte";

    import { modListStore } from "$utils/mods.svelte.js";

    import FabricIcon from "$lib/svg_icons/fabric.svelte";
    import ForgeIcon from "$lib/svg_icons/forge.svelte";
    import QuiltIcon from "$lib/svg_icons/quilt.svelte";
    import NeoForgeIcon from "$lib/svg_icons/neoforge.svelte";

    let loadingModalOpen = false;
    let loadingModalMessage = "Descargando mods...";

    // Estado del modal genérico
    let modalOpen = false;
    let modalConfig = {
        title: "",
        message: "",
        type: "info",
        onConfirm: () => {},
    };

    const loaders = {
        fabric: false,
        forge: false,
        quilt: false,
        neoforge: false,
    };

    function showErrorModal(message) {
        modalConfig = {
            title: "Error",
            message: message,
            type: "error",
            onConfirm: () => {},
        };
        modalOpen = true;
    }

    function showSuccessModal(message) {
        modalConfig = {
            title: "Éxito",
            message: message,
            type: "success",
            onConfirm: () => {},
        };
        modalOpen = true;
    }

    function downloadAllMods() {
        // Validar que haya al menos un loader seleccionado
        if (
            !(
                loaders.fabric ||
                loaders.forge ||
                loaders.quilt ||
                loaders.neoforge
            )
        ) {
            showErrorModal(
                "Por favor selecciona al menos un loader antes de descargar.",
            );
            return;
        }

        // Validar que haya mods en la lista
        if (modListStore.mods.length === 0) {
            showErrorModal(
                "No hay mods en la lista para descargar. Por favor agrega mods primero.",
            );
            return;
        }

        let files = [];

        const modsStore = modListStore.mods;
        modsStore.forEach((mod) => {
            Object.entries(loaders).forEach(([key, value]) => {
                if (value && mod.loaders[key]) {
                    files.push({
                        loader: key,
                        url: mod.loaders[key].url,
                        name: mod.loaders[key].filename,
                    });
                }
            });
        });

        // Validar que se encontraron archivos para descargar
        if (files.length === 0) {
            showErrorModal(
                "No se encontraron archivos para descargar con los loaders seleccionados. Verifica que los mods tengan versiones disponibles para los loaders elegidos.",
            );
            return;
        }

        getZip(files);
    }

    function downloadSingleMod(modIndex) {
        // Validar que haya al menos un loader seleccionado
        if (
            !(
                loaders.fabric ||
                loaders.forge ||
                loaders.quilt ||
                loaders.neoforge
            )
        ) {
            showErrorModal(
                "Por favor selecciona al menos un loader antes de descargar.",
            );
            return;
        }

        const currentMod = modListStore.mods[modIndex];
        let files = [];

        Object.entries(loaders).forEach(([key, value]) => {
            if (value && currentMod.loaders[key]) {
                files.push({
                    loader: key,
                    url: currentMod.loaders[key].url,
                    name: currentMod.loaders[key].filename,
                });
            }
        });

        // Validar que se encontraron archivos para descargar
        if (files.length === 0) {
            showErrorModal(
                `El mod "${currentMod.name}" no tiene versiones disponibles para los loaders seleccionados.`,
            );
            return;
        }

        getZip(files);
    }

    async function getZip(files) {
        if (files.length === 0) return;

        loadingModalOpen = true;
        loadingModalMessage = `Descargando ${files.length} archivo${files.length > 1 ? "s" : ""}...`;

        try {
            const api_url = "/utils/svelte/download-zip";
            const response = await fetch(api_url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mod_list: files }),
            });

            if (!response.ok) {
                throw new Error("Error al descargar del servidor");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "ModPack.zip";

            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
            a.remove();

            loadingModalOpen = false;
            showSuccessModal("¡Descarga completada exitosamente!");
        } catch (error) {
            loadingModalOpen = false;
            console.error("Error al descargar:", error);
            showErrorModal(
                "Ocurrió un error al descargar los mods. Por favor intenta nuevamente.",
            );
        }
    }
</script>

<svelte:head>
    <title>Descargar Mods - Mod Downloader</title>
    <link rel="icon" type="image/svg+xml" href="/favicon-download.svg" />
</svelte:head>

<main
    class="flex flex-col items-center justify-center w-full h-screen bg-linear-to-r from-main-green-700 to-main-green-900"
>
    <Navbar tailwind_size="h-1/6">
        <h1 class="text-4xl font-bold text-main-green-300">Descargar mods</h1>
        <h2 class="text-2xl font-bold text-main-green-200">
            En esta parte puedes descargar tus mods listados
        </h2>
    </Navbar>

    <section
        class="w-8/10 flex-1 min-h-0 flex flex-col items-center justify-center"
    >
        <bside class="w-full flex-1 min-h-0 overflow-y-hidden pt-4 relative">
            <ModList>
                <li
                    class="sticky top-0 select-none w-full h-min text-xl flex items-center justify-between p-2 gap-4 text-main-green-900
                    backdrop-blur-lg backdrop-brightness-90
                    "
                >
                    <span
                        class="w-1/10 text-center bg-main-green-50 rounded-md p-2"
                        >#</span
                    >
                    <span
                        class="w-4/10 text-left bg-main-green-50 rounded-md p-2"
                        >Nombre del mod</span
                    >
                    <p
                        class="w-4/10 flex items-center justify-around gap-2 p-2"
                    >
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <span
                            class="icon-checkbox flex flex-col flex-1 justify-center items-center gap-2 p-2 rounded-md cursor-pointer transition-all duration-300 ease-in-out {loaders.fabric
                                ? 'bg-main-green-700'
                                : 'bg-transparent'}"
                            on:click={() => (loaders.fabric = !loaders.fabric)}
                        >
                            <FabricIcon size="32px" color="#edfcf6" />
                            <input
                                class="hidden"
                                type="checkbox"
                                id="fabric"
                                bind:checked={loaders.fabric}
                            />
                        </span>
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <span
                            class="icon-checkbox h-full flex flex-col flex-1 justify-center items-center gap-2 p-2 rounded-md cursor-pointer transition-all duration-300 ease-in-out {loaders.forge
                                ? 'bg-main-green-700'
                                : 'bg-transparent'}"
                            on:click={() => (loaders.forge = !loaders.forge)}
                        >
                            <ForgeIcon size="32px" color="#edfcf6" />
                            <input
                                class="hidden"
                                type="checkbox"
                                id="forge"
                                bind:checked={loaders.forge}
                            />
                        </span>
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <span
                            class="icon-checkbox h-full flex flex-col flex-1 justify-center items-center gap-2 p-2 rounded-md cursor-pointer transition-all duration-300 ease-in-out {loaders.quilt
                                ? 'bg-main-green-700'
                                : 'bg-transparent'}"
                            on:click={() => (loaders.quilt = !loaders.quilt)}
                        >
                            <QuiltIcon size="32px" color="#edfcf6" />
                            <input
                                class="hidden"
                                type="checkbox"
                                id="quilt"
                                bind:checked={loaders.quilt}
                            />
                        </span>
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <span
                            class="icon-checkbox h-full flex flex-col flex-1 justify-center items-center gap-2 p-2 rounded-md cursor-pointer transition-all duration-300 ease-in-out {loaders.neoforge
                                ? 'bg-main-green-700'
                                : 'bg-transparent'}"
                            on:click={() =>
                                (loaders.neoforge = !loaders.neoforge)}
                        >
                            <NeoForgeIcon size="32px" color="#edfcf6" />
                            <input
                                class="hidden"
                                type="checkbox"
                                id="neoforge"
                                bind:checked={loaders.neoforge}
                            />
                        </span>
                    </p>
                    <span
                        class="w-1/10 bg-main-green-500 text-center text-main-green-900 rounded-md p-2"
                        >Descargar</span
                    >
                </li>

                {#each modListStore.mods as mod, index}
                    <li
                        class="select-none w-full h-min text-xl flex items-center justify-between p-2 gap-4 text-main-green-900
                    "
                    >
                        <span
                            class="w-1/10 text-center bg-main-green-100 rounded-md p-2"
                            >{index + 1}</span
                        >
                        <span
                            class="w-8/10 text-left bg-main-green-100 rounded-md p-2"
                            >{mod.name}</span
                        >
                        <button
                            class="w-1/10 bg-main-green-500 flex justify-center items-center text-main-green-900 rounded-md p-2"
                            on:click={() => downloadSingleMod(index)}
                        >
                            <ArrowBarIcon size="32" color="#094b3c " />
                        </button>
                    </li>
                {/each}
            </ModList>
        </bside>

        <cside class="w-full h-min p-2">
            <section class="w-full flex items-center justify-between">
                <a
                    class=" h-full flex items-center justify-center gap-4"
                    href="/search"
                >
                    <ArrowLeftIcon size={32} color="#74e0b8 " />
                    <h1 class="text-xl font-bold text-main-green-300">
                        Ir a buscar
                    </h1>
                </a>
                <button
                    class=" h-full flex items-center justify-center gap-4 p-2 bg-main-green-200 hover:backdrop-blur-lg"
                    on:click={downloadAllMods}
                >
                    <h1 class="text-2xl font-bold text-main-green-600">
                        Descargar todos
                    </h1>
                </button>
                <a
                    class=" h-full flex items-center justify-center gap-4"
                    href="/"
                >
                    <h1 class="text-xl font-bold text-main-green-300">
                        Ir al inicio
                    </h1>
                    <ArrowRightIcon size={32} color="#74e0b8" />
                </a>
            </section>
        </cside>
    </section>

    <div class="w-full py-2">
        <Footer color="text-cyan-200 text-xl" />
    </div>
</main>

<GenericModal
    bind:isOpen={modalOpen}
    title={modalConfig.title}
    message={modalConfig.message}
    type={modalConfig.type}
    onConfirm={modalConfig.onConfirm}
    onCancel={() => {}}
    confirmText={modalConfig.confirmText}
    cancelText={modalConfig.cancelText}
    showCancelButton={modalConfig.showCancelButton}
/>

<LoadingModal bind:isOpen={loadingModalOpen} message={loadingModalMessage} />

<style>
    cside a,
    cside button {
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        padding: 0.5rem;
        border-radius: 0.5rem;
    }
    cside a:hover {
        transform: scale(1.1);
        background-color: #00000009;
    }

    cside button:hover {
        transform: scale(1.5);
    }

    .icon-checkbox:hover {
        transform: scale(1.05);
    }

    .icon-checkbox:active {
        transform: scale(0.95);
    }
</style>
