import fitz

pdf_path = r"C:\Users\amjai\Desktop\MAD PBL report.pdf"
doc = fitz.open(pdf_path)

print(f"Total pages: {len(doc)}")

for page_num in range(min(10, len(doc))):
    page = doc[page_num]
    print(f"\n--- Page {page_num + 1} ---")
    blocks = page.get_text("dict")["blocks"]
    for b in blocks:
        if "lines" in b:
            for l in b["lines"]:
                for s in l["spans"]:
                    text = s["text"].strip()
                    if text and ("[" in text or "PROJECT" in text or "Student" in text or "Department" in text or "ABSTRACT" in text):
                        print(f"  Text: {text!r} | Font: {s['font']} | Size: {s['size']} | Flags: {s['flags']} | Origin: {s['origin']}")
doc.close()
