import sys
from PIL import Image

def remove_checkerboard(input_path, output_path):
    print(f"Processing {input_path}...")
    try:
        img = Image.open(input_path).convert("RGBA")
        width, height = img.size
        pixels = img.load()
        
        visited = set()
        # The checkerboard touches the borders. We can start from (0,0), (width-1, 0), etc.
        queue = [(0, 0)]
        
        # We need a robust threshold. The checkerboard is white (255,255,255) and gray (~210,210,210).
        # We can just say any pixel with R > 190, G > 190, B > 190 is considered background IF connected to 0,0.
        
        while queue:
            x, y = queue.pop(0)
            if (x, y) in visited:
                continue
                
            visited.add((x, y))
            r, g, b, a = pixels[x, y]
            
            if r > 180 and g > 180 and b > 180:
                # Part of background! Make transparent.
                pixels[x, y] = (255, 255, 255, 0)
                
                # Add neighbors
                for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < width and 0 <= ny < height:
                        if (nx, ny) not in visited:
                            queue.append((nx, ny))
                            
        # Since it might miss disconnected patches (e.g. between hair strands if closed off),
        # let's just do a second pass replacing ANY pixel that is purely gray/white.
        # But wait, the eyes are white! So BFS is the only safe way.
        # Let's add multiple start points around the border to ensure we get everything.
        for border_x in range(width):
            queue.extend([(border_x, 0), (border_x, height-1)])
        for border_y in range(height):
            queue.extend([(0, border_y), (width-1, border_y)])
            
        visited_border = set(visited) # keep old visited to avoid infinite loops, but queue is now populated
        while queue:
            x, y = queue.pop(0)
            if (x, y) in visited_border:
                continue
            visited_border.add((x, y))
            r, g, b, a = pixels[x, y]
            if r > 180 and g > 180 and b > 180 and a > 0:
                pixels[x, y] = (255, 255, 255, 0)
                for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < width and 0 <= ny < height:
                        if (nx, ny) not in visited_border:
                            queue.append((nx, ny))

        img.save(output_path, "PNG")
        print(f"Saved to {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

if __name__ == "__main__":
    files = [
        (r"C:\Users\qc\.gemini\antigravity\brain\ec8ffb35-797a-4026-85b7-2f23d828cf11\bitmoji_idle_1783670999663.png", r"e:\Portfolio\public\avatars\bitmoji-idle-v3.png"),
        (r"C:\Users\qc\.gemini\antigravity\brain\ec8ffb35-797a-4026-85b7-2f23d828cf11\bitmoji_typing_1783671009251.png", r"e:\Portfolio\public\avatars\bitmoji-typing-v3.png"),
        (r"C:\Users\qc\.gemini\antigravity\brain\ec8ffb35-797a-4026-85b7-2f23d828cf11\bitmoji_face_1783671016169.png", r"e:\Portfolio\public\avatars\bitmoji-face-v3.png")
    ]
    for in_f, out_f in files:
        remove_checkerboard(in_f, out_f)
