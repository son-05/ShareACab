import fitz

pdf_path = r"C:\Users\amjai\Desktop\MAD PBL report.pdf"
doc = fitz.open(pdf_path)

for page_num in range(10, len(doc)):
    page = doc[page_num]
    text_list = []
    blocks = page.get_text("dict")["blocks"]
    for b in blocks:
        if "lines" in b:
            for l in b["lines"]:
                for s in l["spans"]:
                    t = s["text"].strip()
                    if t and ("[" in t or "Write content" in t or "Insert" in t or "CHAPTER" in t):
                        text_list.append((t, s["font"], s["size"], s["origin"]))
    if text_list:
        print(f"\n--- Page {page_num + 1} ---")
        for item in text_list:
            print(f"  {item[0]} | {item[1]} | {item[2]} | {item[3]}")
doc.close()
