import pymupdf as fitz
import re

input_pdf = r"C:\Users\amjai\Desktop\MAD PBL report.pdf"
output_pdf = r"C:\Users\amjai\Desktop\MAD PBL report_FILLED.pdf"

doc = fitz.open(input_pdf)

def redact_and_replace(page, target_text, replacement_text, fontname="times", fontsize=11, align=0, text_color=(0, 0, 0), box_height_mult=1.0, is_bold=False):
    rects = page.search_for(target_text)
    if not rects:
        # Try search without brackets if not found
        clean_target = target_text.strip("[]")
        rects = page.search_for(clean_target)
    
    if rects:
        for r in rects:
            # Expand rectangle if replacement is multiline
            r_expanded = fitz.Rect(r.x0, r.y0, 540, r.y1 + (box_height_mult - 1.0) * (r.y1 - r.y0 + 15))
            page.add_redact_annot(r, fill=(1, 1, 1))
        page.apply_redactions()
        
        # Insert text
        # If multiline or box, use insert_textbox
        r_box = fitz.Rect(rects[0].x0, rects[0].y0 - 2, 540, rects[0].y0 + max(25, 14 * box_height_mult))
        font_key = "ti-b" if is_bold else "ti-r"
        page.insert_textbox(
            r_box,
            replacement_text,
            fontsize=fontsize,
            fontname=font_key,
            color=text_color,
            align=align
        )
        return True
    return False

print("Processing pages...")
doc.close()
