<script>
    import CloseIcon from "$lib/svg_icons/close.svelte";
    export let inputValue = "";
</script>

<label
    class="flex items-center justify-between bg-main-green-200 w-full h-full rounded-md p-2 cursor-pointer"
    for="input"
>
    <input
        id="input"
        bind:value={inputValue}
        class="outline-none text-main-green-950"
        type="text"
        placeholder="Ingresa el mod que quieras agregar"
    />

    <button
        on:click={() => {
            input.value = "";
        }}
    >
        <CloseIcon color="#042a23" size={"32px"} />
    </button>
</label>
