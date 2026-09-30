with open('build_filled_pbl_report.py', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('"ti-b"', '"times-bold"').replace('"ti-r"', '"times-roman"')

with open('build_filled_pbl_report.py', 'w', encoding='utf-8') as f:
    f.write(c)

print("build_filled_pbl_report.py fonts fixed!")
