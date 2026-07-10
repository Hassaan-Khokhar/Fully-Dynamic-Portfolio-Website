import sys
from PIL import Image

def remove_green(input_path, output_path):
    print(f"Processing {input_path}...")
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()
        new_data = []
        for item in datas:
            # Check for pure green or very bright green
            # r < 100, g > 150, b < 100 is a good threshold for neon green screen
            r, g, b, a = item
            if g > 150 and r < max(100, g * 0.6) and b < max(100, g * 0.6):
                new_data.append((255, 255, 255, 0)) # transparent
            else:
                new_data.append(item)
        
        img.putdata(new_data)
        img.save(output_path, "PNG")
        print(f"Saved to {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

if __name__ == "__main__":
    files = [
        (r"C:\Users\qc\.gemini\antigravity\brain\ec8ffb35-797a-4026-85b7-2f23d828cf11\bitmoji_idle_green_1783672886188.png", r"e:\Portfolio\public\avatars\bitmoji-idle.png"),
        (r"C:\Users\qc\.gemini\antigravity\brain\ec8ffb35-797a-4026-85b7-2f23d828cf11\bitmoji_typing_green_1783672893954.png", r"e:\Portfolio\public\avatars\bitmoji-typing.png"),
        (r"C:\Users\qc\.gemini\antigravity\brain\ec8ffb35-797a-4026-85b7-2f23d828cf11\bitmoji_face_green_1783672901732.png", r"e:\Portfolio\public\avatars\bitmoji-face.png")
    ]
    for in_f, out_f in files:
        remove_green(in_f, out_f)
