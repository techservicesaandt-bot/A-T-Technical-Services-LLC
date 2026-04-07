import re
import json

with open('data.js', 'r', encoding='utf-8') as f:
    text = f.read()

# remove 'const AT_SERVICES = ' and trailing ';'
text = re.sub(r'const\s+AT_SERVICES\s*=\s*', '', text)
text = text.strip().rstrip(';')

# quote keys
text = re.sub(r'([{,]\s*)([a-zA-Z0-9_]+)(\s*:)', r'\1"\2"\3', text)

# replace single quotes with double quotes
# this is tricky because of apostrophes in text like 'A&T\'s in-house'
# A safer way to swap quotes:
# 1. find all single-quoted strings
def repl(m):
    s = m.group(1)
    s = s.replace('"', '\\"') # escape existing double quotes
    s = s.replace("\\'", "'") # unescape apostrophes
    return '"' + s + '"'

text = re.sub(r"'((?:\\'|[^'])*)'", repl, text)

# Parse it
try:
    data = json.loads(text)
except Exception as e:
    print("FAILED JSON Parse:", e)
    # Let's save the intermediate text to debug
    with open('debug.json', 'w', encoding='utf-8') as f:
        f.write(text)
    exit(1)

# Add gallery with 10 images to each project
for service, info in data.items():
    for proj in info['projects']:
        proj['gallery'] = [
            proj['img'],
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=80',
            'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1400&q=80',
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&q=80',
            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1400&q=80',
            'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1400&q=80',
            'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1400&q=80',
            'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=1400&q=80',
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80',
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1400&q=80'
        ]
        proj['thumbnail'] = proj['img']
        del proj['img']

with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4)

print("SUCCESS")
