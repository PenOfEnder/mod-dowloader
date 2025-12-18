<script>
    const version = __APP_VERSION__;
    export let color = "text-cyan-900 text-xl";
</script>

<footer class="flex flex-col items-center justify-center gap-4 w-full h-full">
    <div class="w-full flex items-center justify-center gap-8">
        <h1 class={color}>Designed by Bryan.js </h1>
        <h2 class={color}> Version {version}</h2>
    </div>
    <h3 class="w-full text-center {color}">Copyright © {new Date().getFullYear()} Bryan.js. All rights reserved.</h3>
</footer>