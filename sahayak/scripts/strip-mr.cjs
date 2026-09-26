// One-off: remove Marathi ('mr') from the i18n dictionary and language switcher.
const fs = require('fs')
const path = require('path')
const file = path.join(__dirname, '..', 'src', 'i18n.ts')
let s = fs.readFileSync(file, 'utf8')

const before = (s.match(/mr:/g) || []).length

// strip mr entries from every dictionary row (single- or double-quoted strings)
s = s.replace(/,?\s*mr: '(?:[^'\\]|\\.)*'/g, '')
s = s.replace(/,?\s*mr: "(?:[^"\\]|\\.)*"/g, '')

// remove Marathi from the language switcher list
s = s.replace(/\s*\{ id: 'mr', label: '[^']*\'},?/, '')

fs.writeFileSync(file, s)
const after = (s.match(/mr:/g) || []).length
console.log(`removed ${before - after} mr entries; remaining: ${after}`)
if (s.includes("id: 'mr'")) { console.error('WARN: mr still in LANGS'); process.exit(1) }
