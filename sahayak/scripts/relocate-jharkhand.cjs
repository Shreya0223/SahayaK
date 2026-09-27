/* One-shot relocation: Maharashtra/Karnataka demo locations → Jharkhand.
 * Ordered pairs — most specific strings first, bare city names last. */
const fs = require('fs')
const path = require('path')

const PAIRS = [
  ['Bidar → Kalaburagi, Karnataka', 'Dumka → Ranchi, Jharkhand'],
  ['Pune Rural Hub (Bhor / Mulshi)', 'Ranchi Rural Hub (Angara / Bundu)'],
  ['पुणे ग्रामीण हब (भोर / मुळशी)', 'रांची ग्रामीण हब (अंगारा / बुंदू)'],
  ['Bhor, Pune Rural', 'Bundu, Ranchi Rural'],
  ['Dindori Rd, Nashik', 'Bundu Rd, Ranchi'],
  ['Nashik, Maharashtra', 'Ranchi, Jharkhand'],
  ['Dharwad, Karnataka', 'Dhanbad, Jharkhand'],
  ['Nagpur, Maharashtra', 'Jamshedpur, Jharkhand'],
  ['Baramati, Maharashtra', 'Bokaro, Jharkhand'],
  ['Bidar, Karnataka', 'Dumka, Jharkhand'],
  ['Osmanabad, Maharashtra', 'Hazaribagh, Jharkhand'],
  ['Nashik, MH', 'Ranchi, JH'],
  ['Dharwad, KA', 'Dhanbad, JH'],
  ['Nagpur, MH', 'Jamshedpur, JH'],
  ['Baramati, MH', 'Bokaro, JH'],
  ['Bidar, KA', 'Dumka, JH'],
  ['Osmanabad, MH', 'Hazaribagh, JH'],
  ['Pune, MH', 'Ranchi, JH'],
  ['Rahuri, MH', 'Ranchi, JH'],
  ['Govt. of Maharashtra', 'Govt. of Jharkhand'],
  ['MPKV Rahuri', 'Birsa Agricultural University (BAU)'],
  ['COEP Technological University', 'BIT Mesra, Ranchi'],
  ['Student · COEP', 'Student · BIT Mesra'],
  ['VIT Pune', 'Ranchi University'],
  ['MIT Institute of Design', 'BIT Mesra, Ranchi'],
  ['IISER Pune', 'Central University of Jharkhand'],
  ['Dr. DY Patil Medical College', 'RIMS Ranchi'],
  ['AIIMS Nagpur', 'AIIMS Deoghar'],
  ['Hindi/Marathi', 'Hindi'],
  ['Marathi', 'Hindi'],
  ['nashikgrapes', 'ranchigrapes'],
  ['phc.bidar', 'phc.dumka'],
  ['chc.osmanabad', 'chc.hazaribagh'],
  ['baramatifpo', 'bokarofpo'],
  ['Nashik', 'Ranchi'],
  ['Dharwad', 'Dhanbad'],
  ['Nagpur', 'Jamshedpur'],
  ['Baramati', 'Bokaro'],
  ['Bidar', 'Dumka'],
  ['Osmanabad', 'Hazaribagh'],
  ['Kalaburagi', 'Ranchi'],
  ['Bhor', 'Angara'],
  ['Mulshi', 'Bundu'],
  ['Rahuri', 'Ranchi'],
  ['Maharashtra', 'Jharkhand'],
  ['Karnataka', 'Jharkhand'],
  ['Pune', 'Ranchi'],
]

const FILES = [
  'src/data/seed.ts',
  'src/data/programs.ts',
  'src/i18n.ts',
  'src/pages/Auth.tsx',
  'src/pages/Landing.tsx',
  'src/pages/Onboarding.tsx',
  'src/pages/ReportProblem.tsx',
  'src/pages/VoiceHelpline.tsx',
]

let total = 0
for (const f of FILES) {
  const p = path.join(__dirname, '..', f)
  let src = fs.readFileSync(p, 'utf8')
  let count = 0
  for (const [from, to] of PAIRS) {
    const parts = src.split(from)
    if (parts.length > 1) {
      count += parts.length - 1
      src = parts.join(to)
    }
  }
  if (count) {
    fs.writeFileSync(p, src)
    console.log(`${f}: ${count} replacements`)
    total += count
  }
}
console.log(`TOTAL: ${total}`)
