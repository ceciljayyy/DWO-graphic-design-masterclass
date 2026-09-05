<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $status ?? 404 }} · {{ $title ?? 'Page not found' }} — DWO</title>
    <style>
        :root { color-scheme: dark; }
        body { margin:0; font-family: Arial, Helvetica, sans-serif; background:#0b0b0c; color:#f5f5f5; }
        .wrap { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:32px 20px; }
        .card { max-width:520px; text-align:center; }
        .brand { letter-spacing:.2em; color:#e8ff47; font-size:13px; font-weight:700; text-transform:uppercase; }
        h1 { font-size:42px; margin:16px 0 12px; line-height:1.15; }
        p { color:#a1a1aa; line-height:1.6; margin:0 0 28px; }
        .actions { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
        a.btn { display:inline-block; text-decoration:none; border-radius:999px; padding:12px 18px; font-size:14px; font-weight:700; }
        a.primary { background:#e8ff47; color:#111; }
        a.secondary { border:1px solid #3f3f46; color:#f5f5f5; }
    </style>
</head>
<body>
<div class="wrap">
    <div class="card">
        <div class="brand">DWO · {{ $status ?? 404 }}</div>
        <h1>{{ $title ?? 'Page not found' }}</h1>
        <p>{{ $message ?? 'This link may be expired, mistyped, or no longer available.' }}</p>
        <div class="actions">
            <a class="btn primary" href="/">Back to home</a>
            <a class="btn secondary" href="/register">Register</a>
        </div>
    </div>
</div>
</body>
</html>
