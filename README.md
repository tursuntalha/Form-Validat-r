# 🔨 FormForge — AI-Powered Form Builder & Smart Validator

![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logoColor=white)

> **"Formu tarif et, AI inşa etsin."**

---

## The Problem

Building forms is repetitive. Regex validators are brittle and can't understand context. A phone number field might accept `99999999999` because it passes the pattern — but is it real? A name field might accept `Aaaaaaa Bbbbbb` — technically valid, practically nonsense.

Traditional form builders generate boilerplate. Traditional validators check format, not meaning.

## The Solution

**FormForge** is a two-mode tool:

**Mode 1 — AI Form Builder:** Describe your form in plain Turkish or English, and the AI generates the complete form structure: fields, types, labels, validation rules, required markers. Export as React JSX, JSON schema, or raw HTML.

**Mode 2 — Smart Validator:** Beyond regex — uses a local LLM to semantically validate suspicious inputs. Detect fake names, implausible addresses, suspicious price entries, or contextually wrong data.

---

## Mode 1: AI Form Generation

```
You: "Bir kira sözleşmesi formu yap: 
      kiracı adı, TC kimlik numarası, 
      kira bedeli (TL), başlangıç tarihi, 
      depozito bedeli, ev adresi"

FormForge generates:
  [
    { field: "tenant_name",   type: "text",   label: "Kiracı Adı",         required: true,  validator: "name_tr" },
    { field: "tc_id",         type: "text",   label: "TC Kimlik No",        required: true,  validator: "tc_kimlik" },
    { field: "monthly_rent",  type: "number", label: "Aylık Kira (TL)",     required: true,  min: 0 },
    { field: "start_date",    type: "date",   label: "Başlangıç Tarihi",    required: true },
    { field: "deposit",       type: "number", label: "Depozito Bedeli (TL)",required: true,  min: 0 },
    { field: "address",       type: "textarea",label: "Ev Adresi",          required: true,  minLength: 20 }
  ]

Export as: [React Component] [JSON Schema] [HTML]
```

---

## Mode 2: Smart Semantic Validation

Standard validators check format. FormForge checks **meaning**:

```
Input: Name = "Aaaaa Bbbbb"
Standard validator: ✅ PASS (it's text, proper length)
FormForge AI:       ⚠️  WARNING — "This name pattern looks generated/fake"

Input: Price = "1" (for a product listed at ~5000 TL range)
Standard validator: ✅ PASS (it's a number > 0)
FormForge AI:       ⚠️  WARNING — "This price is unusually low for this field context"

Input: TC Kimlik = "12345678901"
Standard validator: ✅ PASS (11 digits)
FormForge AI:       ❌ FAIL — "TC Kimlik checksum failed (digits 10-11 rule)"
```

---

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                    React UI                          │
│    Natural Language Input | Form Preview | Export    │
└──────────────┬───────────────────────────────────────┘
               │ description text
               ▼
┌──────────────────────────────────────────────────────┐
│           Ollama — qwen2.5:7b                        │
│   Parse intent → generate field schema JSON          │
│   Semantic validation → score + reasoning            │
└──────────┬───────────────────────────────────────────┘
           │ field schema JSON
           ▼
┌──────────────────────────────────────────────────────┐
│           FormForge Engine                           │
│   Schema → React JSX / JSON / HTML export            │
│   Built-in validators: TC, IBAN, phone TR, email     │
│   Drag-and-drop reorder | Preview mode               │
└──────────────────────────────────────────────────────┘
```

---

## Features

| Feature | Mode | Description |
|---------|------|-------------|
| 🗣️ NL Form Generator | Builder | Describe form in Turkish/English → AI builds schema |
| 🧩 Drag & Drop | Builder | Reorder fields visually after generation |
| 👁️ Preview Mode | Builder | See the real rendered form before exporting |
| 📤 Export | Builder | React JSX, JSON Schema, or plain HTML |
| 🧠 Semantic Validation | Validator | LLM detects fake/implausible input patterns |
| ✅ TC Kimlik Validator | Validator | Full checksum algorithm (digits 10–11 rule) |
| 🏦 IBAN Validator | Validator | TR IBAN format + checksum |
| 📱 Turkish Phone | Validator | GSM format check (05xx, +905xx) |
| 🌍 i18n | Both | English + Turkish built-in |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| AI | Ollama (qwen2.5:7b — local, private) |
| Drag & Drop | @dnd-kit/core |
| Validators | Custom (TC, IBAN, phone TR) + Zod |
| Export | code-mirror (code preview) + copy-to-clipboard |

---

## Implementation Roadmap

### Phase 1 — Built-in Validator Engine
- [x] `validators/tc_kimlik.ts` — TC Kimlik No checksum algorithm
- [x] `validators/iban_tr.ts` — Turkish IBAN format + mod-97 check
- [x] `validators/phone_tr.ts` — Mobile and landline Turkish phone
- [x] `validators/email.ts`, `validators/url.ts`
- [x] `validators/name_tr.ts` — Detect obviously fake name patterns
- [x] Unit test coverage for all validators

### Phase 2 — Ollama Form Generator
- [x] Set up Ollama (qwen2.5:7b) backend proxy (Express)
- [x] Few-shot prompt for field schema generation (15 examples)
- [x] Parse LLM JSON output → internal field schema type
- [x] Error handling: if LLM output is malformed, retry with correction prompt
- [x] Support: text, email, number, date, textarea, select, checkbox, radio

### Phase 3 — React Builder UI
- [x] Natural language input area
- [x] Generated field list (editable: label, required toggle, type change)
- [x] @dnd-kit drag-and-drop reordering
- [x] Live preview panel (renders the actual form on the right)
- [x] "Regenerate" and "Add field manually" buttons

### Phase 4 — Semantic Validation Mode
- [x] Validation panel: paste any form data (JSON) → run AI check
- [x] LLM prompt: score each field value (0–1 suspicion score)
- [x] Color-coded output: green (ok), yellow (suspicious), red (likely invalid)
- [x] Reasoning tooltip for flagged fields
- [x] Batch validation (validate entire form submission at once)

### Phase 5 — Export + Polish
- [x] Export to React JSX (with validation rules as Zod schema)
- [x] Export to JSON Schema (draft-07 compatible)
- [x] Export to plain HTML (with `data-` attribute validation hooks)
- [x] Copy-to-clipboard for each export format
- [x] Syntax highlighting in export preview (CodeMirror)
- [x] i18n: switch UI and generated labels between TR and EN

---

## Getting Started (once Phase 1 is complete)

```bash
# Prerequisites: Node.js 18+, Ollama
ollama pull qwen2.5:7b

git clone https://github.com/tursuntalha/Form-Validat-r.git
cd Form-Validat-r
npm install
npm run dev
```

---

> FormForge collapses the gap between "I need a form" and "the form is done" — from hours to seconds.
