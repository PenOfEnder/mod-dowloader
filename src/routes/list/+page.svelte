<script>
    import mod_template from "$utils/mod_template.js";

    let mods = [];

    let modName = "";

    function addMod() {
        if (!modName) return;

        const already = mods.some((m) => m.name === modName);
        if (already) return;

        let modTemplate = structuredClone(mod_template);
        modTemplate["name"] = modName;
        mods.push(modTemplate);
        mods = mods;
        modName = "";
    }

    function deleteModFromIndex(index) {
        mods.splice(index, 1);
        mods = mods;
    }

    function exportModsInJSON() {
        if (mods == "") return;

        const listOfMods = JSON.stringify(mods, null, 4);

        const blobFile = new Blob([listOfMods], { type: "application/json" });

        const url = URL.createObjectURL(blobFile);

        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "mods";

        anchor.click();
        URL.revokeObjectURL();
    }

    function importModsInJSON(event) {
        const uploadedFile = event.target.files[0];
        if (!uploadedFile) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            const content = e.target.result;
            try {
                const data = JSON.parse(content);

                mods = [...mods, ...data];
            } catch (error) {
                alert("Archivo corrupto o invalido");
            }
        };

        reader.readAsText(uploadedFile);
    }

    let selectedFile = null;
    let result = null;
    let loading = false;
    let errorMsg = "";

    // Función auxiliar para convertir buffer a Hexadecimal
    function bufferToHex(buffer) {
        return Array.from(new Uint8Array(buffer))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    }

    // Aceptamos el evento 'e' opcionalmente para limpiar el input
    async function handleIdentify(e) {
        if (!selectedFile) return;

        loading = true;
        errorMsg = "";
        result = null;

        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest("SHA-1", arrayBuffer);
            const sha1Hash = bufferToHex(hashBuffer);

            const response = await fetch("/utils/svelte/identify-mod", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ hash: sha1Hash }),
            });

            const jsonResponse = await response.json();

            if (!response.ok)
                throw new Error(jsonResponse.error || "Error del servidor");

            if (jsonResponse.found) {
                result = jsonResponse.data;

                // Verificar si ya existe antes de agregar (opcional pero recomendado)
                const exists = mods.some(
                    (m) => m.project_id === result.project_id,
                );

                if (!exists) {
                    let modTemplate = structuredClone(mod_template);
                    modTemplate.name = result.mod_name;
                    modTemplate.project_id = result.project_id;

                    mods.push(modTemplate);
                    mods = mods; // Trigger reactividad de Svelte
                } else {
                    alert("Este mod ya está en la lista");
                }
            } else {
                errorMsg =
                    "El mod no fue encontrado en la base de datos de Modrinth.";
            }
        } catch (e) {
            console.error(e);
            errorMsg = "Ocurrió un error al procesar el archivo.";
        } finally {
            loading = false;

            // --- LIMPIEZA DEL BUFFER (IMPORTANTE) ---
            selectedFile = null; // Borramos la variable en memoria
            if (e && e.target) {
                e.target.value = ""; // Reseteamos el input HTML para permitir seleccionar el mismo archivo de nuevo si fuera necesario
            }
        }
    }

    import Navbar from "$lib/components/ui/navbar.svelte";
    import Footer from "$lib/components/ui/footer.svelte";
    import Input from "$lib/components/files/input.svelte";

    import ModsList from "$lib/components/files/mods_list.svelte";

    import TrashIcon from "$lib/svg_icons/trash.svelte";
    import FileIcon from "$lib/svg_icons/file.svelte";
    import ExportIcon from "$lib/svg_icons/export.svelte";
    import ArrowLeftIcon from "$lib/svg_icons/arrow_left.svelte";
    import ArrowRightIcon from "$lib/svg_icons/arrow_right.svelte";
    import { json } from "@sveltejs/kit";
</script>

<main
    class="flex flex-col items-center justify-center w-full h-screen bg-linear-to-r from-main-green-300 to-main-green-500"
>
    <Navbar tailwind_size="h-1/6">
        <h1 class="text-4xl font-bold text-main-green-800">Listar mods</h1>
        <h2 class="text-2xl font-bold text-main-green-700">
            En esta parte puedes enlistar, exportar e importar tus mods
        </h2>
    </Navbar>

    <section class="w-8/10 h-full flex flex-col items-center justify-center">
        <aside
            class="w-full flex items-center justify-between text-2xl p-2 gap-4"
        >
            <Input bind:inputValue={modName} />
            <input
                id="file-jar"
                class="hidden"
                type="file"
                accept=".jar"
                on:change={(e) => {
                    selectedFile = e.target.files[0];
                    handleIdentify(e); // Pasamos el evento para poder limpiar el input después
                }}
            />

            <label
                for="file-jar"
                class="bg-main-green-600 text-main-green-100 h-full rounded-md p-2 cursor-pointer disabled:bg-main-green-400"
                disabled={loading}
            >
                <span>{loading ? "Analizando..." : "Identificar JAR"}</span>
            </label>
            <input
                class="bg-main-green-800 text-main-green-200 h-full aspect-square rounded-md p-2 cursor-pointer"
                type="button"
                value="+"
                on:click={addMod}
            />
        </aside>
        <bside class="w-full h-full pt-4">
            <ModsList>
                <li
                    class="select-none w-full h-min text-xl flex items-center justify-between p-2 gap-4 text-main-green-900"
                >
                    <span
                        class="w-1/10 text-center bg-main-green-50 rounded-md p-2"
                        >#</span
                    >
                    <span
                        class="w-8/10 text-center bg-main-green-50 rounded-md p-2"
                        >Nombre del mod</span
                    >
                    <span
                        class="w-1/10 bg-red-400 text-center text-main-green-950 rounded-md p-2"
                        >Eliminar</span
                    >
                </li>

                {#each mods as mod, index}
                    <li
                        class="w-full h-min text-lg flex items-center justify-between p-2 gap-4 selection:text-main-green-200 text-main-green-950 selection:bg-cyan-700"
                    >
                        <span
                            class="w-1/10 text-center bg-main-green-100 rounded-md p-2"
                            >{index + 1}</span
                        >
                        <span
                            class="w-8/10 text-center bg-main-green-100 select-all rounded-md p-2"
                            >{mod.name}</span
                        >
                        <button
                            class="w-1/10 bg-main-green-100 flex items-center justify-center rounded-md p-2 cursor-pointer"
                            on:click={() => deleteModFromIndex(index)}
                        >
                            <TrashIcon
                                size={32}
                                color="oklch(70.4% 0.191 22.216)"
                            />
                        </button>
                    </li>
                {/each}
            </ModsList>
        </bside>

        <cside class="w-full p-2">
            <section class="w-full flex items-center justify-between">
                <a
                    class=" h-full flex items-center justify-center gap-4"
                    href="/"
                >
                    <ArrowLeftIcon size={32} color="#094b3c" />
                    <h1 class="text-xl font-bold text-main-green-900">
                        Regresar
                    </h1>
                </a>
                <button
                    class=" h-full flex items-center justify-center gap-4 cursor-pointer"
                    on:click={() => exportModsInJSON()}
                >
                    <ExportIcon size={32} color="#094b3c" />
                    <h1 class="text-xl font-bold text-main-green-900">
                        Exportar lista
                    </h1>
                </button>
                <label
                    class=" h-full flex items-center justify-center gap-4 cursor-pointer"
                    for="importList"
                >
                    <FileIcon size={32} color="#094b3c" />
                    <input
                        class="hidden"
                        type="file"
                        accept=".json"
                        on:change={importModsInJSON}
                        id="importList"
                    />
                    <h1 class="text-xl font-bold text-main-green-900">
                        Importar lista
                    </h1>
                </label>
                <a
                    class=" h-full flex items-center justify-center gap-4"
                    href="/search"
                >
                    <h1 class="text-xl font-bold text-main-green-900">
                        Ir a buscar
                    </h1>
                    <ArrowRightIcon size={32} color="#094b3c" />
                </a>
            </section>
        </cside>
    </section>

    <div class="w-full h-1/6">
        <Footer />
    </div>
</main>

<style>
    cside a,
    button {
        cursor: pointer;
        transition: all 0.3s ease-in-out;
    }
    cside a:hover,
    button:hover {
        transform: scale(1.1);
    }
</style>
