<?php

declare(strict_types=1);

$root = dirname(__DIR__);
$srcPath = $root.'/public/brand/dwo-logo-white.png';
$src = imagecreatefrompng($srcPath);

if ($src === false) {
    fwrite(STDERR, "Failed to load {$srcPath}\n");
    exit(1);
}

$w = imagesx($src);
$h = imagesy($src);

$out = imagecreatetruecolor($w, $h);
imagealphablending($out, false);
imagesavealpha($out, true);

for ($y = 0; $y < $h; $y++) {
    for ($x = 0; $x < $w; $x++) {
        $rgba = imagecolorat($src, $x, $y);
        $r = ($rgba >> 16) & 0xFF;
        $g = ($rgba >> 8) & 0xFF;
        $b = $rgba & 0xFF;
        $lum = (0.299 * $r) + (0.587 * $g) + (0.114 * $b);

        // Near-black → fully transparent; brighter → white with matching opacity
        if ($lum < 18) {
            $pixel = 0x7F000000; // fully transparent
        } else {
            $alpha = (int) max(0, min(127, (int) round(127 - (($lum / 255) * 127))));
            $pixel = ($alpha << 24) | 0x00FFFFFF;
        }

        imagesetpixel($out, $x, $y, $pixel);
    }
}

imagepng($out, $root.'/public/brand/dwo-logo-transparent.png');

// Monogram crop (exclude tagline under the mark)
$cropH = (int) round($h * 0.70);
$mark = imagecreatetruecolor($w, $cropH);
imagealphablending($mark, false);
imagesavealpha($mark, true);
imagecopy($mark, $out, 0, 0, 0, 0, $w, $cropH);
imagepng($mark, $root.'/public/brand/dwo-mark-transparent.png');

function make_square_png($srcImg, int $size, string $path): void
{
    $sw = imagesx($srcImg);
    $sh = imagesy($srcImg);
    $dst = imagecreatetruecolor($size, $size);
    imagealphablending($dst, false);
    imagesavealpha($dst, true);

    for ($y = 0; $y < $size; $y++) {
        for ($x = 0; $x < $size; $x++) {
            imagesetpixel($dst, $x, $y, 0x7F000000);
        }
    }

    $pad = (int) round($size * 0.1);
    $box = $size - ($pad * 2);
    $scale = min($box / $sw, $box / $sh);
    $nw = max(1, (int) round($sw * $scale));
    $nh = max(1, (int) round($sh * $scale));
    $dx = (int) floor(($size - $nw) / 2);
    $dy = (int) floor(($size - $nh) / 2);

    imagecopyresampled($dst, $srcImg, $dx, $dy, 0, 0, $nw, $nh, $sw, $sh);
    imagepng($dst, $path);
    imagedestroy($dst);
}

make_square_png($mark, 16, $root.'/public/favicon-16x16.png');
make_square_png($mark, 32, $root.'/public/favicon-32x32.png');
make_square_png($mark, 48, $root.'/public/favicon-48x48.png');
make_square_png($mark, 180, $root.'/public/apple-touch-icon.png');
make_square_png($mark, 192, $root.'/public/brand/dwo-favicon-192.png');
make_square_png($mark, 512, $root.'/public/brand/dwo-favicon-512.png');
copy($root.'/public/favicon-32x32.png', $root.'/public/favicon.png');
copy($root.'/public/favicon-32x32.png', $root.'/public/favicon.ico');

echo "OK transparent logo {$w}x{$h}\n";
