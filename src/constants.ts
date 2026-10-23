export interface Service {
  id: string;
  title: { dr: string; ps: string; en: string };
  description: { dr: string; ps: string; en: string };
  price: { dr: string; ps: string; en: string };
  category: 'ai' | 'card' | 'graphic';
  image: string;
}

export interface PortfolioItem {
  id: string;
  title: { dr: string; ps: string; en: string };
  category: { dr: string; ps: string; en: string };
  image: string;
}

export const SERVICES: Service[] = [
  {
    id: '1',
    title: { dr: 'ChatGPT Plus', ps: 'ChatGPT Plus', en: 'ChatGPT Plus' },
    description: {
      dr: 'فعال‌سازی اکانت پرمیوم چت‌جی‌پی‌تی با دسترسی به GPT-4o و تمامی امکانات پیشرفته.',
      ps: 'د ChatGPT پریمیم اکاونټ فعالول د GPT-4o او ټولو پرمختللو اسانتیاوو سره.',
      en: 'Activation of ChatGPT Premium account with access to GPT-4o and all advanced features.'
    },
    price: { dr: '۲۰ دلار / ماه', ps: '۲۰ ډالره / میاشت', en: '$20 / Month' },
    category: 'ai',
    image: '/images/service-1.jpg'
  },
  {
    id: '2',
    title: { dr: 'Midjourney Pro', ps: 'Midjourney Pro', en: 'Midjourney Pro' },
    description: {
      dr: 'اشتراک حرفه‌ای میدجورنی برای خلق تصاویر خیره‌کننده با هوش مصنوعی.',
      ps: 'د هوښیار ذکاوت په واسطه د حیرانوونکو انځورونو جوړولو لپاره د میډجرني مسلکي ګډون.',
      en: 'Professional Midjourney subscription for creating stunning AI-generated images.'
    },
    price: { dr: '۳۰ دلار / ماه', ps: '۳۰ ډالره / میاشت', en: '$30 / Month' },
    category: 'ai',
    image: '/images/service-2.jpg'
  },
  {
    id: '7',
    title: { dr: 'Google Gemini Advanced', ps: 'Google Gemini Advanced', en: 'Google Gemini Advanced' },
    description: {
      dr: 'دسترسی به قدرتمندترین مدل هوش مصنوعی گوگل با قابلیت‌های تحلیل داده و کدنویسی.',
      ps: 'د ګوګل ترټولو پیاوړي هوښیار ذکاوت ماډل ته لاسرسی د معلوماتو تحلیل او کوډ کولو وړتیاوو سره.',
      en: 'Access to Google\'s most powerful AI model with data analysis and coding capabilities.'
    },
    price: { dr: '۲۰ دلار / ماه', ps: '۲۰ ډالره / میاشت', en: '$20 / Month' },
    category: 'ai',
    image: '/images/service-3.jpg'
  },
  {
    id: '8',
    title: { dr: 'Claude Pro (Anthropic)', ps: 'Claude Pro (Anthropic)', en: 'Claude Pro (Anthropic)' },
    description: {
      dr: 'هوش مصنوعی کلود با قابلیت درک عمیق متون طولانی و استدلال منطقی فوق‌العاده.',
      ps: 'کلاوډ هوښیار ذکاوت د اوږدو متنونو ژور درک او فوق العاده منطقي استدلال وړتیا سره.',
      en: 'Claude AI with deep understanding of long texts and exceptional logical reasoning.'
    },
    price: { dr: '۲۰ دلار / ماه', ps: '۲۰ ډالره / میاشت', en: '$20 / Month' },
    category: 'ai',
    image: '/images/service-4.jpg'
  },
  {
    id: '9',
    title: { dr: 'Perplexity Pro', ps: 'Perplexity Pro', en: 'Perplexity Pro' },
    description: {
      dr: 'موتور جستجوی هوشمند با پاسخ‌های دقیق و مستند به منابع معتبر.',
      ps: 'هوښیار لټون ماشین د کره ځوابونو او باوري سرچینو سره.',
      en: 'Intelligent search engine with precise answers and documented reliable sources.'
    },
    price: { dr: '۲۰ دلار / ماه', ps: '۲۰ ډالره / میاشت', en: '$20 / Month' },
    category: 'ai',
    image: '/images/service-5.jpg'
  },
  {
    id: '3',
    title: { dr: 'Virtual Visa Card', ps: 'Virtual Visa Card', en: 'Virtual Visa Card' },
    description: {
      dr: 'صدور آنی کارت اعتباری مجازی برای پرداخت‌های بین‌المللی و خرید از سایت‌های خارجی.',
      ps: 'د نړیوالو تادیاتو او له بهرنیو سایټونو څخه د پیرودلو لپاره د مجازی کریډیټ کارت سمدستي صادرول.',
      en: 'Instant issuance of virtual credit cards for international payments and online shopping.'
    },
    price: { dr: 'شروع از ۵ دلار', ps: 'له ۵ ډالرو څخه پیل', en: 'Starting from $5' },
    category: 'card',
    image: '/images/service-6.jpg'
  },
  {
    id: '4',
    title: { dr: 'Mastercard Prepaid', ps: 'Mastercard Prepaid', en: 'Mastercard Prepaid' },
    description: {
      dr: 'مسترکارت مجازی با قابلیت شارژ مجدد برای امنیت بیشتر در خریدهای آنلاین.',
      ps: 'مجازی ماسټر کارټ د بیا چارج کولو وړتیا سره په آنلاین پیرود کې د ډیر امنیت لپاره.',
      en: 'Virtual Mastercard with reloadable capability for enhanced security in online shopping.'
    },
    price: { dr: 'شروع از ۱۰ دلار', ps: 'له ۱۰ ډالرو څخه پیل', en: 'Starting from $10' },
    category: 'card',
    image: '/images/service-7.jpg'
  },
  {
    id: '10',
    title: { dr: 'PayPal Verified Account', ps: 'PayPal Verified Account', en: 'PayPal Verified Account' },
    description: {
      dr: 'افتتاح و وریفای اکانت پی‌پال با مدارک معتبر برای دریافت و ارسال پول.',
      ps: 'د پیسو ترلاسه کولو او لیږلو لپاره د باوري اسنادو سره د پی پال اکاونټ خلاصول او تاییدول.',
      en: 'Opening and verifying PayPal accounts with valid documents for sending and receiving money.'
    },
    price: { dr: 'توافقی', ps: 'توافقي', en: 'Negotiable' },
    category: 'card',
    image: '/images/service-8.jpg'
  },
  {
    id: '11',
    title: { dr: 'Payoneer Account', ps: 'Payoneer Account', en: 'Payoneer Account' },
    description: {
      dr: 'ساخت اکانت پایونیر برای فریلنسرها و دریافت درآمدهای ارزی از سراسر جهان.',
      ps: 'د فریلنسرانو لپاره د پایونیر اکاونټ جوړول او له ټولې نړۍ څخه د اسعارو عاید ترلاسه کول.',
      en: 'Creating Payoneer accounts for freelancers to receive foreign currency earnings worldwide.'
    },
    price: { dr: 'توافقی', ps: 'توافقي', en: 'Negotiable' },
    category: 'card',
    image: '/images/service-9.jpg'
  },
  {
    id: '12',
    title: { dr: 'Wise (TransferWise)', ps: 'Wise (TransferWise)', en: 'Wise (TransferWise)' },
    description: {
      dr: 'افتتاح حساب وایز برای انتقال پول با کمترین کارمزد و نرخ ارز واقعی.',
      ps: 'د لږ تر لږه فیس او ریښتیني تبادلې نرخ سره د پیسو لیږد لپاره د وایز حساب خلاصول.',
      en: 'Opening Wise accounts for money transfers with minimal fees and real exchange rates.'
    },
    price: { dr: 'توافقی', ps: 'توافقي', en: 'Negotiable' },
    category: 'card',
    image: '/images/service-10.jpg'
  },
  {
    id: '13',
    title: { dr: 'Canva Pro', ps: 'Canva Pro', en: 'Canva Pro' },
    description: {
      dr: 'دسترسی به تمامی قالب‌ها، تصاویر و ابزارهای طراحی حرفه‌ای کانوا.',
      ps: 'د کینوا ټولو ټیمپلیټونو، انځورونو او مسلکي ډیزاین وسیلو ته لاسرسی.',
      en: 'Access to all Canva templates, images, and professional design tools.'
    },
    price: { dr: '۱۵ دلار / ماه', ps: '۱۵ ډالره / میاشت', en: '$15 / Month' },
    category: 'ai',
    image: '/images/service-11.jpg'
  },
  {
    id: '14',
    title: { dr: 'CapCut Desktop Pro', ps: 'CapCut Desktop Pro', en: 'CapCut Desktop Pro' },
    description: {
      dr: 'نسخه حرفه‌ای کپ‌کات با افکت‌ها و قابلیت‌های پیشرفته تدوین ویدیو.',
      ps: 'د کیپ کاټ مسلکي نسخه د ویډیو ایډیټ کولو پرمختللي اغیزو او وړتیاوو سره.',
      en: 'Professional CapCut version with advanced video editing effects and features.'
    },
    price: { dr: '۱۰ دلار / ماه', ps: '۱۰ ډالره / میاشت', en: '$10 / Month' },
    category: 'ai',
    image: '/images/service-12.jpg'
  },
  {
    id: '15',
    title: { dr: 'Freepik Premium', ps: 'Freepik Premium', en: 'Freepik Premium' },
    description: {
      dr: 'دانلود نامحدود وکتورها، تصاویر و فایل‌های گرافیکی با کیفیت بالا.',
      ps: 'د لوړ کیفیت ویکتورونو، انځورونو او ګرافیکي فایلونو لامحدود ډاونلوډ.',
      en: 'Unlimited download of high-quality vectors, images, and graphic files.'
    },
    price: { dr: '۱۵ دلار / ماه', ps: '۱۵ ډالره / میاشت', en: '$15 / Month' },
    category: 'ai',
    image: '/images/service-13.jpg'
  },
  {
    id: '16',
    title: { dr: 'Pika Art (AI Video)', ps: 'Pika Art (AI Video)', en: 'Pika Art (AI Video)' },
    description: {
      dr: 'تولید ویدیوهای سینمایی و انیمیشن‌های جذاب با هوش مصنوعی پیکا.',
      ps: 'د پیکا هوښیار ذکاوت سره د سینمایی ویډیوګانو او زړه راښکونکو انیمیشنونو تولید.',
      en: 'Production of cinematic videos and attractive animations with Pika AI.'
    },
    price: { dr: '۳۰ دلار / ماه', ps: '۳۰ ډالره / میاشت', en: '$30 / Month' },
    category: 'ai',
    image: '/images/service-14.jpg'
  },
  {
    id: '17',
    title: { dr: 'Sora (OpenAI Video)', ps: 'Sora (OpenAI Video)', en: 'Sora (OpenAI Video)' },
    description: {
      dr: 'پیش‌خرید و رزرو دسترسی به انقلابی‌ترین مدل تولید ویدیو از متن.',
      ps: 'له متن څخه د ویډیو تولید ترټولو انقلابي ماډل ته د لاسرسي دمخه پیرود او ریزرو کول.',
      en: 'Pre-purchase and reserve access to the most revolutionary text-to-video model.'
    },
    price: { dr: 'توافقی', ps: 'توافقي', en: 'Negotiable' },
    category: 'ai',
    image: '/images/service-15.jpg'
  },
  {
    id: '18',
    title: { dr: 'Suno AI (Music)', ps: 'Suno AI (Music)', en: 'Suno AI (Music)' },
    description: {
      dr: 'ساخت آهنگ‌های کامل با کلام و موسیقی در سبک‌های مختلف با هوش مصنوعی.',
      ps: 'د هوښیار ذکاوت سره په مختلفو سټایلونو کې د بشپړ سندرو او میوزیک جوړول.',
      en: 'Creating complete songs with lyrics and music in various styles with AI.'
    },
    price: { dr: '۱۰ دلار / ماه', ps: '۱۰ ډالره / میاشت', en: '$10 / Month' },
    category: 'ai',
    image: '/images/service-16.jpg'
  },
  {
    id: '19',
    title: { dr: 'Microsoft Copilot Pro', ps: 'Microsoft Copilot Pro', en: 'Microsoft Copilot Pro' },
    description: {
      dr: 'دسترسی به GPT-4 و قابلیت‌های هوش مصنوعی در مجموعه آفیس.',
      ps: 'په آفیس ټولګه کې GPT-4 او د هوښیار ذکاوت وړتیاوو ته لاسرسی.',
      en: 'Access to GPT-4 and AI capabilities in the Microsoft Office suite.'
    },
    price: { dr: '۲۰ دلار / ماه', ps: '۲۰ ډالره / میاشت', en: '$20 / Month' },
    category: 'ai',
    image: '/images/service-17.jpg'
  },
  {
    id: '20',
    title: { dr: 'MiniMax (Video AI)', ps: 'MiniMax (Video AI)', en: 'MiniMax (Video AI)' },
    description: {
      dr: 'تولید ویدیوهای فوق‌رئالیستیک با مدل پیشرفته مینی‌مکس.',
      ps: 'د مینی میکس پرمختللي ماډل سره د خورا ریښتیني ویډیوګانو تولید.',
      en: 'Production of ultra-realistic videos with the advanced MiniMax model.'
    },
    price: { dr: '۲۵ دلار / ماه', ps: '۲۵ ډالره / میاشت', en: '$25 / Month' },
    category: 'ai',
    image: '/images/service-18.jpg'
  },
  {
    id: '21',
    title: { dr: 'ElevenLabs (Voice AI)', ps: 'ElevenLabs (Voice AI)', en: 'ElevenLabs (Voice AI)' },
    description: {
      dr: 'طبیعی‌ترین سرویس تبدیل متن به گفتار و شبیه‌سازی صدا در جهان.',
      ps: 'په نړۍ کې د متن څخه وینا او د غږ سمولیشن ترټولو طبیعي خدمت.',
      en: 'The world\'s most natural text-to-speech and voice cloning service.'
    },
    price: { dr: '۱۱ دلار / ماه', ps: '۱۱ ډالره / میاشت', en: '$11 / Month' },
    category: 'ai',
    image: '/images/service-19.jpg'
  },
  {
    id: '22',
    title: { dr: 'xAI Grok', ps: 'xAI Grok', en: 'xAI Grok' },
    description: {
      dr: 'هوش مصنوعی ایلان ماسک با دسترسی مستقیم به داده‌های لحظه‌ای X.',
      ps: 'د ایلون مسک هوښیار ذکاوت د X ریښتیني وخت معلوماتو ته مستقیم لاسرسي سره.',
      en: 'Elon Musk\'s AI with direct access to real-time X data.'
    },
    price: { dr: '۱۶ دلار / ماه', ps: '۱۶ ډالره / میاشت', en: '$16 / Month' },
    category: 'ai',
    image: '/images/service-20.jpg'
  },
  {
    id: '23',
    title: { dr: 'Amazon Gift Card', ps: 'Amazon Gift Card', en: 'Amazon Gift Card' },
    description: {
      dr: 'گیفت کارت آمازون برای خرید از بزرگترین فروشگاه آنلاین جهان.',
      ps: 'د نړۍ ترټولو لوی آنلاین پلورنځي څخه د پیرودلو لپاره د ایمیزون ډالۍ کارت.',
      en: 'Amazon gift cards for shopping at the world\'s largest online store.'
    },
    price: { dr: 'شروع از ۵ دلار', ps: 'له ۵ ډالرو څخه پیل', en: 'Starting from $5' },
    category: 'card',
    image: '/images/service-21.jpg'
  },
  {
    id: '24',
    title: { dr: 'Google Play Gift Card', ps: 'Google Play Gift Card', en: 'Google Play Gift Card' },
    description: {
      dr: 'خرید اپلیکیشن، بازی و محتوای دیجیتال از گوگل پلی استور.',
      ps: 'د ګوګل پلی سټور څخه د اپلیکیشنونو، لوبو او ډیجیټل مینځپانګو پیرود.',
      en: 'Purchase apps, games, and digital content from the Google Play Store.'
    },
    price: { dr: 'شروع از ۱۰ دلار', ps: 'له ۱۰ ډالرو څخه پیل', en: 'Starting from $10' },
    category: 'card',
    image: '/images/service-22.jpg'
  },
  {
    id: '25',
    title: { dr: 'Apple / iTunes Gift Card', ps: 'Apple / iTunes Gift Card', en: 'Apple / iTunes Gift Card' },
    description: {
      dr: 'شارژ اپل آیدی برای خرید از اپ استور و سرویس‌های اپل.',
      ps: 'د اپل سټور او اپل خدماتو څخه د پیرودلو لپاره د اپل آی ډي چارج کول.',
      en: 'Recharge Apple ID for purchases from the App Store and Apple services.'
    },
    price: { dr: 'شروع از ۵ دلار', ps: 'له ۵ ډالرو څخه پیل', en: 'Starting from $5' },
    category: 'card',
    image: '/images/service-23.jpg'
  },
  {
    id: '26',
    title: { dr: 'Netflix Gift Card', ps: 'Netflix Gift Card', en: 'Netflix Gift Card' },
    description: {
      dr: 'شارژ اکانت نتفلیکس برای تماشای فیلم و سریال‌های روز دنیا.',
      ps: 'د نړۍ د فلمونو او سریالونو لیدو لپاره د نیټ فلکس اکاونټ چارج کول.',
      en: 'Recharge Netflix account for watching the latest movies and series.'
    },
    price: { dr: 'شروع از ۱۵ دلار', ps: 'له ۱۵ ډالرو څخه پیل', en: 'Starting from $15' },
    category: 'card',
    image: '/images/service-24.jpg'
  },
  {
    id: '27',
    title: { dr: 'Spotify Gift Card', ps: 'Spotify Gift Card', en: 'Spotify Gift Card' },
    description: {
      dr: 'فعال‌سازی اشتراک پرمیوم اسپاتیفای بدون نیاز به کارت بانکی.',
      ps: 'د بانکي کارت اړتیا پرته د سپوټایفای پریمیم ګډون فعالول.',
      en: 'Activation of Spotify Premium subscription without the need for a bank card.'
    },
    price: { dr: 'شروع از ۱۰ دلار', ps: 'له ۱۰ ډالرو څخه پیل', en: 'Starting from $10' },
    category: 'card',
    image: '/images/service-25.jpg'
  },
  {
    id: '28',
    title: { dr: 'PlayStation / Xbox Gift Card', ps: 'PlayStation / Xbox Gift Card', en: 'PlayStation / Xbox Gift Card' },
    description: {
      dr: 'خرید بازی و اشتراک‌های آنلاین برای کنسول‌های بازی.',
      ps: 'د لوبو کنسولونو لپاره د لوبو او آنلاین ګډونونو پیرود.',
      en: 'Purchase games and online subscriptions for gaming consoles.'
    },
    price: { dr: 'شروع از ۱۰ دلار', ps: 'له ۱۰ ډالرو څخه پیل', en: 'Starting from $10' },
    category: 'card',
    image: '/images/service-26.jpg'
  },
  {
    id: '29',
    title: { dr: 'Steam Gift Card', ps: 'Steam Gift Card', en: 'Steam Gift Card' },
    description: {
      dr: 'شارژ کیف پول استیم برای خرید بازی‌های کامپیوتری.',
      ps: 'د کمپیوټر لوبو پیرودلو لپاره د سټیم بټوې چارج کول.',
      en: 'Recharge Steam wallet for purchasing computer games.'
    },
    price: { dr: 'شروع از ۵ دلار', ps: 'له ۵ ډالرو څخه پیل', en: 'Starting from $5' },
    category: 'card',
    image: '/images/service-27.jpg'
  },
  {
    id: '30',
    title: { dr: 'HK Visa Business Credit (USD)', ps: 'HK Visa Business Credit (USD)', en: 'HK Visa Business Credit (USD)' },
    description: {
      dr: 'کارت اعتباری تجاری ویزا هنگ‌کنگ با ارز دلار، مناسب برای خریدهای بین‌المللی سنگین.',
      ps: 'د هانګ کانګ ویزا سوداګریز کریډیټ کارت په ډالرو، د درنو نړیوالو پیرودلو لپاره مناسب.',
      en: 'Hong Kong Visa Business Credit Card in USD, suitable for heavy international purchases.'
    },
    price: { dr: 'توافقی', ps: 'توافقي', en: 'Negotiable' },
    category: 'card',
    image: '/images/service-28.jpg'
  },
  {
    id: '31',
    title: { dr: 'UK Mastercard Commercial Debit (EUR)', ps: 'UK Mastercard Commercial Debit (EUR)', en: 'UK Mastercard Commercial Debit (EUR)' },
    description: {
      dr: 'مسترکارت تجاری بریتانیا با ارز یورو، ایده‌آل برای پرداخت‌های اروپایی و تجاری.',
      ps: 'د انګلستان ماسټر کارټ سوداګریز ډیبیټ په یورو، د اروپایی او سوداګریزو تادیاتو لپاره مثالی.',
      en: 'UK Mastercard Commercial Debit in EUR, ideal for European and business payments.'
    },
    price: { dr: 'توافقی', ps: 'توافقي', en: 'Negotiable' },
    category: 'card',
    image: '/images/service-29.jpg'
  },
  {
    id: '32',
    title: { dr: 'UK Visa Business Debit (EUR)', ps: 'UK Visa Business Debit (EUR)', en: 'UK Visa Business Debit (EUR)' },
    description: {
      dr: 'ویزا کارت تجاری بریتانیا با ارز یورو، مناسب برای بیزنس‌های فعال در اروپا.',
      ps: 'د انګلستان ویزا سوداګریز ډیبیټ په یورو، په اروپا کې د فعالو سوداګریو لپاره مناسب.',
      en: 'UK Visa Business Debit in EUR, suitable for businesses active in Europe.'
    },
    price: { dr: 'توافقی', ps: 'توافقي', en: 'Negotiable' },
    category: 'card',
    image: '/images/service-30.jpg'
  },
  {
    id: '33',
    title: { dr: 'US Mastercard Commercial Credit (USD)', ps: 'US Mastercard Commercial Credit (USD)', en: 'US Mastercard Commercial Credit (USD)' },
    description: {
      dr: 'مسترکارت اعتباری تجاری ایالات متحده (Type 2) با ارز دلار برای پرداخت‌های جهانی.',
      ps: 'د متحده ایالاتو ماسټر کارټ سوداګریز کریډیټ (دوهم ډول) په ډالرو د نړیوالو تادیاتو لپاره.',
      en: 'US Mastercard Commercial Credit (Type 2) in USD for global payments.'
    },
    price: { dr: 'توافقی', ps: 'توافقي', en: 'Negotiable' },
    category: 'card',
    image: '/images/service-31.jpg'
  },
  {
    id: '34',
    title: { dr: 'US Visa Commercial Credit (USD)', ps: 'US Visa Commercial Credit (USD)', en: 'US Visa Commercial Credit (USD)' },
    description: {
      dr: 'ویزا کارت اعتباری تجاری ایالات متحده (Type 2) با ارز دلار، بالاترین سطح پذیرش جهانی.',
      ps: 'د متحده ایالاتو ویزا سوداګریز کریډیټ (دوهم ډول) په ډالرو، د نړیوال منلو لوړه کچه.',
      en: 'US Visa Commercial Credit (Type 2) in USD, highest level of global acceptance.'
    },
    price: { dr: 'توافقی', ps: 'توافقي', en: 'Negotiable' },
    category: 'card',
    image: '/images/service-32.jpg'
  },
  {
    id: '35',
    title: { dr: 'US Visa Commercial Debit (USD)', ps: 'US Visa Commercial Debit (USD)', en: 'US Visa Commercial Debit (USD)' },
    description: {
      dr: 'ویزا کارت تجاری ایالات متحده با ارز دلار، مناسب برای پرداخت‌های آنلاین و اشتراک‌ها.',
      ps: 'د متحده ایالاتو ویزا سوداګریز ډیبیټ په ډالرو، د آنلاین تادیاتو او ګډونونو لپاره مناسب.',
      en: 'US Visa Commercial Debit in USD, suitable for online payments and subscriptions.'
    },
    price: { dr: 'توافقی', ps: 'توافقي', en: 'Negotiable' },
    category: 'card',
    image: '/images/service-33.jpg'
  },
  {
    id: '5',
    title: { dr: 'لوگو و هویت بصری', ps: 'لوګو او لید هویت', en: 'Logo & Visual Identity' },
    description: {
      dr: 'طراحی حرفه‌ای لوگو و ست اداری برای کسب و کار شما با متدهای روز دنیا.',
      ps: 'ستاسو د سوداګرۍ لپاره د نړۍ د نن ورځې میتودونو سره د لوګو او دفتر سیټ مسلکي ډیزاین.',
      en: 'Professional logo and stationery design for your business with modern methods.'
    },
    price: { dr: 'توافقی', ps: 'توافقي', en: 'Negotiable' },
    category: 'graphic',
    image: '/images/service-34.jpg'
  },
  {
    id: '6',
    title: { dr: 'ادیت ویدیو و موشن گرافیک', ps: 'ویډیو ایډیټ او موشن ګرافیک', en: 'Video Editing & Motion Graphics' },
    description: {
      dr: 'ساخت ویدیوهای تبلیغاتی و موشن گرافیک‌های جذاب برای شبکه‌های اجتماعی.',
      ps: 'د ټولنیزو شبکو لپاره د اعلاناتو ویډیوګانو او زړه راښکونکو موشن ګرافیکونو جوړول.',
      en: 'Creating promotional videos and attractive motion graphics for social media.'
    },
    price: { dr: 'توافقی', ps: 'توافقي', en: 'Negotiable' },
    category: 'graphic',
    image: '/images/service-35.jpg'
  }
];

export const PORTFOLIO: PortfolioItem[] = [
  { 
    id: 'p1', 
    title: { dr: 'طراحی لوگو برند تکنولوژی', ps: 'د ټیکنالوژۍ برانډ لوګو ډیزاین', en: 'Tech Brand Logo Design' }, 
    category: { dr: 'لوگو', ps: 'لوګو', en: 'Logo' }, 
    image: '/images/service-11.jpg' 
  },
  { 
    id: 'p2', 
    title: { dr: 'هویت بصری شرکت بازرگانی', ps: 'د سوداګریز شرکت لید هویت', en: 'Trading Company Visual Identity' }, 
    category: { dr: 'برندینگ', ps: 'برانډینګ', en: 'Branding' }, 
    image: '/images/service-36.jpg' 
  },
  { 
    id: 'p3', 
    title: { dr: 'پوستر تبلیغاتی رویداد هنری', ps: 'د هنري پیښې اعلاناتي پوسټر', en: 'Art Event Promo Poster' }, 
    category: { dr: 'پوستر', ps: 'پوسټر', en: 'Poster' }, 
    image: '/images/service-37.jpg' 
  },
  { 
    id: 'p4', 
    title: { dr: 'طراحی رابط کاربری اپلیکیشن', ps: 'د اپلیکیشن کارونکي انٹرفیس ډیزاین', en: 'App UI/UX Design' }, 
    category: { dr: 'UI/UX', ps: 'UI/UX', en: 'UI/UX' }, 
    image: '/images/service-38.jpg' 
  },
  { 
    id: 'p5', 
    title: { dr: 'موشن گرافیک معرفی محصول', ps: 'د محصول معرفي کولو موشن ګرافیک', en: 'Product Intro Motion Graphics' }, 
    category: { dr: 'ویدیو', ps: 'ویډیو', en: 'Video' }, 
    image: '/images/service-39.jpg' 
  },
  { 
    id: 'p6', 
    title: { dr: 'کاتالوگ محصولات صنعتی', ps: 'د صنعتي محصولاتو کټګورۍ', en: 'Industrial Product Catalog' }, 
    category: { dr: 'چاپ', ps: 'چاپ', en: 'Print' }, 
    image: '/images/service-40.jpg' 
  },
  { 
    id: 'p7', 
    title: { dr: 'طراحی بسته‌بندی مواد غذایی', ps: 'د خوراکي توکو بسته بندۍ ډیزاین', en: 'Food Packaging Design' }, 
    category: { dr: 'بسته‌بندی', ps: 'بسته بندي', en: 'Packaging' }, 
    image: '/images/service-41.jpg' 
  },
  { 
    id: 'p8', 
    title: { dr: 'ست اداری کامل شرکت مهندسی', ps: 'د انجینرۍ شرکت بشپړ دفتر سیټ', en: 'Engineering Firm Stationery' }, 
    category: { dr: 'برندینگ', ps: 'برانډینګ', en: 'Branding' }, 
    image: '/images/service-42.jpg' 
  },
  { 
    id: 'p9', 
    title: { dr: 'طراحی آیکون‌های اختصاصی', ps: 'د ځانګړي آیکونونو ډیزاین', en: 'Custom Icon Design' }, 
    category: { dr: 'گرافیک', ps: 'ګرافیک', en: 'Graphics' }, 
    image: '/images/service-43.jpg' 
  },
  { 
    id: 'p10', 
    title: { dr: 'بنر تبلیغاتی شبکه‌های اجتماعی', ps: 'د ټولنیزو شبکو اعلاناتي بینر', en: 'Social Media Ad Banner' }, 
    category: { dr: 'دیجیتال', ps: 'ډیجیټل', en: 'Digital' }, 
    image: '/images/service-44.jpg' 
  },
];
