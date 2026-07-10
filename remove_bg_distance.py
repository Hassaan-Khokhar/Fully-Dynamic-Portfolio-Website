import sys
import math
from PIL import Image

def remove_bg(input_path, output_path):
    print(f"Processing {input_path}...")
    try:
        img = Image.open(input_path).convert("RGBA")
        width, height = img.size
        
        # Get background color from top-left pixel
        bg_r, bg_g, bg_b, _ = img.getpixel((0, 0))
        
        datas = img.getdata()
        new_data = []
        
        # Color distance threshold
        threshold = 60
        
        for item in datas:
            r, g, b, a = item
            # Calculate euclidean distance
            dist = math.sqrt((r - bg_r)**2 + (g - bg_g)**2 + (b - bg_b)**2)
            
            if dist < threshold:
                # Completely transparent
                new_data.append((255, 255, 255, 0))
            elif dist < threshold + 40:
                # Anti-aliasing / soft edge
                # Map distance from (threshold) to (threshold + 40) to alpha (0 to 255)
                alpha = int(((dist - threshold) / 40) * 255)
                new_data.append((r, g, b, alpha))
            else:
                new_data.append(item)
                
        img.putdata(new_data)
        img.save(output_path, "PNG")
        print(f"Saved to {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

if __name__ == "__main__":
    files = [
        (r"C:\Users\qc\.gemini\antigravity\brain\ec8ffb35-797a-4026-85b7-2f23d828cf11\bitmoji_idle_magenta_1783673359734.png", r"e:\Portfolio\public\avatars\bitmoji-idle-v2.png"),
        (r"C:\Users\qc\.gemini\antigravity\brain\ec8ffb35-797a-4026-85b7-2f23d828cf11\bitmoji_typing_magenta_1783673367715.png", r"e:\Portfolio\public\avatars\bitmoji-typing-v2.png"),
        (r"C:\Users\qc\.gemini\antigravity\brain\ec8ffb35-797a-4026-85b7-2f23d828cf11\bitmoji_face_magenta_1783673376113.png", r"e:\Portfolio\public\avatars\bitmoji-face-v2.png")
    ]
    for in_f, out_f in files:
        remove_bg(in_f, out_f)
