# -*- coding: utf-8 -*-
"""
Google Sheet -> Olimpiada Portali Ma'lumotlarini Avtomatik Yangilovchi Skript
Google Sheet: https://docs.google.com/spreadsheets/d/1bprOfc2cipQGDj_cYUm2fW5nS9SOCa2299j-62wWyZw/edit
"""

import os
import sys
import subprocess
import csv
import json

SPREADSHEET_ID = "1bprOfc2cipQGDj_cYUm2fW5nS9SOCa2299j-62wWyZw"
DIR_PATH = os.path.dirname(os.path.abspath(__file__))
TMP_DIR = os.path.join(DIR_PATH, ".tmp_sync")
os.makedirs(TMP_DIR, exist_ok=True)

def run_export(sheet_name, out_csv):
    print(f"[{sheet_name}] yuklab olinmoqda...")
    cmd = [
        "gsheets", "readonly", "export",
        SPREADSHEET_ID, out_csv,
        "--format", "csv",
        "--sheet", sheet_name
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, shell=True)
    if res.returncode != 0:
        print(f"Xatolik {sheet_name} eksportida: {res.stderr}")
        return False
    return True

def clean_float(val):
    if not val:
        return 0.0
    val = val.replace(',', '.').strip()
    try:
        return float(val)
    except:
        return 0.0

def main():
    print("=" * 60)
    print("Olimpiada ma'lumotlarini Google Sheet'dan sinxronlash boshlandi...")
    print("=" * 60)

    sheets = ["Sozlama", "Fanlar", "Maktablar", "Natijalar"]
    files = {}
    for s in sheets:
        csv_path = os.path.join(TMP_DIR, f"{s.lower()}.csv")
        if not run_export(s, csv_path):
            print(f"Xato: {s} varag'ini yuklab bo'lmadi.")
            return
        files[s] = csv_path

    # 1. Sozlama
    sozlama = {}
    with open(files["Sozlama"], "r", encoding="utf-8") as f:
        for row in csv.reader(f):
            if len(row) >= 2:
                sozlama[row[0].strip()] = row[1].strip()

    # 2. Fanlar
    fanlar = []
    with open(files["Fanlar"], "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            fanlar.append({
                'num': r.get('№', ''),
                'name': r.get('Fan', ''),
                'emoji': r.get('Emoji', '📚'),
                'tg9': r.get('Telegram 9-sinf', ''),
                'tg10': r.get('Telegram 10-sinf', ''),
                'tg11': r.get('Telegram 11-sinf', ''),
                'c9': int(r['9-sinf']) if r.get('9-sinf', '').isdigit() else 0,
                'c10': int(r['10-sinf']) if r.get('10-sinf', '').isdigit() else 0,
                'c11': int(r['11-sinf']) if r.get('11-sinf', '').isdigit() else 0,
                'date': r.get('Sana', '')
            })

    # 3. Maktablar
    maktablar = []
    with open(files["Maktablar"], "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            maktablar.append({
                'num': r.get('№', ''),
                'full': r.get('Taʼlim muassasasi (toʻliq nomi)', ''),
                'short': r.get('Qisqa nomi', ''),
                'total': int(r['Jami ishtirokchi']) if r.get('Jami ishtirokchi', '').isdigit() else 0,
                'phone': r.get('Telefon', '')
            })

    # 4. Natijalar
    natijalar = []
    with open(files["Natijalar"], "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            natijalar.append({
                'f': r.get('Fan', '').strip(),
                's': int(r['Sinf']) if r.get('Sinf', '').isdigit() else 0,
                'p': int(r['Oʻrin']) if r.get('Oʻrin', '').isdigit() else 0,
                'n': r.get('F.I.Sh.', '').strip(),
                'm': r.get('Taʼlim muassasasi', '').strip(),
                'b1': r.get('1-10', ''),
                'b2': r.get('11-20', ''),
                'b3': r.get('21-30', ''),
                'b': clean_float(r.get('Ball', '')),
                't': r.get('Oʻqituvchi', '').strip()
            })

    # Tartib raqami (o'rin) berish
    grouped = {}
    for r in natijalar:
        key = (r['f'], r['s'])
        grouped.setdefault(key, []).append(r)

    for key, items in grouped.items():
        items.sort(key=lambda x: x['b'], reverse=True)
        for idx, item in enumerate(items, 1):
            if not item['p']:
                item['p'] = idx

    full_data = {
        'sozlama': sozlama,
        'fanlar': fanlar,
        'maktablar': maktablar,
        'natijalar': natijalar
    }

    # JSON va JS fayllarini yozish
    json_path = os.path.join(DIR_PATH, "olimpiada_data.json")
    js_path = os.path.join(DIR_PATH, "olimpiada_data.js")

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(full_data, f, ensure_ascii=False)

    with open(js_path, "w", encoding="utf-8") as f:
        f.write("window.OLIMPIADA_DATA = " + json.dumps(full_data, ensure_ascii=False) + ";\n")

    print(f"Muvaffaqiyatli saqlandi:")
    print(f" - Fanlar soni: {len(fanlar)}")
    print(f" - Maktablar soni: {len(maktablar)}")
    print(f" - Ishtirokchilar soni: {len(natijalar)}")
    print(f" - Chiqish fayllari: olimpiada_data.json, olimpiada_data.js")
    print("=" * 60)

if __name__ == "__main__":
    main()
