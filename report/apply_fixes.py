with open('build_filled_pbl_report.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Fix Page 5: [2026–2027]
old_p5 = """for r in p5.search_for("[date]"):"""
new_p5 = """for r in p5.search_for("2026"):
    p5.add_redact_annot(fitz.Rect(r.x0-20, r.y0-2, r.x1+50, r.y1+2), fill=(1,1,1))
p5.apply_redactions()
p5.insert_text(fitz.Point(362, 236), "2026–2027", fontname="times-bold", fontsize=11)

for r in p5.search_for("[date]"):"""

code = code.replace(old_p5, new_p5)

# Fix Page 6: Faculty Name
old_p6 = """for r in p6.search_for("[Faculty Name]"):
    p6.add_redact_annot(r, fill=(1,1,1))
p6.apply_redactions()
p6.insert_text(fitz.Point(298, 162), "Dr. [Faculty Mentor Name]", fontname="times-bold", fontsize=12)"""

new_p6 = """for r in p6.search_for("Faculty"):
    p6.add_redact_annot(fitz.Rect(r.x0-15, r.y0-2, r.x1+40, r.y1+2), fill=(1,1,1))
p6.apply_redactions()
p6.insert_text(fitz.Point(298, 162), "Faculty Mentor", fontname="times-bold", fontsize=12)"""

code = code.replace(old_p6, new_p6)

# Fix Page 7: [No. of weeks
old_p7 = """redact_and_replace_text(p7, "[No. of weeks, e.g. Week 1  Week 12]", "12 Weeks (Week 1 – Week 12)", fontname="times-roman", fontsize=11)"""
new_p7 = """for r in p7.search_for("No. of weeks"):
    p7.add_redact_annot(fitz.Rect(r.x0-10, r.y0-2, 540, r.y1+2), fill=(1,1,1))
p7.apply_redactions()
p7.insert_text(fitz.Point(214, 228), "12 Weeks (Week 1 – Week 12)", fontname="times-roman", fontsize=11)"""

code = code.replace(old_p7, new_p7)

# Fix Page 8: HOD Name
old_p8 = """for r in p8.search_for("[HOD Name], Head of the Department,"):
    p8.add_redact_annot(r, fill=(1,1,1))
p8.apply_redactions()
p8.insert_text(fitz.Point(72, 264), "Dr. [HOD Name], Head of the Department,", fontname="times-bold", fontsize=12)"""

new_p8 = """for r in p8.search_for("Head of the Department"):
    p8.add_redact_annot(fitz.Rect(r.x0-120, r.y0-2, r.x1+20, r.y1+2), fill=(1,1,1))
p8.apply_redactions()
p8.insert_text(fitz.Point(72, 264), "The Head of the Department,", fontname="times-bold", fontsize=12)"""

code = code.replace(old_p8, new_p8)

# Fix Page 22: Insert Table 2.3
old_p22 = """clear_and_fill_box(p22, "[Write content for Review of Existing Technologies here.]","""
new_p22 = """for r in p22.search_for("Insert Table 2.3"):
    p22.add_redact_annot(fitz.Rect(r.x0-10, r.y0-4, 540, r.y1+4), fill=(1,1,1))
p22.apply_redactions()

clear_and_fill_box(p22, "[Write content for Review of Existing Technologies here.]","""

code = code.replace(old_p22, new_p22)

with open('build_filled_pbl_report.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied 5 fixes to build_filled_pbl_report.py")
