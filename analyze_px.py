import sys
from PIL import Image

def analyze_pixel(path):
    img = Image.open(path).convert("RGBA")
    r, g, b, a = img.getpixel((0, 0))
    print(f"Top left pixel of {path}: R:{r} G:{g} B:{b} A:{a}")

analyze_pixel(r"C:\Users\qc\.gemini\antigravity\brain\ec8ffb35-797a-4026-85b7-2f23d828cf11\bitmoji_idle_magenta_1783673359734.png")
