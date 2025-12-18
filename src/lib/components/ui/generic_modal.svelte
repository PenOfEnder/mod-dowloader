<script>
    export let isOpen = false;
    export let title = "";
    export let message = "";
    export let type = "info";

    // Callbacks para las acciones
    export let onConfirm = () => {};
    export let onCancel = () => {};

    // Textos personalizables de los botones
    export let confirmText = "Confirmar";
    export let cancelText = "Cancelar";
    export let showCancelButton = true;

    // Clases dinámicas basadas en el tipo
    $: containerClasses = getContainerClasses(type);
    $: buttonClasses = getButtonClasses(type);

    function getContainerClasses(type) {
        const baseClasses = "rounded-lg shadow-2xl";
        switch (type) {
            case "info":
                return `${baseClasses} bg-blue-50 border-2 border-blue-300`;
            case "warning":
                return `${baseClasses} bg-yellow-50 border-2 border-yellow-400`;
            case "error":
                return `${baseClasses} bg-red-50 border-2 border-red-400`;
            case "success":
                return `${baseClasses} bg-green-50 border-2 border-green-400`;
            default:
                return `${baseClasses} bg-gray-50 border-2 border-gray-300`;
        }
    }

    function getButtonClasses(type) {
        switch (type) {
            case "info":
                return "bg-blue-500 hover:bg-blue-600";
            case "warning":
                return "bg-yellow-500 hover:bg-yellow-600";
            case "error":
                return "bg-red-500 hover:bg-red-600";
            case "success":
                return "bg-green-500 hover:bg-green-600";
            default:
                return "bg-gray-500 hover:bg-gray-600";
        }
    }

    function getTitleClasses(type) {
        switch (type) {
            case "info":
                return "text-blue-800";
            case "warning":
                return "text-yellow-800";
            case "error":
                return "text-red-800";
            case "success":
                return "text-green-800";
            default:
                return "text-gray-800";
        }
    }

    function close() {
        isOpen = false;
    }

    function handleConfirm() {
        onConfirm();
        close();
    }

    function handleCancel() {
        onCancel();
        close();
    }

    import CloseIcon from "$lib/svg_icons/close.svelte";
</script>

{#if isOpen}
    <section
        class="modal-backdrop w-full h-full fixed inset-0 z-50 flex items-center justify-center"
        on:click={handleCancel}
        on:keydown={(e) => e.key === "Escape" && handleCancel()}
        role="dialog"
        aria-modal="true"
        tabindex="-1"
    >
        <div
            class="modal-content w-11/12 md:w-2/5 lg:w-1/3 min-h-fit {containerClasses} p-6 relative flex flex-col gap-4"
            on:click|stopPropagation
            on:keydown|stopPropagation
            role="document"
        >
            <!-- Botón de cerrar -->
            <button
                class="absolute top-2 right-2 hover:scale-110 transition-transform"
                on:click={handleCancel}
                aria-label="Cerrar"
            >
                <CloseIcon size="32" color="#042a23" />
            </button>

            <!-- Título -->
            <h1 class="text-2xl font-bold pr-10 {getTitleClasses(type)}">
                {title}
            </h1>

            <!-- Contenido del mensaje o slot personalizado -->
            <div class="flex-1 text-gray-700 text-lg">
                {#if message}
                    <p>{message}</p>
                {:else}
                    <slot />
                {/if}
            </div>

            <!-- Botones de acción -->
            <div class="flex items-center justify-end gap-4 mt-4">
                {#if showCancelButton}
                    <button
                        class="px-6 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold transition-colors"
                        on:click={handleCancel}
                    >
                        {cancelText}
                    </button>
                {/if}
                <button
                    class="px-6 py-2 rounded-md {buttonClasses} text-white font-semibold transition-colors"
                    on:click={handleConfirm}
                >
                    {confirmText}
                </button>
            </div>
        </div>
    </section>
{/if}

<style>
    /* Animación del backdrop - aparece primero */
    .modal-backdrop {
        animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    /* Animación del contenido del modal - se desliza de arriba hacia abajo con delay */
    .modal-content {
        animation: slideDown 0.4s ease-out 0.2s backwards;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-100px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
