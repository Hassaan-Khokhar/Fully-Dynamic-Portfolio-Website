import sys
from PIL import Image

def remove_magenta(input_path, output_path):
    print(f"Processing {input_path}...")
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()
        new_data = []
        for item in datas:
            # Check for magenta: High R, Low G, High B
            r, g, b, a = item
            if r > 150 and g < 100 and b > 150:
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
        (r"C:\Users\qc\.gemini\antigravity\brain\ec8ffb35-797a-4026-85b7-2f23d828cf11\bitmoji_idle_magenta_1783673359734.png", r"e:\Portfolio\public\avatars\bitmoji-idle.png"),
        (r"C:\Users\qc\.gemini\antigravity\brain\ec8ffb35-797a-4026-85b7-2f23d828cf11\bitmoji_typing_magenta_1783673367715.png", r"e:\Portfolio\public\avatars\bitmoji-typing.png"),
        (r"C:\Users\qc\.gemini\antigravity\brain\ec8ffb35-797a-4026-85b7-2f23d828cf11\bitmoji_face_magenta_1783673376113.png", r"e:\Portfolio\public\avatars\bitmoji-face.png")
    ]
    for in_f, out_f in files:
        remove_magenta(in_f, out_f)
