<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
        <meta name="color-scheme" content="dark light">
        <meta name="theme-color" content="#0b0b0c">

        <title inertia>{{ config('app.name', 'DWO Masterclass') }}</title>
        <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('brand/dwo-logo-white.png') }}">
<link rel="icon" type="image/png" sizes="16x16" href="{{ asset('brand/dwo-logo-white.png') }}">
<link rel="apple-touch-icon" href="{{ asset('brand/dwo-logo-white.png') }}">
        <script>
            (function () {
                try {
                    var stored = localStorage.getItem('dwo.theme');
                    var theme = stored === 'light' || stored === 'dark'
                        ? stored
                        : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
                    document.documentElement.classList.toggle('dark', theme === 'dark');
                    document.documentElement.style.colorScheme = theme;
                    var meta = document.querySelector('meta[name="theme-color"]');
                    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0b0b0c' : '#f4f4f5');
                } catch (e) {
                    document.documentElement.classList.add('dark');
                }
            })();
        </script>
      

        <!-- Fonts: display (Bebas) + UI (Figtree) -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=bebas-neue:400|figtree:400,500,600,700&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
