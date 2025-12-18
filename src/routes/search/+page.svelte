<script>
    import Navbar from "$lib/components/ui/navbar.svelte";
    import Footer from "$lib/components/ui/footer.svelte";
    import GenericModal from "$lib/components/ui/generic_modal.svelte";
    import LoadingModal from "$lib/components/ui/loading_modal.svelte";

    import FabricIcon from "$lib/svg_icons/fabric.svelte";
    import ForgeIcon from "$lib/svg_icons/forge.svelte";
    import QuiltIcon from "$lib/svg_icons/quilt.svelte";
    import NeoForgeIcon from "$lib/svg_icons/neoforge.svelte";

    import DownloadIcon from "$lib/svg_icons/download.svelte";
    import ArrowLeftIcon from "$lib/svg_icons/arrow_left.svelte";
    import ArrowRightIcon from "$lib/svg_icons/arrow_right.svelte";
    import SaveIcon from "$lib/svg_icons/save.svelte";

    import ModList from "$lib/components/files/mods_list.svelte";

    import ArrowBarIcon from "$lib/svg_icons/arrow_bar.svelte";

    import { modListStore } from "$utils/mods.svelte.js";
    import mod_template from "$utils/mod_template.js";

    let loadingModalOpen = false;
    let loadingModalMessage = "Cargando...";

    const loaders = {
        fabric: false,
        forge: false,
        quilt: false,
        neoforge: false,
    };

    let gameVersion = "";

    /**
     * Busca y actualiza la información de un mod específico
     * @param {object} modObject - El objeto del mod a buscar
     * @param {number} index - Índice del mod en la lista
     * @param {number} total - Total de mods en la lista
     * @param {array} loadersArray - Array de loaders seleccionados
     * @param {string} gameVersion - Versión del juego
     * @param {object} headers - Headers para las peticiones HTTP
     * @param {string} MODRINTH_URL - URL base de la API de Modrinth
     * @returns {Promise<object>} El objeto del mod actualizado
     */
    async function searchAndUpdateMod(
        modObject,
        index,
        total,
        loadersArray,
        gameVersion,
        headers,
        MODRINTH_URL,
    ) {
        const modName = modObject.name;
        console.log(`\n[${index + 1}/${total}] Buscando: "${modName}"`);

        try {
            // PASO 1: Buscar el proyecto en Modrinth
            const searchParams = new URLSearchParams({
                query: modName,
                limit: 1,
            });

            const searchResponse = await fetch(
                `${MODRINTH_URL}/search?${searchParams}`,
                { headers },
            );

            if (!searchResponse.ok) {
                throw new Error(`HTTP ${searchResponse.status}`);
            }

            const searchData = await searchResponse.json();

            if (!searchData.hits || searchData.hits.length === 0) {
                console.log(`❌ "${modName}": No se encontró en Modrinth`);
                return modObject;
            }

            const project = searchData.hits[0];
            console.log(
                `✓ Proyecto encontrado: ${project.slug} (${project.project_id})`,
            );

            // PASO 2: Obtener versiones disponibles para los loaders y versión del juego
            const versionParams = new URLSearchParams({
                loaders: JSON.stringify(loadersArray),
                game_versions: JSON.stringify([gameVersion]),
            });

            const versionsResponse = await fetch(
                `${MODRINTH_URL}/project/${project.project_id}/version?${versionParams}`,
                { headers },
            );

            if (!versionsResponse.ok) {
                throw new Error(`HTTP ${versionsResponse.status}`);
            }

            const versions = await versionsResponse.json();

            if (!versions || versions.length === 0) {
                console.log(`⚠️ "${modName}": Sin versiones compatibles`);
                return modObject;
            }

            // PASO 3: Seleccionar la última versión de cada loader
            const foundLoaders = {};

            for (const version of versions) {
                for (const loader of version.loaders) {
                    if (
                        loadersArray.includes(loader) &&
                        !foundLoaders[loader]
                    ) {
                        foundLoaders[loader] = {
                            filename: version.name,
                            version_number: version.version_number,
                            url: version.files[0].url,
                            loader: loader,
                        };
                    }
                }

                // Optimización: si ya encontramos todos, salir
                if (Object.keys(foundLoaders).length >= loadersArray.length) {
                    break;
                }
            }

            // PASO 4: Actualizar el objeto del mod
            if (Object.keys(foundLoaders).length > 0) {
                modObject.project_id = project.project_id;

                // Mezclamos los loaders encontrados
                for (const loaderKey in foundLoaders) {
                    modObject.loaders[loaderKey] = foundLoaders[loaderKey];
                }

                console.log(
                    `✅ "${modName}": Versiones encontradas para [${Object.keys(foundLoaders).join(", ")}]`,
                );
            } else {
                console.log(
                    `⚠️ "${modName}": No hay versiones para los loaders solicitados`,
                );
            }

            return modObject;
        } catch (error) {
            console.error(`❌ Error al buscar "${modName}":`, error);

            return modObject;
        }
    }

    async function findMods(params) {
        // Validar que haya mods en la lista
        if (!(modListStore.mods.length > 0)) {
            modalConfig = {
                title: "Error",
                message: "No hay mods en la lista para buscar.",
                type: "error",
                onConfirm: () => {},
            };
            modalOpen = true;
            return;
        }

        // Preparar array de loaders
        const loadersArray = [];
        if (loaders.fabric) loadersArray.push("fabric");
        if (loaders.forge) loadersArray.push("forge");
        if (loaders.quilt) loadersArray.push("quilt");
        if (loaders.neoforge) loadersArray.push("neoforge");

        // Validar que haya al menos un loader seleccionado
        if (loadersArray.length === 0) {
            modalConfig = {
                title: "Error",
                message:
                    "Debes seleccionar al menos un loader antes de buscar.",
                type: "error",
                onConfirm: () => {},
            };
            modalOpen = true;
            return;
        }

        // Validar que haya una versión del juego seleccionada
        if (!gameVersion) {
            modalConfig = {
                title: "Error",
                message:
                    "Debes seleccionar una versión del juego antes de buscar.",
                type: "error",
                onConfirm: () => {},
            };
            modalOpen = true;
            return;
        }

        // Si todas las validaciones pasan, abrir el modal de carga
        loadingModalOpen = true;
        console.log("Mods guardados: " + JSON.stringify(modListStore.mods));

        const MODRINTH_URL = "https://api.modrinth.com/v2";
        const headers = {
            "User-Agent":
                import.meta.env.VITE_USER_AGENT ||
                "ModrinthDowloader/1.0 (contact@example.com)",
            "Content-Type": "application/json",
        };

        // Creamos una copia profunda del array de mods para trabajar sin afectar el store
        let tempMods = JSON.parse(JSON.stringify(modListStore.mods));

        console.log("🔍 Iniciando búsqueda de " + tempMods.length + " mods...");

        // Iteramos sobre cada mod en el array temporal
        for (let i = 0; i < tempMods.length; i++) {
            tempMods[i] = await searchAndUpdateMod(
                tempMods[i],
                i,
                tempMods.length,
                loadersArray,
                gameVersion,
                headers,
                MODRINTH_URL,
            );
        }

        // PASO 5: Actualizar el store completo de una sola vez
        console.log("\n📦 Actualizando store...");
        console.log("Datos temporales:", tempMods);

        modListStore.setMods(tempMods);

        console.log("✅ Store actualizado globalmente");
        console.log("Store final:", modListStore.mods);
        loadingModalOpen = false;
    }

    function importModsInJSON(event) {
        const uploadedFile = event.target.files[0];
        if (!uploadedFile) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            const content = e.target.result;
            try {
                const data = JSON.parse(content);

                modListStore.mods = [...modListStore.mods, ...data];
            } catch (error) {
                alert("Archivo corrupto o invalido");
            }
        };

        reader.readAsText(uploadedFile);

        importMessage();
    }

    function importMessage() {
        modalConfig = {
            title: "Lista importada correctamente",
            message: "",
            type: "success",
            onConfirm: () => {},
        };
        modalOpen = true;
    }

    function saveList() {
        if (modListStore.mods == "") return;

        const listOfMods = JSON.stringify(modListStore.mods, null, 4);

        const blobFile = new Blob([listOfMods], { type: "application/json" });

        const url = URL.createObjectURL(blobFile);

        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "mods";

        anchor.click();
        URL.revokeObjectURL(url);

        exportMessage();
    }

    function exportMessage() {
        modalConfig = {
            title: "Lista guardada correctamente",
            message: "",
            type: "success",
            onConfirm: () => {},
        };
        modalOpen = true;
    }

    function printModList() {
        console.log(modListStore.mods);
    }

    // Estado del modal
    let modalOpen = false;
    let modalConfig = {
        title: "",
        message: "",
        type: "info",
        onConfirm: () => {},
    };
</script>

<svelte:head>
    <title>Buscar Mods - Mod Downloader</title>
    <link rel="icon" type="image/svg+xml" href="/favicon-search.svg" />
</svelte:head>

<main
    class="flex flex-col items-center justify-center w-full h-screen bg-linear-to-r from-main-green-500 to-main-green-700"
>
    <Navbar tailwind_size="h-1/6">
        <h1 class="text-4xl font-bold text-main-green-900">Buscar mods</h1>
        <h2 class="text-2xl font-bold text-main-green-800">
            En esta parte puedes buscar mods en Modrinth
        </h2>
    </Navbar>

    <nav class="w-8/10 min-h-0 flex items-center justify-between p-2">
        <section class="w-full flex items-center justify-between">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <h1
                class="w-1/3 text-2xl font-bold text-main-green-950"
                on:click={() => printModList()}
            >
                Mod
            </h1>

            <aside class="w-1/3 flex items-center justify-between gap-4">
                <p class="w-full flex items-center justify-around gap-2 p-2">
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <span
                        class="icon-checkbox flex flex-col flex-1 justify-center items-center gap-2 p-2 rounded-md cursor-pointer transition-all duration-300 ease-in-out {loaders.fabric
                            ? 'bg-main-green-700'
                            : 'bg-transparent'}"
                        on:click={() => (loaders.fabric = !loaders.fabric)}
                    >
                        <FabricIcon size="32px" color="#042a23" />
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
                        <ForgeIcon size="32px" color="#042a23" />
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
                        <QuiltIcon size="32px" color="#042a23" />
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
                        on:click={() => (loaders.neoforge = !loaders.neoforge)}
                    >
                        <NeoForgeIcon size="32px" color="#042a23" />
                        <input
                            class="hidden"
                            type="checkbox"
                            id="neoforge"
                            bind:checked={loaders.neoforge}
                        />
                    </span>
                </p>
            </aside>

            <versionselect class="w-1/3 flex items-center justify-end gap-4">
                <h1 class="text-2xl font-bold text-main-green-950">Versión:</h1>
                <select
                    class="outline-none text-2xl font-bold text-main-green-950 bg-main-green-400 px-2 py-1 rounded"
                    name="version"
                    id="version"
                    bind:value={gameVersion}
                >
                    <option class="hidden" disabled value="">Elige</option>
                    <option
                        class="outline-none border-none rounded-0 text-main-green-900 hover:text-main-green-950 bg-main-green-400 hover:bg-main-green-500"
                        value="1.21.11">1.21.11</option
                    >
                    <option
                        class="outline-none border-none rounded-0 text-main-green-900 hover:text-main-green-950 bg-main-green-400 hover:bg-main-green-500"
                        value="1.21.10">1.21.10</option
                    >
                    <option
                        class="outline-none border-none rounded-0 text-main-green-900 hover:text-main-green-950 bg-main-green-400 hover:bg-main-green-500"
                        value="1.21.9">1.21.9</option
                    >
                    <option
                        class="outline-none border-none rounded-0 text-main-green-900 hover:text-main-green-950 bg-main-green-400 hover:bg-main-green-500"
                        value="26.1">26.1</option
                    >
                </select>

                <button
                    class="text-2xl outline-none hover:bg-main-green-950 bg-main-green-800 duration-500 ease-in-out text-main-green-300 font-bold py-1 px-2 rounded"
                    on:click={findMods}
                >
                    Buscar
                </button>
            </versionselect>
        </section>
    </nav>
    <section class="w-8/10 h-full overflow-hidden">
        <ModList>
            {#each modListStore.mods as li_mod, index}
                <li
                    class="select-none w-full h-min text-xl flex items-center justify-between p-2 gap-4 text-main-green-900"
                >
                    <div class="w-1/3 h-full gap-2 flex items-center justify-between">
                        <span
                            class="w-min h-min aspect-square bg-main-green-50 rounded-md p-2"
                            >{index + 1}</span
                        >
                        <span
                            class="w-full h-full text-center bg-main-green-50 rounded-md p-2"
                            >{li_mod.name}</span
                        >
                    </div>

                    <ul
                        class="w-full h-full flex items-center justify-around gap-2 bg-main-green-50 p-2 rounded-md"
                    >
                        <li
                            class="flex-1  flex items-center justify-start text-left"
                        >
                            {#if typeof li_mod.loaders.fabric === "object"}
                                <span
                                    class="flex items-center justify-center gap-2"
                                >
                                    <FabricIcon size="24px" color="#094b3c" />
                                    {li_mod.loaders.fabric.version_number}
                                </span>
                            {:else}
                                {li_mod.loaders.fabric}
                            {/if}
                        </li>
                        <li
                            class="flex-1  flex items-center justify-start text-left"
                        >
                            {#if typeof li_mod.loaders.forge === "object"}
                                <span
                                    class="flex items-center justify-center gap-2"
                                >
                                    <ForgeIcon size="24px" color="#094b3c" />
                                    {li_mod.loaders.forge.version_number}
                                </span>
                            {:else}
                                {li_mod.loaders.forge}
                            {/if}
                        </li>
                        <li
                            class="flex-1  flex items-center justify-start text-left"
                        >
                            {#if typeof li_mod.loaders.neoforge === "object"}
                                <span
                                    class="flex items-center justify-center gap-2"
                                >
                                    <NeoForgeIcon size="24px" color="#094b3c" />
                                    {li_mod.loaders.neoforge.version_number}
                                </span>
                            {:else}
                                {li_mod.loaders.neoforge}
                            {/if}
                        </li>
                        <li
                            class="flex-1  flex items-center justify-start text-left"
                        >
                            {#if typeof li_mod.loaders.quilt === "object"}
                                <span
                                    class="flex items-center justify-center gap-2"
                                >
                                    <QuiltIcon size="24px" color="#094b3c" />
                                    {li_mod.loaders.quilt.version_number}
                                </span>
                            {:else}
                                {li_mod.loaders.quilt}
                            {/if}
                        </li>
                    </ul>
                </li>
            {/each}
        </ModList>
    </section>

    <toolbar class="w-8/10 h-auto p-2">
        <section class="w-full flex items-center justify-between">
            <a
                class=" h-full flex items-center justify-center gap-4"
                href="/list"
            >
                <ArrowLeftIcon size={32} color="#094b3c" />
                <h1 class="text-xl font-bold text-main-green-900">Regresar</h1>
            </a>
            <label
                class=" h-full flex items-center justify-center gap-4 cursor-pointer"
                for="importList"
            >
                <DownloadIcon size={32} color="#094b3c" />
                <input
                    class="hidden"
                    type="file"
                    accept=".json"
                    on:change={importModsInJSON}
                    id="importList"
                />
                <h1 class="text-xl font-bold text-main-green-900">
                    Cargar lista
                </h1>
            </label>
            <button
                class=" h-full flex items-center justify-center gap-4 cursor-pointer"
                on:click={() => saveList()}
            >
                <SaveIcon size={32} color="#094b3c" />
                <input
                    class="hidden"
                    type="file"
                    accept=".json"
                    id="importList"
                />
                <h1 class="text-xl font-bold text-main-green-900">
                    Guardar lista
                </h1>
            </button>
            <a
                class=" h-full flex items-center justify-center gap-4"
                href="/download"
            >
                <h1 class="text-xl font-bold text-main-green-900">
                    Descargar mods
                </h1>
                <ArrowRightIcon size={32} color="#094b3c" />
            </a>
        </section>
    </toolbar>
    <div class="w-full py-2">
        <Footer color="text-cyan-100 text-xl" />
    </div>
</main>

<LoadingModal bind:isOpen={loadingModalOpen} message={loadingModalMessage} />

<GenericModal
    bind:isOpen={modalOpen}
    title={modalConfig.title}
    message={modalConfig.message}
    type={modalConfig.type}
    onConfirm={modalConfig.onConfirm}
    onCancel={() => {}}
/>

<style>
    toolbar > section button:hover,
    toolbar > section label:hover,
    toolbar > section a:hover {
        transform: scale(1.1);
        background-color: #00000009;
    }

    toolbar > section a,
    toolbar > section button,
    toolbar > section label {
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        padding: 0.5rem;
        border-radius: 0.5rem;
    }

    .icon-checkbox:hover {
        transform: scale(1.05);
    }

    .icon-checkbox:active {
        transform: scale(0.95);
    }
</style>
