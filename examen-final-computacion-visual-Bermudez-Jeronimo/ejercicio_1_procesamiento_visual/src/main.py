from __future__ import annotations

import argparse
import colorsys
import math
import struct
import zlib
from collections import deque
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
RESULTS_DIR = ROOT_DIR / "resultados"
WIDTH = 480
HEIGHT = 360

Color = tuple[int, int, int]
RgbImage = list[list[Color]]
GrayImage = list[list[int]]


def clamp(value: float, low: int = 0, high: int = 255) -> int:
    return max(low, min(high, int(round(value))))


def new_rgb(width: int, height: int, color: Color = (0, 0, 0)) -> RgbImage:
    return [[color for _ in range(width)] for _ in range(height)]


def set_pixel(image: RgbImage, x: int, y: int, color: Color) -> None:
    if 0 <= x < WIDTH and 0 <= y < HEIGHT:
        image[y][x] = color


def draw_rect(image: RgbImage, x0: int, y0: int, x1: int, y1: int, color: Color) -> None:
    left = max(0, min(x0, x1))
    right = min(WIDTH - 1, max(x0, x1))
    top = max(0, min(y0, y1))
    bottom = min(HEIGHT - 1, max(y0, y1))
    for y in range(top, bottom + 1):
        row = image[y]
        for x in range(left, right + 1):
            row[x] = color


def draw_line(image: RgbImage, x0: int, y0: int, x1: int, y1: int, color: Color, thickness: int = 1) -> None:
    dx = abs(x1 - x0)
    dy = -abs(y1 - y0)
    sx = 1 if x0 < x1 else -1
    sy = 1 if y0 < y1 else -1
    err = dx + dy

    while True:
        for offset_y in range(-thickness // 2, thickness // 2 + 1):
            for offset_x in range(-thickness // 2, thickness // 2 + 1):
                set_pixel(image, x0 + offset_x, y0 + offset_y, color)

        if x0 == x1 and y0 == y1:
            break

        twice_err = 2 * err
        if twice_err >= dy:
            err += dy
            x0 += sx
        if twice_err <= dx:
            err += dx
            y0 += sy


def fill_circle(image: RgbImage, cx: int, cy: int, radius: int, color: Color) -> None:
    radius_sq = radius * radius
    for y in range(max(0, cy - radius), min(HEIGHT - 1, cy + radius) + 1):
        dy = y - cy
        row = image[y]
        for x in range(max(0, cx - radius), min(WIDTH - 1, cx + radius) + 1):
            dx = x - cx
            if dx * dx + dy * dy <= radius_sq:
                row[x] = color


def create_demo_rgb() -> RgbImage:
    image = new_rgb(WIDTH, HEIGHT, (28, 28, 38))
    draw_rect(image, 40, 70, 150, 205, (235, 195, 90))
    fill_circle(image, 250, 125, 48, (80, 180, 240))
    fill_circle(image, 360, 175, 62, (110, 230, 140))
    draw_rect(image, 70, 235, 170, 320, (200, 110, 230))
    draw_line(image, 240, 255, 430, 310, (240, 240, 240), thickness=5)
    draw_line(image, 35, 20, 435, 20, (80, 120, 220), thickness=3)
    return image


def load_rgb_frame(_input_path: str | None) -> tuple[RgbImage, str]:
    return create_demo_rgb(), "demo"


def rgb_to_gray(rgb: RgbImage) -> GrayImage:
    gray: GrayImage = []
    for row in rgb:
        gray_row = []
        for red, green, blue in row:
            gray_row.append(clamp(0.299 * red + 0.587 * green + 0.114 * blue))
        gray.append(gray_row)
    return gray


def rgb_to_hsv_panels(rgb: RgbImage) -> RgbImage:
    channels_h: GrayImage = []
    channels_s: GrayImage = []
    channels_v: GrayImage = []

    for row in rgb:
        h_row: list[int] = []
        s_row: list[int] = []
        v_row: list[int] = []
        for red, green, blue in row:
            hue, saturation, value = colorsys.rgb_to_hsv(red / 255.0, green / 255.0, blue / 255.0)
            h_row.append(clamp(hue * 255))
            s_row.append(clamp(saturation * 255))
            v_row.append(clamp(value * 255))
        channels_h.append(h_row)
        channels_s.append(s_row)
        channels_v.append(v_row)

    panel_width = WIDTH
    panels = new_rgb(panel_width * 3, HEIGHT, (0, 0, 0))
    for y in range(HEIGHT):
        for x in range(WIDTH):
            h_value = channels_h[y][x]
            s_value = channels_s[y][x]
            v_value = channels_v[y][x]
            panels[y][x] = (h_value, h_value, h_value)
            panels[y][x + panel_width] = (s_value, s_value, s_value)
            panels[y][x + panel_width * 2] = (v_value, v_value, v_value)
    return panels


def pad_gray(gray: GrayImage, pad: int) -> GrayImage:
    width = len(gray[0])
    height = len(gray)
    padded = [[0 for _ in range(width + pad * 2)] for _ in range(height + pad * 2)]
    for y in range(height + pad * 2):
        source_y = min(max(y - pad, 0), height - 1)
        for x in range(width + pad * 2):
            source_x = min(max(x - pad, 0), width - 1)
            padded[y][x] = gray[source_y][source_x]
    return padded


def gaussian_blur_gray(gray: GrayImage) -> GrayImage:
    kernel = [1, 4, 6, 4, 1]
    kernel_sum = 16
    padded = pad_gray(gray, 2)
    width = len(gray[0])
    height = len(gray)

    temp = [[0.0 for _ in range(width)] for _ in range(height)]
    for y in range(height):
        for x in range(width):
            total = 0.0
            for offset in range(5):
                total += kernel[offset] * padded[y + 2][x + offset]
            temp[y][x] = total / kernel_sum

    padded_temp = [[0.0 for _ in range(width + 4)] for _ in range(height + 4)]
    for y in range(height):
        for x in range(width):
            padded_temp[y + 2][x + 2] = temp[y][x]

    blurred: GrayImage = []
    for y in range(height):
        row = []
        for x in range(width):
            total = 0.0
            for offset in range(5):
                total += kernel[offset] * padded_temp[y + offset][x + 2]
            row.append(clamp(total / kernel_sum))
        blurred.append(row)
    return blurred


def gray_to_rgb(gray: GrayImage) -> RgbImage:
    return [[(value, value, value) for value in row] for row in gray]


def sobel_edges(gray: GrayImage) -> GrayImage:
    padded = pad_gray(gray, 1)
    width = len(gray[0])
    height = len(gray)
    gx_kernel = ((-1, 0, 1), (-2, 0, 2), (-1, 0, 1))
    gy_kernel = ((1, 2, 1), (0, 0, 0), (-1, -2, -1))
    magnitude: GrayImage = []
    max_value = 0.0

    for y in range(height):
        row = []
        for x in range(width):
            gx = 0.0
            gy = 0.0
            for ky in range(3):
                for kx in range(3):
                    pixel = padded[y + ky][x + kx]
                    gx += pixel * gx_kernel[ky][kx]
                    gy += pixel * gy_kernel[ky][kx]
            value = math.sqrt(gx * gx + gy * gy)
            if value > max_value:
                max_value = value
            row.append(value)
        magnitude.append(row)

    if max_value == 0:
        return [[0 for _ in row] for row in magnitude]

    return [[clamp(value / max_value * 255) for value in row] for row in magnitude]


def otsu_threshold(gray: GrayImage) -> int:
    histogram = [0] * 256
    total = len(gray) * len(gray[0])
    sum_total = 0
    for row in gray:
        for value in row:
            histogram[value] += 1
            sum_total += value

    sum_background = 0.0
    weight_background = 0.0
    best_variance = -1.0
    threshold = 0

    for level in range(256):
        weight_background += histogram[level]
        if weight_background == 0:
            continue

        weight_foreground = total - weight_background
        if weight_foreground == 0:
            break

        sum_background += level * histogram[level]
        mean_background = sum_background / weight_background
        mean_foreground = (sum_total - sum_background) / weight_foreground
        variance = weight_background * weight_foreground * (mean_background - mean_foreground) ** 2

        if variance > best_variance:
            best_variance = variance
            threshold = level

    return threshold


def binary_erode(mask: list[list[int]], iterations: int = 1) -> list[list[int]]:
    result = [row[:] for row in mask]
    height = len(mask)
    width = len(mask[0])
    for _ in range(iterations):
        next_mask = [[0 for _ in range(width)] for _ in range(height)]
        for y in range(height):
            for x in range(width):
                ok = True
                for ny in range(max(0, y - 1), min(height, y + 2)):
                    for nx in range(max(0, x - 1), min(width, x + 2)):
                        if result[ny][nx] == 0:
                            ok = False
                            break
                    if not ok:
                        break
                next_mask[y][x] = 255 if ok else 0
        result = next_mask
    return result


def binary_dilate(mask: list[list[int]], iterations: int = 1) -> list[list[int]]:
    result = [row[:] for row in mask]
    height = len(mask)
    width = len(mask[0])
    for _ in range(iterations):
        next_mask = [[0 for _ in range(width)] for _ in range(height)]
        for y in range(height):
            for x in range(width):
                on = False
                for ny in range(max(0, y - 1), min(height, y + 2)):
                    for nx in range(max(0, x - 1), min(width, x + 2)):
                        if result[ny][nx] > 0:
                            on = True
                            break
                    if on:
                        break
                next_mask[y][x] = 255 if on else 0
        result = next_mask
    return result


def connected_components(mask: list[list[int]]) -> list[dict[str, object]]:
    height = len(mask)
    width = len(mask[0])
    visited = [[False for _ in range(width)] for _ in range(height)]
    components: list[dict[str, object]] = []

    for y in range(height):
        for x in range(width):
            if mask[y][x] == 0 or visited[y][x]:
                continue

            queue = deque([(y, x)])
            visited[y][x] = True
            area = 0
            min_x = max_x = x
            min_y = max_y = y

            while queue:
                cy, cx = queue.popleft()
                area += 1
                min_x = min(min_x, cx)
                max_x = max(max_x, cx)
                min_y = min(min_y, cy)
                max_y = max(max_y, cy)

                for ny in range(max(0, cy - 1), min(height, cy + 2)):
                    for nx in range(max(0, cx - 1), min(width, cx + 2)):
                        if mask[ny][nx] > 0 and not visited[ny][nx]:
                            visited[ny][nx] = True
                            queue.append((ny, nx))

            components.append({"area": area, "bbox": (min_x, min_y, max_x, max_y)})

    components.sort(key=lambda component: component["area"], reverse=True)
    return components


def segment_and_annotate(rgb: RgbImage, gray: GrayImage) -> RgbImage:
    threshold = otsu_threshold(gray)
    binary = [[255 if value >= threshold else 0 for value in row] for row in gray]
    binary = binary_dilate(binary, iterations=1)
    binary = binary_erode(binary, iterations=1)
    binary = binary_erode(binary, iterations=1)
    binary = binary_dilate(binary, iterations=2)

    components = [component for component in connected_components(binary) if component["area"] >= 600]
    overlay = [[pixel for pixel in row] for row in rgb]
    mask_color = new_rgb(WIDTH, HEIGHT, (0, 0, 0))
    palette: list[Color] = [(64, 160, 255), (92, 230, 148), (236, 102, 141), (255, 196, 88)]

    for index, component in enumerate(components, start=1):
        min_x, min_y, max_x, max_y = component["bbox"]  # type: ignore[assignment]
        color = palette[(index - 1) % len(palette)]

        for y in range(min_y, max_y + 1):
            for x in range(min_x, max_x + 1):
                if binary[y][x] > 0:
                    mask_color[y][x] = color
                    overlay[y][x] = color

        for x in range(min_x, max_x + 1):
            set_pixel(overlay, x, min_y, color)
            set_pixel(overlay, x, max_y, color)
        for y in range(min_y, max_y + 1):
            set_pixel(overlay, min_x, y, color)
            set_pixel(overlay, max_x, y, color)

    combined: RgbImage = []
    for y in range(HEIGHT):
        row = []
        for x in range(WIDTH):
            base = overlay[y][x]
            accent = mask_color[y][x]
            row.append(
                (
                    clamp(base[0] * 0.8 + accent[0] * 0.2),
                    clamp(base[1] * 0.8 + accent[1] * 0.2),
                    clamp(base[2] * 0.8 + accent[2] * 0.2),
                )
            )
        combined.append(row)
    return combined


def write_png(path: Path, image: RgbImage) -> None:
    height = len(image)
    width = len(image[0])
    raw = bytearray()
    for row in image:
        raw.append(0)
        for red, green, blue in row:
            raw.extend(bytes((red, green, blue)))

    compressed = zlib.compress(bytes(raw), level=9)

    def chunk(tag: bytes, data: bytes) -> bytes:
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

    png = bytearray(b"\x89PNG\r\n\x1a\n")
    png.extend(chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)))
    png.extend(chunk(b"IDAT", compressed))
    png.extend(chunk(b"IEND", b""))
    path.write_bytes(bytes(png))


def main() -> None:
    parser = argparse.ArgumentParser(description="Procesamiento visual e IA")
    parser.add_argument("--input", type=str, default=None, help="Ruta a una imagen o video corto de entrada")
    args = parser.parse_args()

    RESULTS_DIR.mkdir(parents=True, exist_ok=True)

    frame_rgb, _source_type = load_rgb_frame(args.input)
    gray = rgb_to_gray(frame_rgb)
    smooth = gaussian_blur_gray(gray)
    edges = sobel_edges(smooth)
    hsv_panels = rgb_to_hsv_panels(frame_rgb)
    segmentation = segment_and_annotate(frame_rgb, gray)

    write_png(RESULTS_DIR / "original.png", frame_rgb)
    write_png(RESULTS_DIR / "grises.png", gray_to_rgb(gray))
    write_png(RESULTS_DIR / "hsv_o_lab.png", hsv_panels)
    write_png(RESULTS_DIR / "suavizado.png", gray_to_rgb(smooth))
    write_png(RESULTS_DIR / "bordes.png", gray_to_rgb(edges))
    write_png(RESULTS_DIR / "deteccion_o_segmentacion.png", segmentation)

    print(f"Resultados guardados en: {RESULTS_DIR}")


if __name__ == "__main__":
    main()
