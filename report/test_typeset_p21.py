import pymupdf as fitz

doc = fitz.open(r"C:\Users\amjai\Desktop\MAD PBL report.pdf")
p21 = doc[20] # Page 21

# Delete watermark
for info in p21.get_image_info(xrefs=True):
    if info['bbox'][1] > 100:
        p21.delete_image(info['xref'])

# Clear the body area (leave header y < 85 and footer y > 765)
p21.add_redact_annot(fitz.Rect(70, 85, 545, 765), fill=(1, 1, 1))
p21.apply_redactions()

# Now typeset Chapter 1 neatly
y = 100
p21.insert_text(fitz.Point(306 - fitz.get_text_length("CHAPTER 1", fontname="times-bold", fontsize=14)/2, y), "CHAPTER 1", fontname="times-bold", fontsize=14)
y += 24
p21.insert_text(fitz.Point(306 - fitz.get_text_length("INTRODUCTION", fontname="times-bold", fontsize=14)/2, y), "INTRODUCTION", fontname="times-bold", fontsize=14)
y += 35

sections = [
    ("1.1 Project Overview",
     "ShareACab is an autonomous mobile ridesharing and cab pooling platform designed to alleviate transportation shortages and high travel costs for university students commuting during semester breaks and holidays. Built using Capacitor, React (Vite), and TypeScript, the application connects students heading to shared transit terminals such as airports and railway stations, enabling them to split cab fares and coordinate pickup schedules seamlessly."),
    ("1.2 Problem Statement",
     "During holiday breaks, commercial cab aggregators face demand surges exceeding 300%, causing acute cab shortages, 2x–3x surge pricing, and driver cancellations. Students travel solo at high expense (often ₹800–₹1,200 per ride) while female students face significant safety concerns traveling alone during odd hours. Informal messaging groups lack structured seat tracking, verified identity, and fair fare distribution."),
    ("1.3 Objectives of the Project",
     "1. To develop an offline-resilient campus cab sharing application with verified student identities.\n2. To provide an enforceable 'Female-Only' safety filter for secure travel of women students.\n3. To implement dynamic fare splitting and automated UPI payment link generation.\n4. To enable real-time in-pool coordination chat with quick action chips."),
    ("1.4 Scope of the Project",
     "The application covers university campus gates, hostel residences, and major city transit terminals (airports, railway stations, ISBT bus terminals). It targets Android smartphones via Capacitor containerization and responsive web browsers.")
]

for title, content in sections:
    p21.insert_text(fitz.Point(72, y), title, fontname="times-bold", fontsize=11.5)
    y += 16
    r_text = fitz.Rect(72, y, 540, y + 150)
    res = p21.insert_textbox(r_text, content, fontname="times-roman", fontsize=10, align=3)
    # calculate used height approx
    num_lines = (len(content) // 85) + content.count('\n') + 1
    y += (num_lines * 13) + 14

doc.save(r"C:\Users\amjai\Desktop\test_p21.pdf")
doc.close()
print("Test p21 saved cleanly! Final y:", y)
