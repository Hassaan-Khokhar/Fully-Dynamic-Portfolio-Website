import sys
from PIL import Image

def analyze_checkerboard(path):
    img = Image.open(path).convert("RGBA")
    
    # Sample a few pixels from the top-left area to find the two checkerboard colors
    colors = set()
    for y in range(100):
        for x in range(100):
            r, g, b, a = img.getpixel((x, y))
            # Quantize slightly to reduce noise
            colors.add((r//10*10, g//10*10, b//10*10))
            
    print(f"Colors found in top-left 100x100 of {path}: {colors}")

analyze_checkerboard(r"C:\Users\qc\.gemini\antigravity\brain\ec8ffb35-797a-4026-85b7-2f23d828cf11\bitmoji_idle_1783670999663.png")
