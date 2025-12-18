<script>
    import Button from "$lib/components/files/button.svelte";
    import ListIcon from "$lib/svg_icons/list.svelte";
    import DownloadIcon from "$lib/svg_icons/download.svelte";
    import SearchIcon from "$lib/svg_icons/search.svelte";
    import Footer from "$lib/components/ui/footer.svelte";
</script>

<svelte:head>
    <title>Inicio - Mod Downloader</title>
    <link rel="icon" type="image/svg+xml" href="/favicon-home.svg" />
</svelte:head>

<main
    class="select-none flex flex-col items-center justify-center w-full h-screen bg-linear-to-b from-main-green-200 to-main-green-300"
>
    <nav class="flex flex-col items-center justify-center w-full h-1/4">
        <h1 class="text-4xl font-bold text-main-green-950">Bryan.js's Mod Downloader</h1>
        <p class="text-2xl text-main-green-900">
            Descarga mods de Minecraft de forma sencilla y rápida
        </p>
    </nav>

    <div
        class="bg-main-green-800 h-[2px] w-[90%] shadow-[0_4px_12px_-2px] shadow-main-green-900 z-10"
    ></div>

    <section class="flex items-center justify-around w-full h-full">
        <a
            class="p-2 flex flex-col items-center justify-center w-[192px] aspect-square relative"
            href="/list"
        >
            <border-b-l
                class="absolute bottom-0 left-0 w-1/4 h-1/4 border-l-8 border-b-8"
            ></border-b-l>
            <border-t-l
                class="absolute top-0 left-0 w-1/4 h-1/4 border-l-8 border-t-8"
            ></border-t-l>
            <border-r-l
                class="absolute top-0 right-0 w-1/4 h-1/4 border-r-8 border-t-8"
            ></border-r-l>
            <border-b-r
                class="absolute bottom-0 right-0 w-1/4 h-1/4 border-r-8 border-b-8"
            ></border-b-r>
            <ListIcon color="#0a725a " />
            <h1 class="text-main-green-800 text-2xl">Listar</h1>
        </a>
        <a
            class="p-2 flex flex-col items-center justify-center w-[192px] aspect-square relative"
            href="/download"
        >
            <border-b-l
                class="absolute bottom-0 left-0 w-1/4 h-1/4 border-l-8 border-b-8"
            ></border-b-l>
            <border-t-l
                class="absolute top-0 left-0 w-1/4 h-1/4 border-l-8 border-t-8"
            ></border-t-l>
            <border-r-l
                class="absolute top-0 right-0 w-1/4 h-1/4 border-r-8 border-t-8"
            ></border-r-l>
            <border-b-r
                class="absolute bottom-0 right-0 w-1/4 h-1/4 border-r-8 border-b-8"
            ></border-b-r>
            <DownloadIcon color="#0a725a " />
            <h1 class="text-main-green-800 text-2xl">Descargar</h1>
        </a>
        <a
            class="p-2 flex flex-col items-center justify-center w-[192px] aspect-square relative"
            href="/search"
        >
            <border-b-l
                class="absolute bottom-0 left-0 w-1/4 h-1/4 border-l-8 border-b-8"
            ></border-b-l>
            <border-t-l
                class="absolute top-0 left-0 w-1/4 h-1/4 border-l-8 border-t-8"
            ></border-t-l>
            <border-r-l
                class="absolute top-0 right-0 w-1/4 h-1/4 border-r-8 border-t-8"
            ></border-r-l>
            <border-b-r
                class="absolute bottom-0 right-0 w-1/4 h-1/4 border-r-8 border-b-8"
            ></border-b-r>
            <SearchIcon color="#0a725a " />
            <h1 class="text-main-green-800 text-2xl">Buscar</h1>
        </a>
    </section>

    <div
        class="bg-main-green-900 h-[2px] w-[90%] shadow-[0_4px_12px_-2px] shadow-main-green-900 z-10"
    ></div>

    <div class="w-full h-1/6">
        <Footer />
    </div>
</main>

<style>
    section a {
        cursor: pointer;
        transition: all 0.3s ease-in-out;
    }
    section a:hover {
        transform: scale(1.1);
    }
    section a:nth-child(2):hover {
        transform: scale(1.25);
    }

    a:hover * {
        border-color: #0c8f6d;
        transition: all 0.35s ease-in-out;
    }
    a:not(:hover) * {
        border-color: #0a725a;
        transition: all 0.35s ease-in-out;
    }
</style>
