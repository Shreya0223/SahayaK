import { useStore } from '@/data/store'
import type { Lang } from '@/data/types'

export const LANGS: { id: Lang; label: string }[] = [
  { id: 'mr', label: 'मराठी' },
  { id: 'hi', label: 'हिंदी' },
  { id: 'en', label: 'EN' },
]

type Row = Record<Lang, string>

const D: Record<string, Row> = {
  /* nav */
  'nav.home': { en: 'Home', hi: 'होम', mr: 'मुख्यपृष्ठ' },
  'nav.discover': { en: 'Discover', hi: 'खोज', mr: 'शोध' },
  'nav.report': { en: 'Report Issue', hi: 'समस्या दर्ज करें', mr: 'अहवाल द्या' },
  'nav.projects': { en: 'Projects', hi: 'प्रोजेक्ट्स', mr: 'प्रकल्प' },
  'nav.knowledge': { en: 'Knowledge Ground', hi: 'ज्ञान क्षेत्र', mr: 'ज्ञान क्षेत्र' },
  'nav.teams': { en: 'Teams', hi: 'टीमें', mr: 'संघ' },
  'nav.impact': { en: 'Impact', hi: 'प्रभाव', mr: 'प्रभाव' },
  'nav.dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड', mr: 'डॅशबोर्ड' },
  'nav.blueprints': { en: 'Blueprints', hi: 'ब्लूप्रिंट', mr: 'आराखडा' },
  'nav.grants': { en: 'Grants', hi: 'अनुदान', mr: 'अनुदान' },
  'nav.workspace': { en: 'Workspace', hi: 'वर्कस्पेस', mr: 'कार्यक्षेत्र' },
  'nav.more': { en: 'More Pages', hi: 'अधिक पृष्ठ', mr: 'अधिक पाने' },

  /* shell */
  'viewAs': { en: 'View as:', hi: 'के रूप में देखें:', mr: 'म्हणून पहा:' },
  'hub': { en: 'Pune Rural Hub (Bhor / Mulshi)', hi: 'पुणे ग्रामीण हब (भोर / मुळशी)', mr: 'पुणे ग्रामीण हब (भोर / मुळशी)' },
  'r.farmers': { en: 'Farmers / Community', hi: 'किसान / समुदाय', mr: 'शेतकरी / समुदाय' },
  'r.health': { en: 'Rural Health & PHCs', hi: 'ग्रामीण आरोग्य व PHC', mr: 'ग्रामीण आरोग्य व पीएचसी' },
  'r.students': { en: 'Students (Active)', hi: 'छात्र (सक्रिय)', mr: 'विद्यार्थी (सक्रिय)' },
  'r.faculty': { en: 'Faculty Mentors', hi: 'संकाय मार्गदर्शक', mr: 'प्राध्यापक मार्गदर्शक' },
  'r.industry': { en: 'Industry Partners', hi: 'उद्योग भागीदार', mr: 'उद्योग भागीदार' },
  'r.admin': { en: 'State / Admin', hi: 'राज्य / प्रशासन', mr: 'राज्य / प्रशासन' },
  'notif.title': { en: 'Notifications', hi: 'सूचनाएँ', mr: 'अधिसूचना' },
  'notif.markAll': { en: 'Mark all read', hi: 'सभी पढ़ा हुआ मार्क करें', mr: 'सर्व वाचले' },
  'notif.viewAll': { en: 'View all notifications', hi: 'सभी सूचनाएँ देखें', mr: 'सर्व अधिसूचना पहा' },
  'notif.none': { en: 'No notifications yet', hi: 'अभी कोई सूचना नहीं', mr: 'अजून अधिसूचना नाही' },
  'session.label': { en: 'Session', hi: 'सेशन', mr: 'सत्र' },
  'session.signedAs': { en: 'Signed in as', hi: 'साइन इन:', mr: 'साइन इन:' },
  'session.rbacNote': {
    en: 'Role-based access is tied to your login — to view the platform as another role, sign in with that role\u2019s account.',
    hi: 'भूमिका-आधारित पहुँच आपके लॉगिन से जुड़ी है — किसी अन्य भूमिका में देखने के लिए उस भूमिका के खाते से साइन इन करें।',
    mr: 'भूमिका-आधारित प्रवेश तुमच्या लॉगिनशी जोडलेला आहे — दुसऱ्या भूमिकेत पाहण्यासाठी त्या भूमिकेच्या खात्याने साइन इन करा.',
  },
  'profile.settings': { en: 'Profile & settings', hi: 'प्रोफ़ाइल और सेटिंग्स', mr: 'प्रोफाइल व सेटिंग्ज' },
  'auth.signout': { en: 'Sign out', hi: 'साइन आउट', mr: 'बाहेर पडा' },
  'foot.privacy': {
    en: 'Healthcare data protected · AI recommends, humans validate',
    hi: 'स्वास्थ्य डेटा सुरक्षित · AI सुझाव देता है, इंसान पुष्टि करते हैं',
    mr: 'आरोग्य माहिती सुरक्षित · AI शिफारस करते, माणसे पडताळतात',
  },

  /* landing */
  'landing.badge': { en: 'verified grassroots problems resolved', hi: 'सत्यापित जमीनी समस्याएँ हल', mr: 'पडताळलेल्या खऱ्या समस्या सोडवल्या' },
  'landing.h1a': { en: 'Real Problems.', hi: 'असली समस्याएँ.', mr: 'खऱ्या समस्या.' },
  'landing.h1b': { en: 'Student Innovation.', hi: 'छात्र नवाचार.', mr: 'विद्यार्थी नावीन्य.' },
  'landing.h1c': { en: 'Measurable Impact.', hi: 'मापनीय प्रभाव.', mr: 'मोजण्यायोग्य प्रभाव.' },
  'landing.sub': {
    en: 'A real person has a problem, university students step up to help, and together we create lasting change across 42 rural panchayats and district clinics.',
    hi: 'एक असली व्यक्ति की समस्या होती है, विश्वविद्यालय के छात्र मदत करते हैं, और हम मिलकर 42 ग्राम पंचायतों और जिला क्लिनिकों में स्थायी बदल बनाते हैं।',
    mr: 'एक खऱ्या व्यक्तीची समस्या असते, विद्यापीठातील विद्यार्थी मदतीला धावतात, आणि आपण मिळून ४२ ग्रामपंचायतींमध्ये व जिल्हा दवाखान्यांत कायमस्वरूपी बदल घडवतो.',
  },
  'landing.coverage': { en: 'Field Coverage', hi: 'फील्ड कवरेज', mr: 'क्षेत्र कव्हरेज' },
  'landing.panchayats': { en: 'Panchayats Connected', hi: 'पंचायतें जुड़ीं', mr: 'ग्रामपंचायती जोडल्या' },
  'landing.prototypes': { en: 'Active Ground Prototypes', hi: 'सक्रिय ग्राउंड प्रोटोटाइप', mr: 'सक्रिय फील्ड प्रोटोटाइप' },
  'landing.thisMonth': { en: 'this month', hi: 'इस महीने', mr: 'या महिन्यात' },
  'landing.cta1': { en: 'Share a Rural Challenge', hi: 'ग्रामीण चुनौती साझा करें', mr: 'ग्रामीण समस्या सांगा' },
  'landing.cta2': { en: 'Explore Student Projects', hi: 'छात्र प्रोजेक्ट देखें', mr: 'विद्यार्थी प्रकल्प पहा' },
  'landing.newHere': { en: 'New here?', hi: 'नए हैं?', mr: 'नवीन आहात?' },
  'landing.or': { en: 'or', hi: 'या', mr: 'किंवा' },
  'landing.explore': { en: 'Explore Knowledge Ground', hi: 'ज्ञान क्षेत्र देखें', mr: 'ज्ञान क्षेत्र पाहा' },
  'landing.signInAs': { en: 'sign in as any role', hi: 'किसी भी भूमिका से साइन इन करें', mr: 'कोणत्याही भूमिकेने साइन इन करा' },
  'landing.walk': { en: 'to walk the full journey.', hi: 'पूरी यात्रा देखने के लिए।', mr: 'संपूर्ण प्रवास पाहण्यासाठी.' },
  'landing.journeyTitle': { en: 'From problem to measurable impact', hi: 'समस्या से मापनीय प्रभाव तक', mr: 'समस्येपासून मोजण्यायोग्य प्रभावापर्यंत' },
  'landing.journeySub': {
    en: 'SahayaK doesn\u2019t collect complaints — it builds validated solutions. Every step below is clickable in the prototype.',
    hi: 'SahayaK शिकायतें जमा नहीं करता — सत्यापित समाधान बनाता है।',
    mr: 'SahayaK तक्रारी जमा करत नाही — पडताळलेले उपाय घडवते.',
  },
  'landing.agri': { en: 'Agriculture & Genetics', hi: 'कृषि और आनुवंशिकी', mr: 'शेती व अनुवंशिकी' },
  'landing.health': { en: 'Healthcare & Biotechnology', hi: 'स्वास्थ्य और बायोटेक्नोलॉजी', mr: 'आरोग्य व जैवतंत्रज्ञान' },
  'landing.different': { en: 'How SahayaK is different', hi: 'SahayaK कैसे अलग है', mr: 'SahayaK वेगळे कसे?' },

  /* journey */
  'j.problem': { en: 'Problem', hi: 'समस्या', mr: 'समस्या' },
  'j.ai': { en: 'AI Understanding', hi: 'AI समझ', mr: 'AI समज' },
  'j.match': { en: 'Skill Matching', hi: 'कौशल मिलान', mr: 'कौशल जुळणी' },
  'j.collab': { en: 'Collaboration', hi: 'सहयोग', mr: 'सहयोग' },
  'j.solution': { en: 'Solution', hi: 'समाधान', mr: 'उपाय' },
  'j.validation': { en: 'Validation', hi: 'सत्यापन', mr: 'पडताळणी' },
  'j.impact': { en: 'Impact', hi: 'प्रभाव', mr: 'प्रभाव' },

  /* report wizard */
  'report.badge': { en: 'Zero technical jargon required', hi: 'कोई तकनीकी शब्द नहीं', mr: 'कोणतेही तांत्रिक शब्द नाही' },
  'report.title': { en: "Share What Isn't Working", hi: 'जो ठीक नहीं चल रहा, बताएं', mr: 'काय व्यवस्थित चालत नाही ते सांगा' },
  'report.sub': {
    en: 'Explain it in your own words or speak in your language. Student engineers and faculty mentors will review it within 48 hours.',
    hi: 'अपने शब्दों में लिखें या अपनी भाषा में बोलें। छात्र इंजीनियर और संकाय मार्गदर्शक 48 घंटों में समीक्षा करेंगे।',
    mr: 'तुमच्या शब्दांत लिहा किंवा तुमच्या भाषेत बोला. विद्यार्थी अभियंते व प्राध्यापक ४८ तासांत पाहतील.',
  },
  'report.mentorsReview': { en: 'faculty mentors actively reviewing challenges this week', hi: 'संकाय मार्गदर्शक इस सप्ताह सक्रिय समीक्षा कर रहे हैं', mr: 'प्राध्यापक या आठवड्यात समस्या पाहत आहेत' },
  'report.presets': { en: 'Demo presets:', hi: 'डेमो प्रीसेट:', mr: 'नमुने:' },
  'report.step': { en: 'Step', hi: 'चरण', mr: 'टप्पा' },
  'report.of': { en: 'of', hi: 'में से', mr: 'पैकी' },
  's1': { en: 'What is the struggle?', hi: 'दिक्कत क्या है?', mr: 'काय अडचण आहे?' },
  's2': { en: 'Where & who', hi: 'कहाँ और कितने लोग', mr: 'कुठे व किती लोक' },
  's3': { en: 'Evidence', hi: 'प्रमाण', mr: 'पुरावा' },
  's4': { en: 'Review & submit', hi: 'समीक्षा और भेजें', mr: 'तपासा व पाठवा' },
  'report.describe': { en: 'Describe the daily friction', hi: 'रोज़ की दिक्कत बताएं', mr: 'रोजची अडचण वर्णन करा' },
  'report.plainOk': { en: 'Plain words ok', hi: 'साधे शब्द चलेंगे', mr: 'साध्या शब्दांत चालेल' },
  'report.voice': { en: 'Record Voice Note (Hindi, Marathi, English)', hi: 'वॉइस नोट रिकॉर्ड करें', mr: 'आवाज नोंद करा (हिंदी, मराठी, English)' },
  'report.voiceDone': { en: 'Voice note recorded ✓ — tap to remove', hi: 'वॉइस नोट रिकॉर्ड हुआ ✓ — हटाने के लिए दबाएँ', mr: 'आवाज नोंद झाले ✓ — काढण्यासाठी दाबा' },
  'report.titleField': { en: 'One-line title', hi: 'एक पंक्ति शीर्षक', mr: 'एक ओळीत शीर्षक' },
  'dom.agri': { en: 'Agriculture', hi: 'कृषि', mr: 'शेती' },
  'dom.health': { en: 'Healthcare', hi: 'स्वास्थ्य', mr: 'आरोग्य' },
  'report.location': { en: 'Village · Taluka · District', hi: 'गाँव · तहसील · जिला', mr: 'गाव · तालुका · जिल्हा' },
  'report.urgency': { en: 'How urgent is it?', hi: 'किती तात्कालिक?', mr: 'किती तातडीचे?' },
  'u.low': { en: 'Low', hi: 'कमी', mr: 'कमी' },
  'u.medium': { en: 'Medium', hi: 'मध्यम', mr: 'मध्यम' },
  'u.high': { en: 'High', hi: 'अधिक', mr: 'जास्त' },
  'u.critical': { en: 'Critical', hi: 'अत्यावश्यक', mr: 'अत्यावश्यक' },
  'report.people': { en: 'People affected (approx.)', hi: 'प्रभावित लोग (अनुमानित)', mr: 'अंदाजे प्रभावित लोक' },
  'report.contact': { en: 'Contact (phone or email — shared only with validated teams)', hi: 'संपर्क (केवल सत्यापित टीमों के साथ साझा)', mr: 'संपर्क (फक्त पडताळलेल्या टीमांसाठी)' },
  'report.addPhoto': { en: 'Add photo', hi: 'फोटो जोड़ें', mr: 'फोटो जोडा' },
  'report.addDoc': { en: 'Add document', hi: 'दस्तावेज़ जोड़ें', mr: 'दस्तऐवज जोडा' },
  'report.tried': { en: 'What have you already tried?', hi: 'अब तक क्या प्रयास किए?', mr: 'आधी काय प्रयत्न केले?' },
  'report.review': { en: 'Review', hi: 'समीक्षा', mr: 'तपासणी' },
  'report.consent': {
    en: 'I confirm this information is accurate, contains no personal or patient-identifiable data, and I consent to SahayaK sharing it with validated teams and experts working on this problem.',
    hi: 'मैं पुष्टि करता हूँ कि यह जानकारी सही है, इसमें कोई व्यक्तिगत/रोगी डेटा नहीं है, और मैं इसे सत्यापित टीमों के साथ साझा करने के लिए सहमत हूँ।',
    mr: 'ही माहिती खरी आहे, यात वैयक्तिक/रुग्ण माहिती नाही, व या समस्येवर काम करणाऱ्या पडताळलेल्या टीमांसोबत शेअर करण्यास मी संमत आहे.',
  },
  'report.back': { en: 'Back', hi: 'पीछे', mr: 'मागे' },
  'report.next': { en: 'Next', hi: 'आगे', mr: 'पुढे' },
  'report.submit': { en: 'Submit & analyze with AI', hi: 'AI से विश्लेषण के लिए भेजें', mr: 'पाठवा व AI ने विश्लेषण करा' },
  'an.1': { en: 'Reading your description…', hi: 'आपका विवरण पढ़ रहे हैं…', mr: 'तुमचे वर्णन वाचत आहोत…' },
  'an.2': { en: 'Classifying domain and category…', hi: 'विभाग और श्रेणी तय कर रहे हैं…', mr: 'विभाग व प्रकार ठरवत आहोत…' },
  'an.3': { en: 'Checking similar challenges…', hi: 'समान चुनौतियाँ जाँच रहे हैं…', mr: 'समरूप समस्या तपासत आहोत…' },
  'an.4': { en: 'Identifying required expertise and skills…', hi: 'आवश्यक विशेषज्ञता और कौशल पहचान रहे हैं…', mr: 'आवश्यक कौशल व तज्ज्ञता ओळखत आहोत…' },
  'an.5': { en: 'Preparing AI recommendation…', hi: 'AI सिफ़ारिश तैयार कर रहे हैं…', mr: 'AI शिफारस तयार करत आहोत…' },
  'report.done': { en: 'Problem submitted & analyzed', hi: 'समस्या भेजी गई और विश्लेषित', mr: 'समस्या पाठवली व विश्लेषण पूर्ण' },
  'report.analyzing': { en: 'Analyzing your problem…', hi: 'आपकी समस्या का विश्लेषण हो रहा है…', mr: 'तुमची समस्या विश्लेषण सुरू आहे…' },
  'report.aiWorking': { en: "SahayaK's AI Challenge Intelligence is at work", hi: 'SahayaK की AI बुद्धिमत्ता काम कर रही है', mr: "SahayaK ची AI बुद्धिमत्ता कार्यरत आहे" },

  /* auth */
  'auth.welcome': { en: 'Welcome back', hi: 'वापस स्वागत है', mr: 'पुन्हा स्वागत आहे' },
  'auth.sub': {
    en: 'Sign in to continue your journey from problem to impact.',
    hi: 'समस्या से प्रभाव तक की यात्रा जारी रखने के लिए साइन इन करें।',
    mr: 'समस्येपासून प्रभावापर्यंतच्या प्रवासासाठी साइन इन करा.',
  },
  'auth.email': { en: 'Email', hi: 'ईमेल', mr: 'ईमेल' },
  'auth.password': { en: 'Password', hi: 'पासवर्ड', mr: 'पासवर्ड' },
  'auth.signin': { en: 'Sign in', hi: 'साइन इन', mr: 'साइन इन' },
  'auth.forgot': { en: 'Forgot password?', hi: 'पासवर्ड भूल गए?', mr: 'पासवर्ड विसरलात?' },
  'auth.create': { en: 'Create an account', hi: 'खाता बनाएँ', mr: 'खाते तयार करा' },
  'auth.demo': { en: 'Demo — one-click sign in', hi: 'डेमो — एक-क्लिक साइन इन', mr: 'डेमो — एक-क्लिक साइन इन' },
  'auth.lockNotice': { en: 'Role switching requires sign-in. Authenticate with a', hi: 'भूमिका बदलने के लिए साइन-इन ज़रूरी है। साइन इन करें', mr: 'भूमिका बदलण्यासाठी साइन-इन आवश्यक आहे. साइन इन करा' },
  'auth.lockAccount': { en: 'account to continue as that role.', hi: 'खाते से करें।', mr: 'खात्याने करा.' },

  /* community dashboard */
  'com.greet': { en: 'Namaste,', hi: 'नमस्ते,', mr: 'नमस्कार,' },
  'com.trackSub': {
    en: 'Track your problems from report to validated solution.',
    hi: 'अपनी समस्याओं को रिपोर्ट से सत्यापित समाधान तक ट्रैक करें।',
    mr: 'अहवालापासून पडताळलेल्या उपायापर्यंत तुमच्या समस्या पाहा.',
  },
  'com.reported': { en: 'Problems reported', hi: 'दर्ज समस्याएँ', mr: 'नोंदवलेल्या समस्या' },
  'com.beingSolved': { en: 'Being solved', hi: 'हल हो रही हैं', mr: 'सोडवल्या जात आहेत' },
  'com.validated': { en: 'Validated solutions', hi: 'सत्यापित समाधान', mr: 'पडताळलेले उपाय' },
  'com.allTime': { en: 'All time', hi: 'कुल', mr: 'सर्व काळ' },
  'com.teamsWorking': { en: 'Teams actively working', hi: 'टीमें सक्रिय रूप से काम कर रही हैं', mr: 'संघ सक्रियपणे कार्यरत' },
  'com.confirmed': { en: 'Confirmed by the community', hi: 'समुदाय द्वारा पुष्ट', mr: 'समुदायाने पुष्ट केलेले' },
  'com.simpleTitle': {
    en: 'Simple mode — what you can do here',
    hi: 'सरल मोड — आप यहाँ क्या कर सकते हैं',
    mr: 'सोपी पद्धत — तुम्ही येथे काय करू शकता',
  },
  'com.myProblems': { en: 'My reported problems', hi: 'मेरी दर्ज समस्याएँ', mr: 'माझ्या नोंदवलेल्या समस्या' },

  /* student dashboard */
  'std.recommended': { en: 'Recommended problems', hi: 'अनुशंसित समस्याएँ', mr: 'शिफारस केलेल्या समस्या' },
  'std.myTeams': { en: 'My teams & projects', hi: 'मेरी टीमें और प्रोजेक्ट', mr: 'माझे संघ व प्रकल्प' },
  'std.saved': { en: 'Saved problems', hi: 'सहेजी गई समस्याएँ', mr: 'जतन केलेल्या समस्या' },
  'std.strength': { en: 'Profile strength', hi: 'प्रोफ़ाइल मजबूती', mr: 'प्रोफाइल मजबूती' },
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
