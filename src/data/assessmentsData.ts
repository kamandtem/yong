import { ArchetypeId, ArchetypeScore } from '../types';

export interface AssessmentQuestion {
  id: string;
  archetypeId?: ArchetypeId;
  dimension?: 'emotionalRegulation' | 'boundarySetting' | 'intellectualIndependence' | 'selfCompassion' | 'valueClarity' | 'actionPersistence';
  text: string;
  options: { label: string; score: number }[];
}

export interface AssessmentInfo {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  estimatedMinutes: number;
  category: 'archetypes' | 'psychological_dimensions' | 'relationships';
  theoreticalFoundation: string;
  scientificLimitations: string;
  questionsCount: number;
  questions: AssessmentQuestion[];
  instructions: string;
}

export const ARCHETYPES_META: Record<ArchetypeId, {
  nameFa: string;
  coreDesire: string;
  coreFear: string;
  constructiveAspect: string;
  shadowAspect: string;
  summary: string;
  color: string;
}> = {
  innocent: {
    nameFa: 'معصوم (Innocent)',
    coreDesire: 'تجربه بهشت، امنیت، پاکی و شادمانی بی‌پایان',
    coreFear: 'انجام کار اشتباه یا مجازات شدن برای گناه',
    constructiveAspect: 'خوش‌بینی، ایمان، سادگی زلال و امید پایدار در تاریکی‌ها',
    shadowAspect: 'انکار واقعیت‌های تلخ، زودباوری مفرط و فرار از مسئولیت با نقش کودک بی‌پناه',
    summary: 'معصوم در پی ایمان و سادگی پاک است و جهان را مکانی امن و پر از شگفتی می‌بیند.',
    color: '#60A5FA'
  },
  orphan: {
    nameFa: 'یتیم / بی‌پناه (Orphan / Realist)',
    coreDesire: 'احساس تعلق دوباره، حفاظت و درک رنج‌های جهان',
    coreFear: 'رها شدن، طرد شدن و فریب خوردن مجدد',
    constructiveAspect: 'واقع‌بینی عمیق، همدلی با دردمندان، پایداری و مقاومت در برابر دشواری‌ها',
    shadowAspect: 'سندرم قربانی بودن همیشگی، تلخ‌کامی، بدبینی مزمن و انتظار ناامیدی',
    summary: 'یتیم واقع‌گرای رنج‌کشیده‌ای است که به همه ما یادآوری می‌کند آسیب‌پذیری جزئی از زیستن است.',
    color: '#9CA3AF'
  },
  warrior: {
    nameFa: 'جنگجو (Warrior)',
    coreDesire: 'اثبات شایستگی، دفاع از حق، پیروزی و اراده مقتدر',
    coreFear: 'ضعف، ناتوانی، تسلیم شدن و شکست تحقیرآمیز',
    constructiveAspect: 'شجاعت، انضباط پولادین، انگیزه تسخیرناپذیر و حمایت از آسیب‌پذیران',
    shadowAspect: 'خشونت، نگاه صفر و صدی، تلقی همگان به عنوان دشمن و خستگی فرسایشی',
    summary: 'جنگجو نیروی اراده و اقدام است که در برابر موانع سر خم نمی‌کند و هدف را فتح می‌کند.',
    color: '#EF4444'
  },
  caregiver: {
    nameFa: 'حامی (Caregiver)',
    coreDesire: 'محافظت از دیگران، مهرورزی و بخشش بی‌دریغ',
    coreFear: 'خودخواهی، ناسپاسی و رنج کشیدن عزیزان',
    constructiveAspect: 'سخاوت، شفقت بی‌قیدوشرط، مهربانی اصیل و التیام‌بخشی زخم‌ها',
    shadowAspect: 'شهیدنمایی، کنترل‌گری با محبت تحمیلی، فرسودگی عاطفی و نادیده گرفتن خود',
    summary: 'حامی به جهان گرمی و پناه می‌بخشد و مظهر مراقبت مادرانه و ایثار خالصانه است.',
    color: '#10B981'
  },
  seeker: {
    nameFa: 'جستجوگر (Seeker)',
    coreDesire: 'کشف هویت حقیقی، استقلال مطلق و تجربه افق‌های تازه',
    coreFear: 'به دام افتادن، همرنگی کورکورانه با جماعت و رکود درونی',
    constructiveAspect: 'استقلال فکری، اشتیاق به حقیقت، اصالت و آمادگی برای پا نهادن در ناشناخته‌ها',
    shadowAspect: 'سرگردانی بی‌پایان، ناتوانی در تعهد عمیق، انزوای خودخواسته و بی‌قراری همیشگی',
    summary: 'جستجوگر مسافر سرزمین‌های ناشناخته است که هیچ‌گاه به وضعیت موجود راضی نمی‌شود.',
    color: '#F59E0B'
  },
  destroyer: {
    nameFa: 'دگرگون‌ساز / نابودگر (Destroyer)',
    coreDesire: 'دگرگونی ریشه‌ای، پاکسازی ساختارهای مرده و زایش مجدد',
    coreFear: 'راکد ماندن در پوسیدگی و بی‌اثری',
    constructiveAspect: 'شهامت رها کردن کهنگی‌ها، پذیرش پایان‌ها، شجاعت تحول و فروپاشی توهمات',
    shadowAspect: 'تخریبگری کورکورانه، طغیان بدون هدف، آسیب رساندن به روابط سالم و ویرانگری خود',
    summary: 'دگرگون‌ساز مانند آتش جنگل است که شاخه‌های خشکیده را می‌سوزاند تا جوانه‌های نو سر برآورند.',
    color: '#7C3AED'
  },
  lover: {
    nameFa: 'عاشق (Lover)',
    coreDesire: 'ایجاد صمیمیت عمیق، درک زیبایی، شور زیستن و اتصال پیوندها',
    coreFear: 'تنهایی، طرد شدن، نامحبوب بودن و سردی عاطفی',
    constructiveAspect: 'اشتیاق پرشور، قدردانی از هنر و زیبایی، صمیمیت اصیل و تعهد قلبی',
    shadowAspect: 'وابستگی مرضی، وسواس جلب توجه، نوسان شدید خلقی با تایید یا بی‌محلی دیگران',
    summary: 'عاشق در پی وصل و یگانگی است و به لحظات زندگی عطر شوریدگی و معنا می‌بخشد.',
    color: '#EC4899'
  },
  creator: {
    nameFa: 'آفرینشگر (Creator)',
    coreDesire: 'خلق زیبایی و آثاری ماندگار و اصیل از دل بینش درونی',
    coreFear: 'بی‌معنایی، تقلید، سطحی بودن و ناتوانی در تجسم رویاها',
    constructiveAspect: 'نوآوری درخشان، تخیل بارور، بیانگری هنرمندانه و حل خلاق مسائل',
    shadowAspect: 'کمال‌گرایی فلج‌کننده، اضطراب ناتمام ماندن کارها و نخوت فکری',
    summary: 'آفرینشگر جهان را بوم نقاشی خود می‌داند و ایده‌های نادیده را به واقعیت تبدیل می‌کند.',
    color: '#8B5CF6'
  },
  ruler: {
    nameFa: 'حاکم (Ruler)',
    coreDesire: 'ایجاد نظم، رفاه، اقتدار خردمندانه و ساختاری استوار',
    coreFear: 'آشوب، از دست دادن کنترل و فروپاشی نظم',
    constructiveAspect: 'رهبری مسئولانه، ساماندهی هرج‌ومرج، توانایی حمایت گسترده و ثبات ساختاری',
    shadowAspect: 'استبداد، کنترل‌گری وسواس‌گونه، عدم اعتماد به دیگران و گوش ندادن به اعتراضات',
    summary: 'حاکم ستون اقتدار و نظم در جامعه است و به هرج‌ومرج ساختاری امن می‌بخشد.',
    color: '#3B82F6'
  },
  magician: {
    nameFa: 'جادوگر (Magician)',
    coreDesire: 'درک قوانین بنیادین جهان و دگرگون ساختن واقعیت با تغییر آگاهی',
    coreFear: 'پیامدهای منفی ناخواسته و سقوط در جهل',
    constructiveAspect: 'شهود ژرف، درک پیوندهای نادیده روان، تحول شفابخش و حل مسائل به ظاهر ناممکن',
    shadowAspect: 'دستکاری روانی دیگران (Manipulation)، فریبکاری، غرور معنوی و جادوی سیاه فریب',
    summary: 'جادوگر با کیمیای ذهن، رنج‌ها و تعارضات درون را به طلا و حکمت تبدیل می‌کند.',
    color: '#6366F1'
  },
  sage: {
    nameFa: 'فرزانه (Sage)',
    coreDesire: 'کشف حقیقت مطلق، درک خرد جهان و رهایی از توهم و نادانی',
    coreFear: 'فریب‌خوردگی، گمراهی و جهل تحمیلی',
    constructiveAspect: 'تحلیل دقیق، بی‌طرفی منصفانه، خرد عمیق، کنجکاوی علمی و روشن‌بینی',
    shadowAspect: 'برج عاج‌نشینی، بی‌عملی و تحلیل فلج‌کننده (Analysis Paralysis)، جدایی سرد از احساسات',
    summary: 'فرزانه در پی حقیقت و نور خرد است و انسان‌ها را به روشنایی دانش رهنمون می‌شود.',
    color: '#14B8A6'
  },
  jester: {
    nameFa: 'دلقک / بازیگوش (Jester)',
    coreDesire: 'زیستن در لحظه اکنون، شوخ‌طبعی، بازیگوشی و شادی ناب',
    coreFear: 'کسالت، رنج بی‌حاصل و جدی گرفتن بیش از حد توهمات جهان',
    constructiveAspect: 'تاب‌آوری بالا با طنز، شکستن تابوها، رهایی از تکلفات و شاداب کردن دل‌ها',
    shadowAspect: 'تمسخر زخم‌های جدی، فرار با لودگی از مسئولیت و پنهان کردن اندوه در پشت لبخند مصنوعی',
    summary: 'دلقک حقیقت‌های تلخ را با شربت شیرین طنز بیان می‌کند و جهان را از خشکی نجات می‌دهد.',
    color: '#F97316'
  }
};

const LIKERT_OPTIONS = [
  { label: 'کاملاً مخالفم', score: 1 },
  { label: 'مخالفم', score: 2 },
  { label: 'تا حدی / خنثی', score: 3 },
  { label: 'موافقم', score: 4 },
  { label: 'کاملاً موافقم', score: 5 }
];

export const ARCHETYPE_ASSESSMENT: AssessmentInfo = {
  id: 'ass-archetypes',
  title: 'آزمون جامع ۱۲ کهن‌الگو (مدل پیرسون-یونگ)',
  subtitle: 'کشف بازیگران نادیده صحنه روان، توانمندی‌ها و نقاط سایه',
  badge: 'روان‌شناسی تحلیلی',
  estimatedMinutes: 12,
  category: 'archetypes',
  theoreticalFoundation: 'برگرفته از کارل گوستاو یونگ و چارچوب ۱۲ کهن‌الگوی رشدی دکتر کارول پیرسون (Carol Pearson).',
  scientificLimitations: 'این آزمون یک ابزار قطعی بالینی برای تشخیص بیماری یا طبقه صلب شخصیتی نیست؛ بلکه چارچوبی نمادین و تأملی برای افزایش خودآگاهی و غنای روایت زندگی شماست.',
  questionsCount: 24,
  instructions: 'به پرسش‌های زیر بر اساس احساس و رفتار واقعی کنونی خود پاسخ دهید، نه آنچه ترجیح می‌دهید باشید. اولین حسی که به ذهنتان می‌رسد معمولاً صادقانه‌ترین پاسخ است.',
  questions: [
    // Innocent
    { id: 'q1', archetypeId: 'innocent', text: 'باور دارم که در نهایت خوبی بر جهان پیروز می‌شود و زندگی در ذات خود مهربان است.', options: LIKERT_OPTIONS },
    { id: 'q2', archetypeId: 'innocent', text: 'گاهی ترجیح می‌دهم از اخبار تلخ و تعارض‌ها چشم‌پوشی کنم تا آرامش درونی‌ام بر هم نخورد.', options: LIKERT_OPTIONS },
    // Orphan
    { id: 'q3', archetypeId: 'orphan', text: 'به سادگی به هر وعده یا سخن شیرینی اعتماد نمی‌کنم و زندگی را محلی پر از رنج و آزمون می‌دانم.', options: LIKERT_OPTIONS },
    { id: 'q4', archetypeId: 'orphan', text: 'اغلب حس می‌کنم در عمق جانم تنها هستم و فقط خودم باید گلیم خودم را از آب بیرون بکشم.', options: LIKERT_OPTIONS },
    // Warrior
    { id: 'q5', archetypeId: 'warrior', text: 'وقتی مانعی سد راهم می‌شود، انرژی و تمرکزم چند برابر می‌شود تا با جنگندگی آن را فتح کنم.', options: LIKERT_OPTIONS },
    { id: 'q6', archetypeId: 'warrior', text: 'از دیدن بی‌عدالتی خونم به جوش می‌آید و بی‌درنگ برای دفاع از مظلومان وارد عمل می‌شوم.', options: LIKERT_OPTIONS },
    // Caregiver
    { id: 'q7', archetypeId: 'caregiver', text: 'رفع نیازها و تسکین رنج اطرافیان برای من بسیار ارجح‌تر و لذت‌بخش‌تر از خواسته‌های شخصی‌ام است.', options: LIKERT_OPTIONS },
    { id: 'q8', archetypeId: 'caregiver', text: 'گاهی حتی وقتی رمقی برایم نمانده، باز هم به دیگران کمک می‌کنم تا مبادا حس کنند تنها مانده‌اند.', options: LIKERT_OPTIONS },
    // Seeker
    { id: 'q9', archetypeId: 'seeker', text: 'همرنگی با هنجارهای سنتی و روزمرگی‌های تکراری به من حس خفگی و اسارت می‌دهد.', options: LIKERT_OPTIONS },
    { id: 'q10', archetypeId: 'seeker', text: 'حاضرم سختی مسیرهای ناشناخته را به جان بخرم اما مسیر شخصی و اصیل خود را کشف کنم.', options: LIKERT_OPTIONS },
    // Destroyer
    { id: 'q11', archetypeId: 'destroyer', text: 'وقتی ساختار، رابطه یا شرایطی پوسیده و بی‌خاصیت می‌شود، شهامت دارم که آن را از ریشه قطع کنم.', options: LIKERT_OPTIONS },
    { id: 'q12', archetypeId: 'destroyer', text: 'تجربه‌های سخت بحرانی و فروپاشی در زندگی به من یاد داده‌اند که ویرانی مقدمه زایش دوباره است.', options: LIKERT_OPTIONS },
    // Lover
    { id: 'q13', archetypeId: 'lover', text: 'صمیمیت قلبی، زیبایی‌های حسی، عشق و شور زیستن بالاترین اولویت و معنا در زندگی من هستند.', options: LIKERT_OPTIONS },
    { id: 'q14', archetypeId: 'lover', text: 'سردی یا طرد شدن از سوی کسانی که دوستشان دارم برای من تلخ‌ترین تجربه ممکن است.', options: LIKERT_OPTIONS },
    // Creator
    { id: 'q15', archetypeId: 'creator', text: 'پیوسته ایده‌های تازه، نوآوری‌ها و اشتیاق خلق چیزهایی جدید در ذهنم می‌جوشد.', options: LIKERT_OPTIONS },
    { id: 'q16', archetypeId: 'creator', text: 'اگر در کاری نتوانم امضای شخصی و خلاقیت خودم را وارد کنم، احساس بی‌معنایی می‌کنم.', options: LIKERT_OPTIONS },
    // Ruler
    { id: 'q17', archetypeId: 'ruler', text: 'در هرج‌ومرج و بحران‌ها ناخودآگاه ابتکار عمل را به دست می‌گیرم و اوضاع را سامان می‌دهم.', options: LIKERT_OPTIONS },
    { id: 'q18', archetypeId: 'ruler', text: 'نظم، ساختارمندی، مسئولیت‌پذیری شفاف و ثبات برای من ارزش فوق‌العاده‌ای دارد.', options: LIKERT_OPTIONS },
    // Magician
    { id: 'q19', archetypeId: 'magician', text: 'باور دارم که با تغییر نگرش، نیت و آگاهی درونی می‌توان واقعیت بیرونی را متحول ساخت.', options: LIKERT_OPTIONS },
    { id: 'q20', archetypeId: 'magician', text: 'شهود درونی قوی دارم و معمولاً پیش از رخ دادن اتفاقات، نبض احساسی ماجرا را لمس می‌کنم.', options: LIKERT_OPTIONS },
    // Sage
    { id: 'q21', archetypeId: 'sage', text: 'عاشق یادگیری، مطالعه، پژوهش عمیق و فهم ریشه‌های ناپیدای پدیده‌ها هستم.', options: LIKERT_OPTIONS },
    { id: 'q22', archetypeId: 'sage', text: 'پیش از هر قضاوتی سعی می‌کنم بی‌طرفانه داده‌ها و ابعاد مختلف مسئله را تحلیل کنم.', options: LIKERT_OPTIONS },
    // Jester
    { id: 'q23', archetypeId: 'jester', text: 'طنز، خنده و شوخ‌طبعی بهترین شیوه من برای التیام رنج‌ها و لذت بردن از لحظه حال است.', options: LIKERT_OPTIONS },
    { id: 'q24', archetypeId: 'jester', text: 'کسانی که زندگی و عناوین ظاهری را زیادی جدی می‌گیرند، برایم مضحک به نظر می‌رسند.', options: LIKERT_OPTIONS },
  ]
};

export const COMPREHENSIVE_AWARENESS_ASSESSMENT: AssessmentInfo = {
  id: 'ass-dimensions',
  title: 'ارزیابی جامع ۶ بعد تعادل روان و خودآگاهی',
  subtitle: 'سنجش شاخص‌های تنظیم هیجان، مرزبندی، استقلال فکری و شفافیت ارزش‌ها',
  badge: 'روان‌شناسی شناختی-رفتاری',
  estimatedMinutes: 8,
  category: 'psychological_dimensions',
  theoreticalFoundation: 'بر مبنای الگوهای خودآگاهی در روان‌شناسی شناختی (CBT)، مدل انعطاف‌پذیری ACT و مهارت‌های ارتباطی قاطعانه.',
  scientificLimitations: 'این پرسش‌نامه وضعیت فعلی مهارت‌های روانی شما را نشان می‌دهد و ابزار تشخیصی اختلالات روان‌پزشکی نیست. نمرات مهارت‌ها با آموزش و تمرین ارتقا می‌یابند.',
  questionsCount: 18,
  instructions: 'وضعیت رفتاری خود در یک ماه گذشته را با گزینه‌ها مقایسه کرده و صادقانه‌ترین نمره را انتخاب فرمایید.',
  questions: [
    // Emotional Regulation
    { id: 'dim1', dimension: 'emotionalRegulation', text: 'هنگام تجربه احساسات شدید (مانند خشم یا اضطراب)، می‌توانم چند ثانیه مکث کنم و کنترل رفتارم را حفظ کنم.', options: LIKERT_OPTIONS },
    { id: 'dim2', dimension: 'emotionalRegulation', text: 'می‌توانم ریشه احساسات بدم را بدون سرکوب کردن یا پرخاشگری نامتناسب شناسایی کنم.', options: LIKERT_OPTIONS },
    { id: 'dim3', dimension: 'emotionalRegulation', text: 'پس از رخ دادن یک ناکامی، در زمان معقولی آرامش و تعادل درونی‌ام را بازمی‌یابم.', options: LIKERT_OPTIONS },

    // Boundary Setting
    { id: 'dim4', dimension: 'boundarySetting', text: 'اگر کاری را نخواهم یا نتوانم انجام دهم، می‌توانم محترمانه و قاطعانه بگویم «نه».', options: LIKERT_OPTIONS },
    { id: 'dim5', dimension: 'boundarySetting', text: 'پس از نه گفتن به دیگران، دچار عذاب وجدان یا اضطراب طولانی‌مدت نمی‌شوم.', options: LIKERT_OPTIONS },
    { id: 'dim6', dimension: 'boundarySetting', text: 'به دیگران اجازه نمی‌دهم به وقت، خلوت یا ارزش‌های من تجاوز کنند.', options: LIKERT_OPTIONS },

    // Intellectual Independence
    { id: 'dim7', dimension: 'intellectualIndependence', text: 'شهامت دارم که نظری خلاف جریان غالب گروه یا خانواده داشته باشم و پای آن بایستم.', options: LIKERT_OPTIONS },
    { id: 'dim8', dimension: 'intellectualIndependence', text: 'تصمیم‌های مهم زندگی‌ام (تحصیل، شغل، روابط) را بر اساس باورهای اصیل خودم می‌گیرم، نه راضی نگه داشتن دیگران.', options: LIKERT_OPTIONS },
    { id: 'dim9', dimension: 'intellectualIndependence', text: 'قضاوت یا نگاه منفی غریبه‌ها روی ارزشمندی درونی من اثر عمیق و تخریب‌کننده ندارد.', options: LIKERT_OPTIONS },

    // Self Compassion
    { id: 'dim10', dimension: 'selfCompassion', text: 'هنگامی که مرتکب اشتباهی می‌شوم، با خودم مانند یک دوست مهربان صحبت می‌کنم، نه یک سرزنش‌گر بی‌رحم.', options: LIKERT_OPTIONS },
    { id: 'dim11', dimension: 'selfCompassion', text: 'نواقص و شکست‌هایم را به عنوان بخشی طبیعی از تجربه مشترک انسانی می‌پذیرم.', options: LIKERT_OPTIONS },
    { id: 'dim12', dimension: 'selfCompassion', text: 'برای شادابی و استراحت روح و جسمم بدون احساس گناه وقت اختصاص می‌دهم.', options: LIKERT_OPTIONS },

    // Value Clarity
    { id: 'dim13', dimension: 'valueClarity', text: 'به وضوح می‌دانم مهم‌ترین اولویت‌ها و اصول غیرقابل مذاکره من در زندگی چیستند.', options: LIKERT_OPTIONS },
    { id: 'dim14', dimension: 'valueClarity', text: 'برنامه‌های روزمره‌ام با آنچه عمیقاً برایم ارزشمند است هم‌راستا هستند.', options: LIKERT_OPTIONS },
    { id: 'dim15', dimension: 'valueClarity', text: 'در دوراهی‌های دشوار زندگی، قطب‌نمای ارزش‌هایم به من قدرت تصمیم‌گیری می‌دهد.', options: LIKERT_OPTIONS },

    // Action Persistence
    { id: 'dim16', dimension: 'actionPersistence', text: 'وقتی تصمیمی برای تغییر یا یادگیری می‌گیرم، حتی بعد از فرونشستن تب انگیزه اولیه، به آن متعهد می‌مانم.', options: LIKERT_OPTIONS },
    { id: 'dim17', dimension: 'actionPersistence', text: 'اهداف بزرگم را به عادات کوچک روزانه تبدیل می‌کنم و از اهمال‌کاری فرار می‌کنم.', options: LIKERT_OPTIONS },
    { id: 'dim18', dimension: 'actionPersistence', text: 'در برابر موانع سرسخت ناامید نمی‌شوم و راه‌های جایگزین را جستجو می‌کنم.', options: LIKERT_OPTIONS },
  ]
};
