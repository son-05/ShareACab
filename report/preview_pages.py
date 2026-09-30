import pymupdf as fitz

pdf_path = r"C:\Users\amjai\Desktop\MAD PBL report_FILLED.pdf"
doc = fitz.open(pdf_path)

print(f"Total pages in filled PDF: {len(doc)}")

# Render key pages to check visually
pages_to_check = [1, 5, 7, 9, 21, 22, 25, 26, 30, 35]

for pno in pages_to_check:
    page = doc[pno - 1]
    pix = page.get_pixmap(dpi=150)
    out_img = f"page_{pno}_preview.png"
    pix.save(out_img)
    print(f"Rendered Page {pno} to {out_img} ({pix.width}x{pix.height})")

doc.close()
