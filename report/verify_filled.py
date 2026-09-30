import pymupdf as fitz
import re

pdf_path = r"C:\Users\amjai\Desktop\MAD PBL report_FILLED.pdf"
doc = fitz.open(pdf_path)

print(f"Total Pages: {len(doc)}")
unfilled = []

for i, page in enumerate(doc):
    text = page.get_text()
    matches = re.findall(r'\[[A-Za-z0-9\s\.\,\–\-\/\:\_\?]+\]', text)
    # Filter out acceptable citations like [1], [2], [3]
    real_matches = [m for m in matches if not re.match(r'^\[\d+\]$', m) and m not in ['[Online]', '[Page]', '[Month, Year]']]
    if real_matches:
        unfilled.append((i + 1, real_matches))

if unfilled:
    print(f"Found {len(unfilled)} pages with potential placeholders:")
    for page_num, m in unfilled:
        print(f"  Page {page_num}: {m}")
else:
    print("ALL PLACEHOLDERS HAVE BEEN SUCCESSFULLY FILLED AND REPLACED!")

doc.close()
