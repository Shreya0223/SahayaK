import { useStore } from '@/data/store'
import type { Lang } from '@/data/types'

export const LANGS: { id: Lang; label: string }[] = [
  { id: 'hi', label: 'हिंदी' },
  { id: 'en', label: 'EN' },
]

type Row = Record<Lang, string>

const D: Record<string, Row> = {
  /* nav */
  'nav.home': { en: 'Home', hi: 'होम' },
  'nav.discover': { en: 'Discover', hi: 'खोज' },
  'nav.report': { en: 'Report Issue', hi: 'समस्या दर्ज करें' },
  'nav.projects': { en: 'Projects', hi: 'प्रोजेक्ट्स' },
  'nav.knowledge': { en: 'Knowledge Ground', hi: 'ज्ञान क्षेत्र' },
  'nav.teams': { en: 'Teams', hi: 'टीमें' },
  'nav.impact': { en: 'Impact', hi: 'प्रभाव' },
  'nav.dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड' },
  'nav.blueprints': { en: 'Blueprints', hi: 'ब्लूप्रिंट' },
  'nav.grants': { en: 'Grants', hi: 'अनुदान' },
  'nav.workspace': { en: 'Workspace', hi: 'वर्कस्पेस' },
  'nav.helpline': { en: 'Voice Helpline', hi: 'वॉयस हेल्पलाइन' },
  'nav.more': { en: 'More Pages', hi: 'अधिक पृष्ठ' },

  /* shell */
  'viewAs': { en: 'View as:', hi: 'के रूप में देखें:' },
  'hub': { en: 'Pune Rural Hub (Bhor / Mulshi)', hi: 'पुणे ग्रामीण हब (भोर / मुळशी)' },
  'r.farmers': { en: 'Farmers / Community', hi: 'किसान / समुदाय' },
  'r.health': { en: 'Rural Health & PHCs', hi: 'ग्रामीण आरोग्य व PHC' },
  'r.students': { en: 'Students (Active)', hi: 'छात्र (सक्रिय)' },
  'r.faculty': { en: 'Faculty Mentors', hi: 'संकाय मार्गदर्शक' },
  'r.industry': { en: 'Industry Partners', hi: 'उद्योग भागीदार' },
  'r.admin': { en: 'State / Admin', hi: 'राज्य / प्रशासन' },
  'notif.title': { en: 'Notifications', hi: 'सूचनाएँ' },
  'notif.markAll': { en: 'Mark all read', hi: 'सभी पढ़ा हुआ मार्क करें' },
  'notif.viewAll': { en: 'View all notifications', hi: 'सभी सूचनाएँ देखें' },
  'notif.none': { en: 'No notifications yet', hi: 'अभी कोई सूचना नहीं' },
  'session.label': { en: 'Session', hi: 'सेशन' },
  'session.signedAs': { en: 'Signed in as', hi: 'साइन इन:' },
  'session.rbacNote': {
    en: 'Role-based access is tied to your login — to view the platform as another role, sign in with that role\u2019s account.',
    hi: 'भूमिका-आधारित पहुँच आपके लॉगिन से जुड़ी है — किसी अन्य भूमिका में देखने के लिए उस भूमिका के खाते से साइन इन करें।',
  },
  'profile.settings': { en: 'Account Settings', hi: 'खाता सेटिंग्स' },
  'portfolio.entry': { en: 'Certificates & Portfolio', hi: 'प्रमाणपत्र और पोर्टफोलियो' },
  'auth.signout': { en: 'Sign out', hi: 'साइन आउट' },
  'foot.privacy': {
    en: 'Healthcare data protected · AI recommends, humans validate',
    hi: 'स्वास्थ्य डेटा सुरक्षित · AI सुझाव देता है, इंसान पुष्टि करते हैं',
  },

  /* landing */
  'landing.badge': { en: 'verified grassroots problems resolved', hi: 'सत्यापित जमीनी समस्याएँ हल' },
  'landing.h1a': { en: 'Real Problems.', hi: 'असली समस्याएँ.' },
  'landing.h1b': { en: 'Student Innovation.', hi: 'छात्र नवाचार.' },
  'landing.h1c': { en: 'Measurable Impact.', hi: 'मापनीय प्रभाव.' },
  'landing.sub': {
    en: 'A real person has a problem, university students step up to help, and together we create lasting change across 42 rural panchayats and district clinics.',
    hi: 'एक असली व्यक्ति की समस्या होती है, विश्वविद्यालय के छात्र मदत करते हैं, और हम मिलकर 42 ग्राम पंचायतों और जिला क्लिनिकों में स्थायी बदल बनाते हैं।',
  },
  'landing.coverage': { en: 'Field Coverage', hi: 'फील्ड कवरेज' },
  'landing.panchayats': { en: 'Panchayats Connected', hi: 'पंचायतें जुड़ीं' },
  'landing.prototypes': { en: 'Active Ground Prototypes', hi: 'सक्रिय ग्राउंड प्रोटोटाइप' },
  'landing.thisMonth': { en: 'this month', hi: 'इस महीने' },
  'landing.cta1': { en: 'Share a Rural Challenge', hi: 'ग्रामीण चुनौती साझा करें' },
  'landing.cta2': { en: 'Explore Student Projects', hi: 'छात्र प्रोजेक्ट देखें' },
  'landing.newHere': { en: 'New here?', hi: 'नए हैं?' },
  'landing.or': { en: 'or', hi: 'या' },
  'landing.explore': { en: 'Explore Knowledge Ground', hi: 'ज्ञान क्षेत्र देखें' },
  'landing.signInAs': { en: 'sign in as any role', hi: 'किसी भी भूमिका से साइन इन करें' },
  'landing.walk': { en: 'to walk the full journey.', hi: 'पूरी यात्रा देखने के लिए।' },
  'landing.journeyTitle': { en: 'From problem to measurable impact', hi: 'समस्या से मापनीय प्रभाव तक' },
  'landing.journeySub': {
    en: 'SahayaK doesn\u2019t collect complaints — it builds validated solutions. Every step below is clickable in the prototype.',
    hi: 'SahayaK शिकायतें जमा नहीं करता — सत्यापित समाधान बनाता है।',
  },
  'landing.agri': { en: 'Agriculture & Genetics', hi: 'कृषि और आनुवंशिकी' },
  'landing.health': { en: 'Healthcare & Biotechnology', hi: 'स्वास्थ्य और बायोटेक्नोलॉजी' },
  'landing.different': { en: 'How SahayaK is different', hi: 'SahayaK कैसे अलग है' },

  /* journey */
  'j.problem': { en: 'Problem', hi: 'समस्या' },
  'j.ai': { en: 'AI Understanding', hi: 'AI समझ' },
  'j.match': { en: 'Skill Matching', hi: 'कौशल मिलान' },
  'j.collab': { en: 'Collaboration', hi: 'सहयोग' },
  'j.solution': { en: 'Solution', hi: 'समाधान' },
  'j.validation': { en: 'Validation', hi: 'सत्यापन' },
  'j.impact': { en: 'Impact', hi: 'प्रभाव' },

  /* report wizard */
  'report.badge': { en: 'Zero technical jargon required', hi: 'कोई तकनीकी शब्द नहीं' },
  'report.title': { en: "Share What Isn't Working", hi: 'जो ठीक नहीं चल रहा, बताएं' },
  'report.sub': {
    en: 'Explain it in your own words or speak in your language. Student engineers and faculty mentors will review it within 48 hours.',
    hi: 'अपने शब्दों में लिखें या अपनी भाषा में बोलें। छात्र इंजीनियर और संकाय मार्गदर्शक 48 घंटों में समीक्षा करेंगे।',
  },
  'report.mentorsReview': { en: 'faculty mentors actively reviewing challenges this week', hi: 'संकाय मार्गदर्शक इस सप्ताह सक्रिय समीक्षा कर रहे हैं' },
  'report.presets': { en: 'Demo presets:', hi: 'डेमो प्रीसेट:' },
  'report.step': { en: 'Step', hi: 'चरण' },
  'report.of': { en: 'of', hi: 'में से' },
  's1': { en: 'What is the struggle?', hi: 'दिक्कत क्या है?' },
  's2': { en: 'Where & who', hi: 'कहाँ और कितने लोग' },
  's3': { en: 'Evidence', hi: 'प्रमाण' },
  's4': { en: 'Review & submit', hi: 'समीक्षा और भेजें' },
  'report.describe': { en: 'Describe the daily friction', hi: 'रोज़ की दिक्कत बताएं' },
  'report.plainOk': { en: 'Plain words ok', hi: 'साधे शब्द चलेंगे' },
  'report.voice': { en: 'Record Voice Note (Hindi, English)', hi: 'वॉइस नोट रिकॉर्ड करें' },
  'report.voiceDone': { en: 'Voice note recorded ✓ — tap to remove', hi: 'वॉइस नोट रिकॉर्ड हुआ ✓ — हटाने के लिए दबाएँ' },
  'report.titleField': { en: 'One-line title', hi: 'एक पंक्ति शीर्षक' },
  'dom.agri': { en: 'Agriculture', hi: 'कृषि' },
  'dom.health': { en: 'Healthcare', hi: 'स्वास्थ्य' },
  'report.location': { en: 'Village · Taluka · District', hi: 'गाँव · तहसील · जिला' },
  'report.urgency': { en: 'How urgent is it?', hi: 'किती तात्कालिक?' },
  'u.low': { en: 'Low', hi: 'कमी' },
  'u.medium': { en: 'Medium', hi: 'मध्यम' },
  'u.high': { en: 'High', hi: 'अधिक' },
  'u.critical': { en: 'Critical', hi: 'अत्यावश्यक' },
  'report.people': { en: 'People affected (approx.)', hi: 'प्रभावित लोग (अनुमानित)' },
  'report.contact': { en: 'Contact (phone or email — shared only with validated teams)', hi: 'संपर्क (केवल सत्यापित टीमों के साथ साझा)' },
  'report.addPhoto': { en: 'Add photo', hi: 'फोटो जोड़ें' },
  'report.addDoc': { en: 'Add document', hi: 'दस्तावेज़ जोड़ें' },
  'report.tried': { en: 'What have you already tried?', hi: 'अब तक क्या प्रयास किए?' },
  'report.review': { en: 'Review', hi: 'समीक्षा' },
  'report.consent': {
    en: 'I confirm this information is accurate, contains no personal or patient-identifiable data, and I consent to SahayaK sharing it with validated teams and experts working on this problem.',
    hi: 'मैं पुष्टि करता हूँ कि यह जानकारी सही है, इसमें कोई व्यक्तिगत/रोगी डेटा नहीं है, और मैं इसे सत्यापित टीमों के साथ साझा करने के लिए सहमत हूँ।',
  },
  'report.back': { en: 'Back', hi: 'पीछे' },
  'report.next': { en: 'Next', hi: 'आगे' },
  'report.submit': { en: 'Submit & analyze with AI', hi: 'AI से विश्लेषण के लिए भेजें' },
  'an.1': { en: 'Reading your description…', hi: 'आपका विवरण पढ़ रहे हैं…' },
  'an.2': { en: 'Classifying domain and category…', hi: 'विभाग और श्रेणी तय कर रहे हैं…' },
  'an.3': { en: 'Checking similar challenges…', hi: 'समान चुनौतियाँ जाँच रहे हैं…' },
  'an.4': { en: 'Identifying required expertise and skills…', hi: 'आवश्यक विशेषज्ञता और कौशल पहचान रहे हैं…' },
  'an.5': { en: 'Preparing AI recommendation…', hi: 'AI सिफ़ारिश तैयार कर रहे हैं…' },
  'report.done': { en: 'Problem submitted & analyzed', hi: 'समस्या भेजी गई और विश्लेषित' },
  'report.analyzing': { en: 'Analyzing your problem…', hi: 'आपकी समस्या का विश्लेषण हो रहा है…' },
  'report.aiWorking': { en: "SahayaK's AI Challenge Intelligence is at work", hi: 'SahayaK की AI बुद्धिमत्ता काम कर रही है' },

  /* auth */
  'auth.welcome': { en: 'Welcome back', hi: 'वापस स्वागत है' },
  'auth.sub': {
    en: 'Sign in to continue your journey from problem to impact.',
    hi: 'समस्या से प्रभाव तक की यात्रा जारी रखने के लिए साइन इन करें।',
  },
  'auth.email': { en: 'Email', hi: 'ईमेल' },
  'auth.password': { en: 'Password', hi: 'पासवर्ड' },
  'auth.signin': { en: 'Sign in', hi: 'साइन इन' },
  'auth.forgot': { en: 'Forgot password?', hi: 'पासवर्ड भूल गए?' },
  'auth.create': { en: 'Create an account', hi: 'खाता बनाएँ' },
  'auth.demo': { en: 'Demo — one-click sign in', hi: 'डेमो — एक-क्लिक साइन इन' },
  'auth.lockNotice': { en: 'Role switching requires sign-in. Authenticate with a', hi: 'भूमिका बदलने के लिए साइन-इन ज़रूरी है। साइन इन करें' },
  'auth.lockAccount': { en: 'account to continue as that role.', hi: 'खाते से करें।' },

  /* community dashboard */
  'com.greet': { en: 'Namaste,', hi: 'नमस्ते,' },
  'com.trackSub': {
    en: 'Track your problems from report to validated solution.',
    hi: 'अपनी समस्याओं को रिपोर्ट से सत्यापित समाधान तक ट्रैक करें।',
  },
  'com.reported': { en: 'Problems reported', hi: 'दर्ज समस्याएँ' },
  'com.beingSolved': { en: 'Being solved', hi: 'हल हो रही हैं' },
  'com.validated': { en: 'Validated solutions', hi: 'सत्यापित समाधान' },
  'com.allTime': { en: 'All time', hi: 'कुल' },
  'com.teamsWorking': { en: 'Teams actively working', hi: 'टीमें सक्रिय रूप से काम कर रही हैं' },
  'com.confirmed': { en: 'Confirmed by the community', hi: 'समुदाय द्वारा पुष्ट' },
  'com.simpleTitle': {
    en: 'Simple mode — what you can do here',
    hi: 'सरल मोड — आप यहाँ क्या कर सकते हैं',
  },
  'com.myProblems': { en: 'My reported problems', hi: 'मेरी दर्ज समस्याएँ' },

  /* student dashboard */
  'std.recommended': { en: 'Recommended problems', hi: 'अनुशंसित समस्याएँ' },
  'std.myTeams': { en: 'My teams & projects', hi: 'मेरी टीमें और प्रोजेक्ट' },
  'std.saved': { en: 'Saved problems', hi: 'सहेजी गई समस्याएँ' },
  'std.strength': { en: 'Profile strength', hi: 'प्रोफ़ाइल मजबूती' },
}

export function tr(lang: Lang, key: string): string {
  const row = D[key]
  if (!row) return key
  return row[lang] || row.en
}

export function useT() {
  const lang = useStore((s) => s.lang)
  return (key: string) => tr(lang, key)
}
