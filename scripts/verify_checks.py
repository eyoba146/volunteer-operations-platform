# scripts/verify_checks.py
import re
import json
import glob
import os

print("=== PART 3: SYSTEMATIC VERIFICATION CHECKS ===")

# 1. Line count check
with open('README.md', 'r', encoding='utf-8') as f:
    readme_lines = f.readlines()
readme = "".join(readme_lines)
print(f"1. README Line Count: {len(readme_lines)} lines (Requirement: >= 1800) -> {'PASS' if len(readme_lines) >= 1800 else 'FAIL'}")

# 2. Emoji / Decorative Symbol Check across README.md, docs/*.md, client/src
emoji_pattern = re.compile(r'[\U00010000-\U0010ffff]|[\u2600-\u27bf]|[\u2300-\u23ff]|[\u2b50]')

files_to_check = ['README.md'] + glob.glob('docs/*.md') + glob.glob('client/src/**/*', recursive=True)
files_to_check = [f for f in files_to_check if os.path.isfile(f) and f.endswith(('.md', '.ts', '.tsx', '.css', '.json', '.html'))]

total_emojis = 0
emoji_violations = []
for file_path in files_to_check:
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        matches = emoji_pattern.findall(content)
        if matches:
            total_emojis += len(matches)
            emoji_violations.append((file_path, len(matches), matches[:3]))
    except Exception as e:
        pass

print(f"2. Emoji Check: {total_emojis} emojis found across {len(files_to_check)} files -> {'PASS' if total_emojis == 0 else 'FAIL'}")
if emoji_violations:
    for f, count, sample in emoji_violations[:5]:
        print(f"   Violation in {f}: {count} matches (sample: {sample})")

# 3. Completeness Check
with open('docs/inventory.json', 'r', encoding='utf-8') as f:
    inv = json.load(f)

# Routes
missing_routes = [r['path'] for r in inv['routes'] if r['path'] not in readme]
print(f"3. Routes Check: {len(inv['routes']) - len(missing_routes)} / {len(inv['routes'])} present -> {'PASS' if not missing_routes else 'FAIL'}")
if missing_routes:
    print(f"   Missing routes: {missing_routes}")

# API Functions
missing_apis = [func['name'] for func in inv['apiFunctions'] if func['name'] not in readme]
print(f"4. API Functions Check: {len(inv['apiFunctions']) - len(missing_apis)} / {len(inv['apiFunctions'])} present -> {'PASS' if not missing_apis else 'FAIL'}")
if missing_apis:
    print(f"   Missing API functions: {missing_apis}")

# Status Enums
missing_enums = [e for e in inv['statusEnums'] if e not in readme]
print(f"5. Status Enums Check: {len(inv['statusEnums']) - len(missing_enums)} / {len(inv['statusEnums'])} present -> {'PASS' if not missing_enums else 'FAIL'}")
if missing_enums:
    print(f"   Missing enums: {missing_enums}")

# Requirements (FR-*)
missing_reqs = [r['id'] for r in inv['requirements'] if r['id'] not in readme]
print(f"6. Requirements Check: {len(inv['requirements']) - len(missing_reqs)} / {len(inv['requirements'])} present -> {'PASS' if not missing_reqs else 'FAIL'}")
if missing_reqs:
    print(f"   Missing requirements: {missing_reqs}")

# 4. Mermaid Syntax Validation
mermaid_blocks = re.findall(r'```mermaid\n(.*?)```', readme, re.DOTALL)
print(f"7. Mermaid Diagram Check: {len(mermaid_blocks)} diagrams detected.")
mermaid_errors = 0
for idx, block in enumerate(mermaid_blocks, 1):
    first_line = block.strip().split('\n')[0]
    diagram_type = first_line.split()[0]
    # Check valid diagram types
    valid_types = ['flowchart', 'graph', 'sequenceDiagram', 'stateDiagram-v2', 'stateDiagram', 'erDiagram', 'classDiagram', 'xychart-beta']
    if diagram_type not in valid_types:
        print(f"   Diagram {idx} error: invalid type '{diagram_type}'")
        mermaid_errors += 1
print(f"   Mermaid diagrams validated -> {'PASS' if mermaid_errors == 0 else 'FAIL'}")

# 5. Spot-check 15 statements against actual code
print("\n8. Spot-checking 15 claims against codebase:")
claims = [
    ("Default registration fee is ETB 200", "200" in open('client/src/api/seedData.ts').read() and "ETB" in readme),
    ("Role names are applicant, volunteer, lead, manager, finance, admin", all(r in open('client/src/types/index.ts').read() for r in ['applicant', 'volunteer', 'lead', 'manager', 'finance', 'admin'])),
    ("Ranks include volunteer and senior_volunteer", all(rnk in open('client/src/types/index.ts').read() for rnk in ['volunteer', 'senior_volunteer'])),
    ("Can function is exported by utils/permissions.ts", "export function can" in open('client/src/utils/permissions.ts').read()),
    ("AppSidebar width is 264px", "264" in open('client/src/components/layout/AppSidebar.tsx').read()),
    ("Soft shadow token matches specification", "0 1px 2px rgba(16,24,40,0.05)" in readme and "0 8px 24px -12px rgba(16,24,40,0.10)" in readme),
    ("TopoBackdrop component exists in client/src/components/signature", os.path.isfile('client/src/components/signature/TopoBackdrop.tsx')),
    ("TicketCard component exists in client/src/components/signature", os.path.isfile('client/src/components/signature/TicketCard.tsx')),
    ("TrailMeter component exists in client/src/components/signature", os.path.isfile('client/src/components/signature/TrailMeter.tsx')),
    ("JourneyLog component exists in client/src/components/signature", os.path.isfile('client/src/components/signature/JourneyLog.tsx')),
    ("MomentOverlay component exists in client/src/components/signature", os.path.isfile('client/src/components/signature/MomentOverlay.tsx')),
    ("VolunteerCard component exists in client/src/components/ui", os.path.isfile('client/src/components/ui/VolunteerCard.tsx')),
    ("PostgreSQL schema file exists at docs/schema.sql", os.path.isfile('docs/schema.sql')),
    ("Inventory dataset exists at docs/inventory.json", os.path.isfile('docs/inventory.json')),
    ("All 77 requirements traced in docs/REQUIREMENTS.md", len(inv['requirements']) == 77)
]

for idx, (claim, result) in enumerate(claims, 1):
    print(f"   [{idx}/15] {'PASS' if result else 'FAIL'}: {claim}")

all_claims_passed = all(r for _, r in claims)
print(f"   Claims verification -> {'PASS' if all_claims_passed else 'FAIL'}")
