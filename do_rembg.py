import sys
import subprocess

def run_rembg(input_path, output_path):
    print(f"Running rembg on {input_path}...")
    try:
        subprocess.run([sys.executable, "-m", "rembg", "i", input_path, output_path], check=True)
        print(f"Saved to {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

if __name__ == "__main__":
    # We will process the MAGENTA background images we generated earlier, 
    # since solid backgrounds make it trivially easy for AI background removers to get a perfect edge.
    files = [
        (r"C:\Users\qc\.gemini\antigravity\brain\ec8ffb35-797a-4026-85b7-2f23d828cf11\bitmoji_idle_magenta_1783673359734.png", r"e:\Portfolio\public\avatars\bitmoji-idle.png"),
        (r"C:\Users\qc\.gemini\antigravity\brain\ec8ffb35-797a-4026-85b7-2f23d828cf11\bitmoji_typing_magenta_1783673367715.png", r"e:\Portfolio\public\avatars\bitmoji-typing.png"),
        (r"C:\Users\qc\.gemini\antigravity\brain\ec8ffb35-797a-4026-85b7-2f23d828cf11\bitmoji_face_magenta_1783673376113.png", r"e:\Portfolio\public\avatars\bitmoji-face.png")
    ]
    for in_f, out_f in files:
        run_rembg(in_f, out_f)
