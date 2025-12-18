<script>
    export let isOpen = false;
    export let message = "Cargando...";
</script>

{#if isOpen}
    <section
        class="modal-backdrop w-full h-full fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-busy="true"
        tabindex="-1"
    >
        <div
            class="modal-content w-11/12 md:w-2/5 lg:w-1/3 min-h-fit bg-main-green-50 border-2 border-main-green-300 rounded-lg shadow-2xl p-8 flex flex-col gap-6 items-center justify-center"
            role="document"
        >
            <!-- Spinner de carga -->
            <div class="spinner"></div>

            <!-- Mensaje de carga -->
            <p class="text-xl font-semibold text-main-green-900 text-center">
                {message}
            </p>
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

    /* Spinner animado */
    .spinner {
        width: 60px;
        height: 60px;
        border: 6px solid #d3f8e7;
        border-top: 6px solid #094b3c;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
