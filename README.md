# Form-Validat-r

![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Rollup](https://img.shields.io/badge/Rollup-EC4A3F?style=for-the-badge&logo=rollup.js&logoColor=white)

A zero-dependency JavaScript form validation library with a declarative API, custom rule engine, and real-time feedback. Drop it in, configure your rules, and let it handle the rest.

---

## Planned Usage

```js
import { FormValidator } from 'form-validat-r';

const validator = new FormValidator('#myForm', {
  email: {
    required: true,
    email: true,
    message: 'Please enter a valid email address'
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[A-Z])(?=.*\d)/,
    message: 'Password must be at least 8 characters with a number and uppercase letter'
  },
  age: {
    required: true,
    numeric: true,
    range: [18, 120]
  }
});

validator.onSubmit((isValid, errors) => {
  if (isValid) {
    // submit
  } else {
    console.log(errors); // { email: 'Invalid email', ... }
  }
});

// Custom rule
validator.addRule('turkishPhone', (value) => /^(\+90|0)?5\d{9}$/.test(value), {
  message: 'Enter a valid Turkish phone number'
});
```

---

## Planned Features

- **Declarative validation** — define rules via JS config or HTML `data-` attributes
- **Built-in validators:** `required`, `minLength`, `maxLength`, `email`, `url`, `pattern`, `numeric`, `range`, `equalTo`
- **Custom rule API** — define and register your own validators
- **Real-time feedback** — validate on `input` event + final check on `submit`
- **Error rendering** — automatic or manual error message placement
- **Customizable templates** — bring your own CSS class names and error element structure
- **i18n support** — built-in English and Turkish, extensible to any language
- **TypeScript definitions** — full `.d.ts` typings

---

## Built-in Validators

| Validator | Usage | Description |
|-----------|-------|-------------|
| `required` | `required: true` | Field must not be empty |
| `minLength` | `minLength: 6` | Minimum character count |
| `maxLength` | `maxLength: 100` | Maximum character count |
| `email` | `email: true` | Valid email format |
| `url` | `url: true` | Valid HTTP/HTTPS URL |
| `pattern` | `pattern: /regex/` | Custom regex match |
| `numeric` | `numeric: true` | Must be a number |
| `range` | `range: [min, max]` | Numeric range check |
| `equalTo` | `equalTo: '#field'` | Must match another field (password confirm) |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Core | Vanilla JavaScript (ES2020) |
| Type Safety | TypeScript |
| Bundler | Rollup (ESM + CJS + UMD builds) |
| Testing | Jest + JSDOM |
| Docs | JSDoc |

---

## Roadmap

| Phase | Task | Status |
|-------|------|--------|
| Phase 1 | Core validator class + required/minLength/maxLength | [ ] |
| Phase 2 | email, url, pattern, numeric, range, equalTo | [ ] |
| Phase 3 | Real-time validation (oninput + onsubmit) | [ ] |
| Phase 4 | Custom rule registration API | [ ] |
| Phase 5 | Error rendering (auto + manual placement) | [ ] |
| Phase 6 | i18n system (EN + TR built-in) | [ ] |
| Phase 7 | TypeScript definitions | [ ] |
| Phase 8 | Jest test suite (95%+ coverage) | [ ] |
| Phase 9 | Rollup build → ESM + CJS + UMD | [ ] |
| Phase 10 | Publish to npm | [ ] |
