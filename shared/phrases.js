import {extraDefinitions,extraTranslations} from './extended-phrases.js';
// Common polite forms, not literal word-for-word equivalents. Romanizations are reading aids.
const basics=[['thanks','Thank you'],['hello','Hello'],['goodbye','Goodbye'],['please','Please'],['excuse','Excuse me'],['sorry','Sorry'],['yes','Yes'],['no','No']];
export const phraseDefinitions=[...basics.map(([key,name])=>({key,name,group:'Essentials'})),...extraDefinitions.map(([key,name,group])=>({key,name,group}))];
export const phraseKeys=phraseDefinitions.map(p=>p.key);
export const phraseNames=Object.fromEntries(phraseDefinitions.map(p=>[p.key,p.name]));
export const languageRows=[
 ['en','English','en-US',['Thank you','Hello','Goodbye','Please','Excuse me','Sorry','Yes','No']],
 ['es','Spanish','es-MX',['Gracias','Hola','Adiós','Por favor','Disculpe','Lo siento','Sí','No']],
 ['fr','French','fr-FR',['Merci','Bonjour','Au revoir','S’il vous plaît','Excusez-moi','Pardon','Oui','Non']],
 ['de','German','de-DE',['Danke','Hallo','Auf Wiedersehen','Bitte','Entschuldigung','Es tut mir leid','Ja','Nein']],
 ['it','Italian','it-IT',['Grazie','Ciao','Arrivederci','Per favore','Mi scusi','Mi dispiace','Sì','No']],
 ['pt','Portuguese','pt-BR',['Obrigado / Obrigada','Olá','Tchau','Por favor','Com licença','Desculpe','Sim','Não']],
 ['zh','Mandarin','zh-CN',['谢谢|Xièxie','你好|Nǐ hǎo','再见|Zàijiàn','请|Qǐng','不好意思|Bù hǎoyìsi','对不起|Duìbuqǐ','是|Shì','不是|Bú shì']],
 ['yue','Cantonese','zh-HK',['多謝|Do1 ze6','你好|Nei5 hou2','再見|Zoi3 gin3','唔該|M4 goi1','唔好意思|M4 hou2 ji3 si1','對唔住|Deoi3 m4 zyu6','係|Hai6','唔係|M4 hai6']],
 ['vi','Vietnamese','vi-VN',['Cảm ơn','Xin chào','Tạm biệt','Làm ơn','Xin lỗi','Xin lỗi','Vâng','Không']],
 ['tl','Tagalog','fil-PH',['Salamat','Kumusta','Paalam','Pakiusap','Makikiraan po','Pasensya na','Oo','Hindi']],
 ['ko','Korean','ko-KR',['감사합니다|Gamsahamnida','안녕하세요|Annyeonghaseyo','안녕히 가세요|Annyeonghi gaseyo','부탁합니다|Butakhamnida','실례합니다|Sillyehamnida','죄송합니다|Joesonghamnida','네|Ne','아니요|Aniyo']],
 ['ja','Japanese','ja-JP',['ありがとうございます|Arigatō gozaimasu','こんにちは|Konnichiwa','さようなら|Sayōnara','お願いします|Onegaishimasu','すみません|Sumimasen','ごめんなさい|Gomennasai','はい|Hai','いいえ|Iie']],
 ['ar','Arabic','ar-SA',['شكراً|Shukran','مرحباً|Marḥaban','مع السلامة|Maʿa s-salāma','من فضلك|Min faḍlik','عفواً|ʿAfwan','آسف / آسفة|Āsif / āsifa','نعم|Naʿam','لا|Lā']],
 ['he','Hebrew','he-IL',['תודה|Toda','שלום|Shalom','להתראות|Lehitraot','בבקשה|Bevakasha','סליחה|Slicha','סליחה|Slicha','כן|Ken','לא|Lo']],
 ['hi','Hindi','hi-IN',['धन्यवाद|Dhanyavād','नमस्ते|Namaste','अलविदा|Alvidā','कृपया|Kripayā','माफ़ कीजिए|Māf kījiye','माफ़ कीजिए|Māf kījiye','हाँ|Hā̃','नहीं|Nahī̃']],
 ['pa','Punjabi','pa-IN',['ਧੰਨਵਾਦ|Dhanvād','ਸਤ ਸ੍ਰੀ ਅਕਾਲ|Sat srī akāl','ਅਲਵਿਦਾ|Alvidā','ਕਿਰਪਾ ਕਰਕੇ|Kirpā karke','ਮਾਫ਼ ਕਰਨਾ|Māf karnā','ਮਾਫ਼ ਕਰਨਾ|Māf karnā','ਹਾਂ|Hā̃','ਨਹੀਂ|Nahī̃']],
 ['ur','Urdu','ur-PK',['شکریہ|Shukriya','السلام علیکم|As-salāmu ʿalaykum','خدا حافظ|Khudā hāfiz','براہ کرم|Barāh-e karam','معاف کیجیے|Muāf kījiye','معاف کیجیے|Muāf kījiye','جی ہاں|Jī hā̃','نہیں|Nahī̃']],
 ['bn','Bengali','bn-BD',['ধন্যবাদ|Dhonnobād','নমস্কার|Nomoshkār','বিদায়|Bidāy','দয়া করে|Doyā kore','মাফ করবেন|Māf korben','দুঃখিত|Dukhkhito','হ্যাঁ|Hyã','না|Nā']],
 ['ru','Russian','ru-RU',['Спасибо|Spasibo','Здравствуйте|Zdravstvuyte','До свидания|Do svidaniya','Пожалуйста|Pozhaluysta','Извините|Izvinite','Простите|Prostite','Да|Da','Нет|Net']],
 ['pl','Polish','pl-PL',['Dziękuję','Dzień dobry','Do widzenia','Proszę','Przepraszam','Przepraszam','Tak','Nie']],
 ['ro','Romanian','ro-RO',['Mulțumesc','Bună','La revedere','Vă rog','Scuzați-mă','Îmi pare rău','Da','Nu']],
 ['uk','Ukrainian','uk-UA',['Дякую|Diakuiu','Добрий день|Dobryi den','До побачення|Do pobachennia','Будь ласка|Bud laska','Перепрошую|Pereproshuiu','Вибачте|Vybachte','Так|Tak','Ні|Ni']],
 ['el','Greek','el-GR',['Ευχαριστώ|Efcharistó','Γεια σας|Yia sas','Αντίο|Adío','Παρακαλώ|Parakaló','Με συγχωρείτε|Me sinchoríte','Συγγνώμη|Signómi','Ναι|Ne','Όχι|Óchi']],
 ['tr','Turkish','tr-TR',['Teşekkür ederim','Merhaba','Hoşça kalın','Lütfen','Affedersiniz','Özür dilerim','Evet','Hayır']],
 ['fa','Persian','fa-IR',['ممنون|Mamnun','سلام|Salām','خداحافظ|Khodā hāfez','لطفاً|Lotfan','ببخشید|Bebakhshid','متأسفم|Moteassefam','بله|Bale','نه|Na']],
 ['sv','Swedish','sv-SE',['Tack','Hej','Hej då','Snälla','Ursäkta','Förlåt','Ja','Nej']],
 ['nl','Dutch','nl-NL',['Dank u wel','Hallo','Tot ziens','Alstublieft','Pardon','Het spijt me','Ja','Nee']],
 ['id','Indonesian','id-ID',['Terima kasih','Halo','Sampai jumpa','Tolong','Permisi','Maaf','Ya','Tidak']],
 ['ms','Malay','ms-MY',['Terima kasih','Helo','Selamat tinggal','Tolong','Tumpang lalu','Maaf','Ya','Tidak']],
 ['sw','Swahili','sw-KE',['Asante','Hujambo','Kwaheri','Tafadhali','Samahani','Samahani','Ndiyo','Hapana']],
 ['th','Thai','th-TH',['ขอบคุณ|Khòp khun','สวัสดี|Sà-wàt-dii','ลาก่อน|Laa gòn','กรุณา|Kà-rú-naa','ขอโทษ|Khǎaw thôot','ขอโทษ|Khǎaw thôot','ใช่|Châi','ไม่ใช่|Mâi châi']],
 ['ta','Tamil','ta-IN',['நன்றி|Naṉṟi','வணக்கம்|Vaṇakkam','போய் வருகிறேன்|Pōy varukiṟēṉ','தயவுசெய்து|Tayavuceytu','மன்னிக்கவும்|Maṉṉikkavum','மன்னிக்கவும்|Maṉṉikkavum','ஆம்|Ām','இல்லை|Illai']],
 ['ht','Haitian Creole','ht-HT',['Mèsi','Bonjou','Orevwa','Tanpri','Eskize m','Mwen regrèt sa','Wi','Non']],
 ['af','Afrikaans','af-ZA',['Dankie','Hallo','Totsiens','Asseblief','Verskoon my','Ek is jammer','Ja','Nee']],
 ['zu','Zulu','zu-ZA',['Ngiyabonga','Sawubona','Hamba kahle','Ngiyacela','Uxolo','Ngiyaxolisa','Yebo','Cha']],
 ['xh','Xhosa','xh-ZA',['Enkosi','Molo','Hamba kakuhle','Ndicela','Uxolo','Ndixolele','Ewe','Hayi']]
];
export const languages=Object.fromEntries(languageRows.map(([id,name,voice,phrases])=>{
 const values=[...phrases,...extraTranslations[id]];
 if(values.length!==phraseKeys.length)throw Error(`Incomplete phrasebook: ${id}`);
 return [id,{id,name,voice,phrases:Object.fromEntries(phraseKeys.map((key,i)=>{const [native,roman='']=values[i].split('|');return [key,{native,roman}];}))}];
}));
const southernGreetingNotes={zu:'Sawubona greets one person; Sanibonani greets several. Hamba kahle is said to someone leaving; Sala kahle to someone staying.',xh:'Molo greets one person; Molweni greets several. Hamba kakuhle is said to someone leaving; Sala kakuhle to someone staying.'};
export const notes={...southernGreetingNotes,zh:'Mandarin example. Census combines Mandarin, Cantonese and other Chinese languages; the percentage is not Mandarin alone.',yue:'Jyutping numbers indicate tones. 多謝 is for gifts or favors; 唔該 is commonly used to thank someone for service.',pt:'Obrigado is typically used by masculine speakers; obrigada by feminine speakers.',ko:'Polite forms. This goodbye is said to someone leaving; say 안녕히 계세요 when you leave someone staying.',ar:'General Modern Standard Arabic forms; local dialects vary. Some polite forms vary with the person addressed.',he:'Common everyday forms. Shalom can also mean goodbye.',hi:'General polite forms; greetings vary by community.',pa:'A common Punjabi greeting, particularly in Sikh communities. Other greetings vary by community.',bn:'Nomoshkar is one common greeting; assalamu alaikum is also widely used.',ja:'Polite thank-you. Sayōnara can suggest a longer goodbye; またね (mata ne) is a casual “see you.”',th:'Politeness particles such as ครับ or ค่ะ are often added according to the speaker.',ta:'The goodbye means “I will go and return.”',tl:'Add po for politeness where appropriate. Paki- is often attached to a request rather than used alone.',vi:'Pronouns and polite particles depend on age and relationship. Vâng is a polite northern “yes.”',sw:'Hujambo is a greeting to one person; greetings and responses vary.',ur:'The greeting is common in Muslim communities; greetings vary.',default:'Common learning forms. Context, region, formality and the people speaking can change the best wording. Romanization is approximate, not a phonetic transcription.'};
