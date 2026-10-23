import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'dr' | 'ps' | 'en';

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

export const translations: Translations = {
  // Navbar
  home: { dr: 'خانه', ps: 'کور', en: 'Home' },
  ai_services: { dr: 'هوش مصنوعی', ps: 'مصنوعي ذهانت', en: 'AI Services' },
  virtual_cards: { dr: 'کارت‌های مجازی', ps: 'مجازي کارتونه', en: 'Virtual Cards' },
  graphics: { dr: 'گرافیک', ps: 'ګرافیک', en: 'Graphics' },
  admin: { dr: 'پنل مدیریت', ps: 'مدیریت پنل', en: 'Admin Panel' },
  login: { dr: 'ورود', ps: 'ننوتل', en: 'Login' },
  logout: { dr: 'خروج', ps: 'وتل', en: 'Logout' },
  
  // Hero
  hero_badge: { dr: 'دنیای دیجیتال بدون مرز', ps: 'بې پولې ډیجیټل نړۍ', en: 'Digital World Without Borders' },
  hero_title_1: { dr: 'تجربه', ps: 'تجربه', en: 'PREMIUM' },
  hero_title_2: { dr: 'ممتاز', ps: 'غوره', en: 'EXPERIENCE' },
  hero_desc: { dr: 'دسترسی به بهترین ابزارهای هوش مصنوعی، پرداخت‌های ارزی امن و خدمات گرافیکی حرفه‌ای در یک پلتفرم واحد.', ps: 'په یو واحد پلیټ فارم کې غوره مصنوعي ذهانت وسیلو، خوندي اسعارو تادیاتو او مسلکي ګرافیک خدماتو ته لاسرسی.', en: 'Access to the best AI tools, secure currency payments, and professional graphic services in a single platform.' },
  get_started: { dr: 'شروع کنید', ps: 'پیل کړئ', en: 'Get Started' },
  free_consultation: { dr: 'مشاوره رایگان', ps: 'وړیا مشوره', en: 'Free Consultation' },
  
  // Special Services
  special_services_badge: { dr: 'خدمات متمایز', ps: 'ځانګړي خدمتونه', en: 'Distinctive Services' },
  special_services_title: { dr: 'سرویس‌های', ps: 'ځانګړي', en: 'Special' },
  special_services_title_2: { dr: 'ویژه', ps: 'خدمتونه', en: 'Services' },
  special_services_desc: { dr: 'تجربه‌ای فراتر از استانداردهای معمولی با ابزارهای پیشرفته و پشتیبانی اختصاصی.', ps: 'د پرمختللو وسیلو او وقف شوي ملاتړ سره د عادي معیارونو څخه بهر تجربه.', en: 'An experience beyond ordinary standards with advanced tools and dedicated support.' },
  view_all: { dr: 'مشاهده همه سرویس‌ها', ps: 'ټول خدمتونه وګورئ', en: 'View All Services' },
  explore: { dr: 'کاوش', ps: 'لټون', en: 'Explore' },
  
  // Categories
  cat_ai_title: { dr: 'هوش مصنوعی', ps: 'مصنوعي ذهانت', en: 'Artificial Intelligence' },
  cat_ai_desc: { dr: 'فعال‌سازی اکانت‌های پرمیوم ChatGPT، Midjourney و غیره', ps: 'د ChatGPT، Midjourney او نورو پریمیم حسابونو فعالول', en: 'Activation of ChatGPT, Midjourney, and other premium accounts' },
  cat_ai_desc_long: { dr: 'دسترسی نامحدود به قدرتمندترین هوش‌های مصنوعی جهان. اکانت‌های پرمیوم ChatGPT Plus، Midjourney، Claude و سایر ابزارهای پیشرفته را با کمترین هزینه و تحویل فوری دریافت کنید.', ps: 'د نړۍ ترټولو پیاوړي مصنوعي استخباراتو ته لامحدود لاسرسی. د ChatGPT پلس، Midjourney، Claude او نورو پرمختللو وسیلو پریمیم حسابونه په ټیټ لګښت او سمدستي تحویل سره ترلاسه کړئ.', en: 'Unlimited access to the world\'s most powerful AIs. Get premium accounts for ChatGPT Plus, Midjourney, Claude, and other advanced tools at the lowest cost with instant delivery.' },
  cat_cards_title: { dr: 'کارت‌های مجازی', ps: 'مجازي کارتونه', en: 'Virtual Cards' },
  cat_cards_desc: { dr: 'صدور کارت‌های Visa و Mastercard برای پرداخت‌های بین‌المللی', ps: 'د نړیوالو تادیاتو لپاره د ویزا او ماسټر کارډ کارتونو صادرول', en: 'Issuing Visa and Mastercard for international payments' },
  cat_cards_desc_long: { dr: 'پرداخت‌های بین‌المللی خود را به راحتی انجام دهید. صدور آنی کارت‌های مجازی ویزا و مسترکارت، قابل استفاده در تمامی سایت‌های خارجی، خرید اشتراک‌ها و پرداخت‌های ارزی بدون محدودیت.', ps: 'خپلې نړیوالې تادیات په اسانۍ سره ترسره کړئ. د ویزې او ماسټر کارډ مجازی کارتونو سمدستي صادرول، په ټولو بهرنیو سایټونو کې د کارولو وړ، د ګډون پیرود او د محدودیتونو پرته د اسعارو تادیات.', en: 'Make your international payments easily. Instant issuance of Visa and Mastercard virtual cards, usable on all foreign sites, buying subscriptions, and currency payments without restrictions.' },
  cat_graphics_title: { dr: 'خدمات گرافیک', ps: 'ګرافیک خدمتونه', en: 'Graphic Services' },
  cat_graphics_desc: { dr: 'طراحی لوگو، هویت بصری و تدوین ویدیوهای حرفه‌ای', ps: 'د لوگو ډیزاین، بصري هویت او مسلکي ویډیو ایډیټ کول', en: 'Logo design, visual identity, and professional video editing' },
  cat_support_title: { dr: 'پشتیبانی ویژه', ps: 'ځانګړی ملاتړ', en: 'Special Support' },
  cat_support_desc: { dr: 'تیم ما در تمام ساعات شبانه‌روز آماده پاسخگویی به شماست.', ps: 'زموږ ټیم د ورځې په ټولو ساعتونو کې ستاسو ځواب ویلو ته چمتو دی.', en: 'Our team is ready to answer you at all hours of the day and night.' },

  // Cart
  cart_title: { dr: 'سبد خرید', ps: 'د پیرودلو کڅوړه', en: 'Shopping Cart' },
  cart_empty: { dr: 'سبد خرید شما خالی است', ps: 'ستاسو د پیرودلو کڅوړه خالي ده', en: 'Your cart is empty' },
  cart_empty_desc: { dr: 'هنوز هیچ سرویسی به سبد خرید خود اضافه نکرده‌اید.', ps: 'تاسو تر اوسه خپلې کڅوړې ته هیڅ خدمت نه دی اضافه کړی.', en: 'You haven\'t added any services to your cart yet.' },
  cart_total: { dr: 'مجموع کل', ps: 'ټولټال', en: 'Total' },
  cart_clear: { dr: 'خالی کردن', ps: 'خالي کول', en: 'Clear Cart' },
  cart_checkout: { dr: 'پرداخت نهایی', ps: 'وروستی تادیه', en: 'Final Payment' },
  cart_items: { dr: 'آیتم', ps: 'توکي', en: 'items' },
  cart_clear_success: { dr: 'سبد خرید خالی شد', ps: 'د پیرودلو کڅوړه خالي شوه', en: 'Cart cleared successfully' },
  
  // Checkout
  checkout_title: { dr: 'درگاه', ps: 'د تادیې', en: 'Payment' },
  checkout_title_2: { dr: 'پرداخت', ps: 'دروازه', en: 'Gateway' },
  order_summary: { dr: 'خلاصه سفارش', ps: 'د امر لنډیز', en: 'Order Summary' },
  payable_amount: { dr: 'مبلغ قابل پرداخت', ps: 'د تادیې وړ مقدار', en: 'Payable Amount' },
  equivalent: { dr: 'معادل', ps: 'برابر', en: 'Equivalent' },
  confirm_payment: { dr: 'پرداخت و تایید نهایی', ps: 'تادیه او وروستی تایید', en: 'Confirm & Pay' },
  secure_transaction: { dr: 'تراکنش امن و رمزنگاری شده', ps: 'خوندي او کوډ شوې معامله', en: 'Secure & Encrypted Transaction' },
  
  // Contact
  contact_badge: { dr: 'ارتباط با ما', ps: 'موږ سره اړیکه', en: 'Contact Us' },
  contact_title: { dr: 'راه‌های', ps: 'د اړیکو', en: 'Contact' },
  contact_title_2: { dr: 'ارتباطی', ps: 'لارې', en: 'Methods' },
  contact_desc: { dr: 'برای دریافت مشاوره و فعال‌سازی سرویس‌ها، از طریق یکی از روش‌های زیر با ما در ارتباط باشید.', ps: 'د مشورې ترلاسه کولو او خدماتو فعالولو لپاره، د لاندې میتودونو څخه یو له لارې موږ سره اړیکه ونیسئ.', en: 'To receive consultation and activate services, contact us through one of the following methods.' },
  contact_whatsapp: { dr: 'واتساپ', ps: 'واټساپ', en: 'WhatsApp' },
  contact_telegram: { dr: 'تلگرام', ps: 'ټیلیګرام', en: 'Telegram' },
  contact_call: { dr: 'تماس مستقیم', ps: 'مستقیم اړیکه', en: 'Direct Call' },
  contact_start_chat: { dr: 'شروع گفتگو', ps: 'خبرې پیل کړئ', en: 'Start Chat' },
  contact_click_here: { dr: 'کلیک کنید', ps: 'دلته کلیک وکړئ', en: 'Click Here' },
  contact_ai_desc: { dr: 'پاسخگویی آنی با هوش مصنوعی', ps: 'د مصنوعي ذهانت سره سمدستي ځواب', en: 'Instant response with AI' },
  
  // Consultation
  consult_title: { dr: 'مشاوره هوشمند', ps: 'هوښیاره مشوره', en: 'Smart Consultation' },
  consult_desc: { dr: 'دستیار هوش مصنوعی توبا آماده پاسخگویی به سوالات شماست.', ps: 'د توبا مصنوعي ذهانت معاون ستاسو پوښتنو ته ځواب ویلو ته چمتو دی.', en: 'TOBA AI Assistant is ready to answer your questions.' },
  consult_placeholder: { dr: 'سوال خود را بپرسید...', ps: 'خپله پوښتنه وپوښتئ...', en: 'Ask your question...' },
  consult_send: { dr: 'ارسال', ps: 'لیږل', en: 'Send' },

  // Trust Section
  security_title: { dr: 'امنیت تضمین شده', ps: 'تضمین شوی امنیت', en: 'Guaranteed Security' },
  security_desc: { dr: 'تمامی پرداخت‌ها و اکانت‌ها با ضمانت کامل ارائه می‌شوند.', ps: 'ټولې تادیې او حسابونه د بشپړ تضمین سره چمتو کیږي.', en: 'All payments and accounts are provided with full guarantee.' },
  speed_title: { dr: 'تحویل فوق سریع', ps: 'خورا ګړندی تحویل', en: 'Ultra-Fast Delivery' },
  speed_desc: { dr: 'بیش از ۹۰٪ سفارشات در کمتر از ۳۰ دقیقه فعال می‌شوند.', ps: 'له ۹۰٪ څخه ډیر سپارښتنې په ۳۰ دقیقو کې فعال کیږي.', en: 'More than 90% of orders are activated in less than 30 minutes.' },
  support_title: { dr: 'پشتیبانی جهانی', ps: 'نړیوال ملاتړ', en: 'Global Support' },
  support_desc: { dr: 'تیم ما در تمام ساعات شبانه‌روز آماده پاسخگویی به شماست.', ps: 'زموږ ټیم د ورځې په ټولو ساعتونو کې ستاسو ځواب ویلو ته چمتو دی.', en: 'Our team is ready to answer you at all hours of the day and night.' },

  // Footer & Pages
  footer_desc: { dr: 'مرجع تخصصی فعال‌سازی سرویس‌های پرمیوم و پرداخت‌های بین‌المللی با بیش از ۵ سال سابقه درخشان در ارائه خدمات دیجیتال.', ps: 'د ډیجیټل خدماتو چمتو کولو کې د ۵ کلونو څخه ډیر روښانه تاریخ سره د پریمیم خدماتو فعالولو او نړیوالو تادیاتو لپاره ځانګړې حواله.', en: 'Specialized reference for activating premium services and international payments with over 5 years of brilliant history in providing digital services.' },
  company: { dr: 'شرکت', ps: 'شرکت', en: 'Company' },
  legal: { dr: 'قانونی', ps: 'قانوني', en: 'Legal' },
  about_us: { dr: 'درباره ما', ps: 'زموږ په اړه', en: 'About Us' },
  contact_us: { dr: 'تماس با ما', ps: 'موږ سره اړیکه', en: 'Contact Us' },
  blog: { dr: 'وبلاگ', ps: 'بلاګ', en: 'Blog' },
  terms: { dr: 'قوانین', ps: 'قوانین', en: 'Terms' },
  privacy: { dr: 'حریم خصوصی', ps: 'رازداري', en: 'Privacy' },
  projects: { dr: 'پروژه‌ها', ps: 'پروژې', en: 'Projects' },
  
  // Terms Content
  terms_content: { 
    dr: 'استفاده از خدمات توبا استودیو به منزله پذیرش کامل قوانین ماست. تمامی سرویس‌های خریداری شده دارای گارانتی بازگشت وجه در صورت عدم کارکرد می‌باشند. هرگونه استفاده غیرقانونی از کارت‌های مجازی و اکانت‌ها بر عهده کاربر است.', 
    ps: 'د توبا سټوډیو خدماتو کارول زموږ د مقرراتو بشپړ منلو په معنی دی. ټول پیرودل شوي خدمتونه د نه کار کولو په صورت کې د پیسو بیرته ورکولو تضمین لري. د مجازی کارتونو او حسابونو هر ډول غیر قانوني کارول د کارونکي مسؤلیت دی.', 
    en: 'Using Toba Studio services means full acceptance of our terms. All purchased services have a money-back guarantee if they do not work. Any illegal use of virtual cards and accounts is the user\'s responsibility.' 
  },
  
  // Privacy Content
  privacy_content: { 
    dr: 'حریم خصوصی شما برای ما بسیار مهم است. اطلاعات شخصی و مالی شما با بالاترین استانداردهای امنیتی رمزنگاری شده و هرگز در اختیار شخص ثالث قرار نمی‌گیرد. ما تنها از اطلاعات شما برای ارائه بهتر خدمات استفاده می‌کنیم.', 
    ps: 'ستاسو محرمیت زموږ لپاره خورا مهم دی. ستاسو شخصي او مالي معلومات د لوړ امنیتي معیارونو سره کوډ شوي او هیڅکله دریمې ډلې ته نه ورکول کیږي. موږ یوازې ستاسو معلومات د غوره خدماتو چمتو کولو لپاره کاروو.', 
    en: 'Your privacy is very important to us. Your personal and financial information is encrypted with the highest security standards and is never shared with third parties. We only use your information to provide better services.' 
  },
  
  // About Content
  about_content: { 
    dr: 'توبا استودیو یک پلتفرم پیشرو در ارائه خدمات دیجیتال، پرداخت‌های ارزی و فعال‌سازی اکانت‌های هوش مصنوعی است. هدف ما برداشتن تحریم‌ها و محدودیت‌ها برای کاربران افغان و فارسی‌زبان است تا بتوانند به راحتی به تکنولوژی‌های روز دنیا دسترسی داشته باشند.', 
    ps: 'توبا سټوډیو د ډیجیټل خدماتو، اسعارو تادیاتو او مصنوعي استخباراتو حسابونو فعالولو کې مخکښ پلیټ فارم دی. زموږ هدف د افغان او فارسي ژبو کاروونکو لپاره د بندیزونو او محدودیتونو لرې کول دي ترڅو دوی وکولی شي په اسانۍ سره د نړۍ وروستي ټیکنالوژیو ته لاسرسی ومومي.', 
    en: 'Toba Studio is a leading platform in providing digital services, currency payments, and AI account activation. Our goal is to remove sanctions and restrictions for Afghan and Persian-speaking users so they can easily access the world\'s latest technologies.' 
  },

  // Login & Register
  login_welcome: { dr: 'خوش آمدید', ps: 'ښه راغلاست', en: 'Welcome Back' },
  register_title: { dr: 'ایجاد حساب', ps: 'اکاونټ جوړ کړئ', en: 'Create Account' },
  login_subtitle: { dr: 'برای دسترسی به پنل وارد شوید', ps: 'پنل ته د لاسرسي لپاره ننوځئ', en: 'Login to access the panel' },
  register_subtitle: { dr: 'به خانواده توبا استودیو بپیوندید', ps: 'د توبا سټوډیو کورنۍ سره یوځای شئ', en: 'Join the Toba Studio family' },
  full_name: { dr: 'نام کامل', ps: 'بشپړ نوم', en: 'Full Name' },
  full_name_placeholder: { dr: 'نام و تخلص شما', ps: 'ستاسو بشپړ نوم', en: 'Your full name' },
  email: { dr: 'ایمیل', ps: 'بریښنالیک', en: 'Email' },
  password: { dr: 'رمز عبور', ps: 'پټنوم', en: 'Password' },
  login_button: { dr: 'ورود به حساب', ps: 'حساب ته ننوځئ', en: 'Login' },
  register_button: { dr: 'ثبت‌نام و عضویت', ps: 'نوم لیکنه او غړیتوب', en: 'Register' },
  no_account: { dr: 'حساب کاربری ندارید؟', ps: 'اکاونټ نه لرئ؟', en: "Don't have an account?" },
  have_account: { dr: 'قبلاً ثبت‌نام کرده‌اید؟', ps: 'دمخه مو نوم لیکنه کړې؟', en: 'Already have an account?' },
  create_account_link: { dr: 'ایجاد حساب جدید', ps: 'نوی اکاونټ جوړ کړئ', en: 'Create new account' },
  login_link: { dr: 'وارد شوید', ps: 'ننوځئ', en: 'Login' },
  error_occurred: { dr: 'خطایی رخ داد', ps: 'یوه تېروتنه وشوه', en: 'An error occurred' },

  // Admin Panel
  admin_panel_title: { dr: 'پنل مدیریت', ps: 'د مدیریت پنل', en: 'Admin Panel' },
  admin_panel_desc: { dr: 'مدیریت سرویس‌ها، قیمت‌ها و محتوای سایت', ps: 'د خدماتو، قیمتونو او سایټ مینځپانګې اداره کول', en: 'Manage services, prices, and site content' },
  active_users: { dr: 'کاربران فعال', ps: 'فعال کاروونکي', en: 'Active Users' },
  monthly_sales: { dr: 'فروش ماهانه', ps: 'میاشتنی پلور', en: 'Monthly Sales' },
  service_list: { dr: 'لیست سرویس‌ها', ps: 'د خدماتو لیست', en: 'Service List' },
  add_new_service: { dr: 'افزودن سرویس جدید', ps: 'نوی خدمت اضافه کړئ', en: 'Add New Service' },
  table_image: { dr: 'تصویر', ps: 'انځور', en: 'Image' },
  table_title: { dr: 'عنوان سرویس', ps: 'د خدمت سرلیک', en: 'Service Title' },
  table_category: { dr: 'دسته‌بندی', ps: 'کټګوري', en: 'Category' },
  table_price: { dr: 'قیمت', ps: 'قیمت', en: 'Price' },
  table_actions: { dr: 'عملیات', ps: 'عملیات', en: 'Actions' },
  edit_service: { dr: 'ویرایش سرویس', ps: 'د خدمت ترمیم', en: 'Edit Service' },
  save: { dr: 'ذخیره تغییرات', ps: 'بدلونونه خوندي کړئ', en: 'Save Changes' },
  dashboard: { dr: 'داشبورد', ps: 'داشبورډ', en: 'Dashboard' },
  services: { dr: 'سرویس‌ها', ps: 'خدمتونه', en: 'Services' },
  orders: { dr: 'سفارشات', ps: 'امرونه', en: 'Orders' },
  users: { dr: 'کاربران', ps: 'کاروونکي', en: 'Users' },
  settings: { dr: 'تنظیمات', ps: 'ترتیبات', en: 'Settings' },
  total_revenue: { dr: 'کل درآمد', ps: 'ټوله عاید', en: 'Total Revenue' },
  pending_orders: { dr: 'سفارشات در انتظار', ps: 'انتظار امرونه', en: 'Pending Orders' },
  new_customers: { dr: 'مشتریان جدید', ps: 'نوي پیرودونکي', en: 'New Customers' },
  recent_orders: { dr: 'سفارشات اخیر', ps: 'وروستي امرونه', en: 'Recent Orders' },
  customer: { dr: 'مشتری', ps: 'پیرودونکی', en: 'Customer' },
  status: { dr: 'وضعیت', ps: 'حالت', en: 'Status' },
  date: { dr: 'تاریخ', ps: 'نیټه', en: 'Date' },
  amount: { dr: 'مبلغ', ps: 'مقدار', en: 'Amount' },
  user_email: { dr: 'ایمیل کاربر', ps: 'د کارونکي بریښنالیک', en: 'User Email' },
  order_id: { dr: 'شناسه سفارش', ps: 'د امر پیژندنه', en: 'Order ID' },
  update_status: { dr: 'بروزرسانی وضعیت', ps: 'حالت تازه کول', en: 'Update Status' },
  delete_user: { dr: 'حذف کاربر', ps: 'کارن حذف کړئ', en: 'Delete User' },
  change_password: { dr: 'تغییر رمز عبور', ps: 'پاسورډ بدل کړئ', en: 'Change Password' },
  db_access: { dr: 'دسترسی به دیتابیس', ps: 'ډیټابیس ته لاسرسی', en: 'Database Access' },
  db_tables: { dr: 'جداول دیتابیس', ps: 'د ډیټابیس جدولونه', en: 'Database Tables' },
  db_stats: { dr: 'آمار دیتابیس', ps: 'د ډیټابیس احصایه', en: 'Database Stats' },
  confirm_delete_user: { dr: 'آیا از حذف این کاربر مطمئن هستید؟ این عمل غیرقابل بازگشت است.', ps: 'ایا تاسو ډاډه یاست چې دا کارن حذف کړئ؟ دا عمل نه بدلیدونکی دی.', en: 'Are you sure you want to delete this user? This action is irreversible.' },
  delete_confirm: { dr: 'آیا از حذف این مورد مطمئن هستید؟', ps: 'ایا تاسو ډاډه یاست چې دا توکي حذف کړئ؟', en: 'Are you sure you want to delete this item?' },
  confirm_delete: { dr: 'تایید حذف', ps: 'د حذف تایید', en: 'Confirm Delete' },
  delete_warning: { dr: 'آیا از حذف این مورد مطمئن هستید؟ این عمل غیرقابل بازگشت است.', ps: 'ایا تاسو ډاډه یاست چې دا توکي حذف کړئ؟ دا عمل نه بدلیدونکی دی.', en: 'Are you sure you want to delete this item? This action is irreversible.' },
  delete: { dr: 'حذف', ps: 'حذف', en: 'Delete' },
  cancel: { dr: 'انصراف', ps: 'لغوه کول', en: 'Cancel' },
  service_deleted: { dr: 'سرویس با موفقیت حذف شد.', ps: 'خدمت په بریالیتوب سره حذف شو.', en: 'Service deleted successfully.' },
  service_added: { dr: 'سرویس جدید با موفقیت اضافه شد.', ps: 'نوی خدمت په بریالیتوب سره اضافه شو.', en: 'New service added successfully.' },
  service_updated: { dr: 'سرویس با موفقیت بروزرسانی شد.', ps: 'خدمت په بریالیتوب سره تازه شو.', en: 'Service updated successfully.' },
  error_saving_service: { dr: 'خطا در ذخیره سرویس.', ps: 'د خدمت خوندي کولو کې تېروتنه.', en: 'Error saving service.' },
  error_deleting_service: { dr: 'خطا در حذف سرویس.', ps: 'د خدمت په حذف کولو کې تېروتنه.', en: 'Error deleting service.' },
  order_deleted: { dr: 'سفارش با موفقیت حذف شد.', ps: 'امر په بریالیتوب سره حذف شو.', en: 'Order deleted successfully.' },
  password_changed: { dr: 'رمز عبور با موفقیت تغییر یافت.', ps: 'پاسورډ په بریالیتوب سره بدل شو.', en: 'Password changed successfully.' },
  status_updated: { dr: 'وضعیت سفارش بروزرسانی شد.', ps: 'د امر حالت تازه شو.', en: 'Order status updated.' },
  user_deleted: { dr: 'کاربر با موفقیت حذف شد.', ps: 'کارن په بریالیتوب سره حذف شو.', en: 'User deleted successfully.' },
  table_data: { dr: 'داده‌های جدول', ps: 'د جدول ډاټا', en: 'Table Data' },
  no_data_found: { dr: 'هیچ داده‌ای یافت نشد', ps: 'هیڅ ډاټا ونه موندل شوه', en: 'No Data Found' },
  profile: { dr: 'پروفایل', ps: 'پروفایل', en: 'Profile' },
  security: { dr: 'امنیت', ps: 'امنیت', en: 'Security' },
  profile_settings: { dr: 'تنظیمات پروفایل', ps: 'د پروفایل تنظیمات', en: 'Profile Settings' },
  display_name: { dr: 'نام نمایشی', ps: 'نمایشی نوم', en: 'Display Name' },
  email_address: { dr: 'آدرس ایمیل', ps: 'د بریښنالیک پته', en: 'Email Address' },
  account_role: { dr: 'نقش حساب', ps: 'د حساب رول', en: 'Account Role' },
  member_since: { dr: 'عضویت از', ps: 'د غړیتوب نیټه', en: 'Member Since' },
  need_help: { dr: 'نیاز به کمک دارید؟', ps: 'مرستې ته اړتیا لرئ؟', en: 'Need Help?' },
  user_panel_help_text: { dr: 'اگر در مورد حساب کاربری خود یا خدمات ما سوالی دارید، لطفاً با تیم پشتیبانی ما تماس بگیرید. ما اینجا هستیم تا به شما کمک کنیم.', ps: 'که تاسو د خپل حساب یا زموږ د خدماتو په اړه کومه پوښتنه لرئ، مهرباني وکړئ زموږ د ملاتړ ټیم سره اړیکه ونیسئ. موږ دلته یو چې ستاسو سره مرسته وکړو.', en: 'If you have any questions about your account or our services, please contact our support team. We are here to help you.' },
  security_settings: { dr: 'تنظیمات امنیتی', ps: 'د امنیت تنظیمات', en: 'Security Settings' },
  change_password_desc: { dr: 'برای امنیت بیشتر، توصیه می‌شود رمز عبور خود را به طور منظم تغییر دهید.', ps: 'د ډیر امنیت لپاره، سپارښتنه کیږي چې خپل پاسورډ په منظم ډول بدل کړئ.', en: 'For better security, it is recommended to change your password regularly.' },
  current_password: { dr: 'رمز عبور فعلی', ps: 'اوسنی پاسورډ', en: 'Current Password' },
  new_password: { dr: 'رمز عبور جدید', ps: 'نوی پاسورډ', en: 'New Password' },
  confirm_new_password: { dr: 'تایید رمز عبور جدید', ps: 'د نوي پاسورډ تایید', en: 'Confirm New Password' },
  update_password: { dr: 'بروزرسانی رمز عبور', ps: 'د پاسورډ تازه کول', en: 'Update Password' },
  passwords_do_not_match: { dr: 'رمزهای عبور مطابقت ندارند', ps: 'پاسورډونه سره سمون نه خوري', en: 'Passwords do not match' },
  password_too_short: { dr: 'رمز عبور باید حداقل ۶ کاراکتر باشد', ps: 'پاسورډ باید لږترلږه ۶ توري وي', en: 'Password must be at least 6 characters' },
  password_changed_successfully: { dr: 'رمز عبور با موفقیت تغییر یافت', ps: 'پاسورډ په بریالیتوب سره بدل شو', en: 'Password changed successfully' },
  error_updating_password: { dr: 'خطا در بروزرسانی رمز عبور', ps: 'د پاسورډ په تازه کولو کې تېروتنه', en: 'Error updating password' },
  logged_out_successfully: { dr: 'با موفقیت خارج شدید', ps: 'په بریالیتوب سره ووتل', en: 'Logged out successfully' },
  no_services_found: { dr: 'هیچ خدماتی یافت نشد', ps: 'هیڅ خدمت ونه موندل شو', en: 'No services found' },
  loading: { dr: 'در حال بارگذاری...', ps: 'د پورته کولو په حال کې...', en: 'Loading...' },
  upload_image: { dr: 'آپلود تصویر', ps: 'انځور اپلوډ کړئ', en: 'Upload Image' },
  pending: { dr: 'در انتظار', ps: 'انتظار', en: 'Pending' },
  processing: { dr: 'در حال پردازش', ps: 'د پروسس په حال کې', en: 'Processing' },
  completed: { dr: 'تکمیل شده', ps: 'بشپړ شوی', en: 'Completed' },
  cancelled: { dr: 'لغو شده', ps: 'لغوه شوی', en: 'Cancelled' },
  hesab_pay: { dr: 'حساب پی', ps: 'حساب پی', en: 'Hesab Pay' },
  atoma_pay: { dr: 'آتوما پی', ps: 'آتوما پی', en: 'Atoma Pay' },
  binance_id: { dr: 'شناسه بایننس', ps: 'د بایننس پیژندنه', en: 'Binance ID' },
  my_orders: { dr: 'سفارشات من', ps: 'زما امرونه', en: 'My Orders' },
  suggestions: { dr: 'پیشنهادات', ps: 'وړاندیزونه', en: 'Suggestions' },
  order_history: { dr: 'تاریخچه سفارشات', ps: 'د امرونو تاریخچه', en: 'Order History' },
  submit_suggestion: { dr: 'ارسال پیشنهاد', ps: 'وړاندیز واستوئ', en: 'Submit Suggestion' },
  suggestion_subject: { dr: 'موضوع پیشنهاد', ps: 'د وړاندیز موضوع', en: 'Suggestion Subject' },
  suggestion_message: { dr: 'متن پیشنهاد', ps: 'د وړاندیز متن', en: 'Suggestion Message' },
  verify_email: { dr: 'تایید ایمیل', ps: 'د بریښنالیک تایید', en: 'Verify Email' },
  verification_code: { dr: 'کد تایید', ps: 'د تایید کوډ', en: 'Verification Code' },
  send_code: { dr: 'ارسال کد', ps: 'کوډ واستوئ', en: 'Send Code' },
  confirm_code: { dr: 'تایید کد', ps: 'کوډ تایید کړئ', en: 'Confirm Code' },
  email_verified: { dr: 'ایمیل تایید شده', ps: 'بریښنالیک تایید شوی', en: 'Email Verified' },
  email_not_verified: { dr: 'ایمیل تایید نشده', ps: 'بریښنالیک نه دی تایید شوی', en: 'Email Not Verified' },
  membership_date: { dr: 'تاریخ عضویت', ps: 'د غړیتوب نیټه', en: 'Membership Date' },
  suggestion_sent: { dr: 'پیشنهاد شما با موفقیت ارسال شد.', ps: 'ستاسو وړاندیز په بریالیتوب سره واستول شو.', en: 'Your suggestion has been sent successfully.' },
  google_ads_placeholder: { dr: 'محل تبلیغات گوگل', ps: 'د ګوګل اعلاناتو ځای', en: 'Google Ads Space' },
  rejected: { dr: 'رد شده', ps: 'رد شوی', en: 'Rejected' },
  approved: { dr: 'تایید شده', ps: 'تایید شوی', en: 'Approved' },
  subject: { dr: 'موضوع', ps: 'موضوع', en: 'Subject' },
  message: { dr: 'پیام', ps: 'پیغام', en: 'Message' },
  send: { dr: 'ارسال', ps: 'لیږل', en: 'Send' },
  no_suggestions: { dr: 'هنوز پیشنهادی ثبت نشده است', ps: 'تر اوسه هیڅ وړاندیز نه دی ثبت شوی', en: 'No suggestions yet' },

  // Error Boundary
  error_boundary_title: { dr: 'خطایی رخ داد', ps: 'یوه تېروتنه وشوه', en: 'An error occurred' },
  error_boundary_desc: { dr: 'متأسفانه مشکلی در برنامه رخ داده است.', ps: 'له بده مرغه په اپلیکیشن کې ستونزه رامنځته شوه.', en: 'Unfortunately, a problem occurred in the application.' },
  error_boundary_retry: { dr: 'تلاش مجدد', ps: 'بیا هڅه وکړئ', en: 'Retry' },
  database_error: { dr: 'خطای پایگاه داده', ps: 'د ډیټابیس تېروتنه', en: 'Database Error' },
  table_description: { dr: 'توضیحات', ps: 'تشریح', en: 'Description' },
  title_dr: { dr: 'عنوان (دری)', ps: 'عنوان (دري)', en: 'Title (Dari)' },
  title_ps: { dr: 'عنوان (پشتو)', ps: 'عنوان (پښتو)', en: 'Title (Pashto)' },
  title_en: { dr: 'عنوان (انگلیسی)', ps: 'عنوان (انګلیسي)', en: 'Title (English)' },
  description_dr: { dr: 'توضیحات (دری)', ps: 'تشریح (دري)', en: 'Description (Dari)' },
  description_ps: { dr: 'توضیحات (پشتو)', ps: 'تشریح (پښتو)', en: 'Description (Pashto)' },
  description_en: { dr: 'توضیحات (انگلیسی)', ps: 'تشریح (انګلیسي)', en: 'Description (English)' },
  price_dr: { dr: 'قیمت (دری)', ps: 'قیمت (دري)', en: 'Price (Dari)' },
  price_ps: { dr: 'قیمت (پشتو)', ps: 'قیمت (پښتو)', en: 'Price (Pashto)' },
  price_en: { dr: 'قیمت (انگلیسی)', ps: 'قیمت (انګلیسي)', en: 'Price (English)' },
  error_title_required: { dr: 'عنوان برای تمامی زبان‌ها الزامی است', ps: 'عنوان د ټولو ژبو لپاره اړین دی', en: 'Title is required for all languages' },
  error_description_required: { dr: 'توضیحات برای تمامی زبان‌ها الزامی است', ps: 'تشریح د ټولو ژبو لپاره اړین دی', en: 'Description is required for all languages' },
  error_price_required: { dr: 'قیمت برای تمامی زبان‌ها الزامی است', ps: 'قیمت د ټولو ژبو لپاره اړین دی', en: 'Price is required for all languages' },
  error_category_required: { dr: 'انتخاب دسته‌بندی الزامی است', ps: 'د کټګورۍ انتخاب اړین دی', en: 'Category selection is required' },
  error_image_required: { dr: 'تصویر الزامی است', ps: 'انځور اړین دی', en: 'Image is required' },
  error_login_required: { dr: 'لطفاً ابتدا وارد حساب خود شوید.', ps: 'مهرباني وکړئ لومړی خپل حساب ته ننوځئ.', en: 'Please login first.' },
  error_order_failed: { dr: 'خطایی در ثبت سفارش رخ داد. لطفاً دوباره تلاش کنید.', ps: 'د امر په ثبتولو کې تېروتنه وشوه. مهرباني وکړئ بیا هڅه وکړئ.', en: 'An error occurred while placing the order. Please try again.' },
  error_payment_failed: { dr: 'پرداخت با خطا مواجه شد.', ps: 'تادیه له تېروتنې سره مخ شوه.', en: 'Payment failed.' },
  order_success: { dr: 'سفارش شما با موفقیت ثبت شد و در حال بررسی است.', ps: 'ستاسو امر په بریالیتوب سره ثبت شو او تر څیړنې لاندې دی.', en: 'Your order has been successfully placed and is being processed.' },
  error_fetching_orders: { dr: 'خطا در دریافت لیست سفارشات.', ps: 'د امرونو لیست ترلاسه کولو کې تېروتنه.', en: 'Error fetching orders.' },
  order_status_updated: { dr: 'وضعیت سفارش با موفقیت بروزرسانی شد.', ps: 'د امر حالت په بریالیتوب سره تازه شو.', en: 'Order status updated successfully.' },
  error_updating_status: { dr: 'خطا در بروزرسانی وضعیت سفارش.', ps: 'د امر حالت تازه کولو کې تېروتنه.', en: 'Error updating order status.' },
  error_deleting_order: { dr: 'خطا در حذف سفارش.', ps: 'د امر په حذفولو کې تېروتنه.', en: 'Error deleting order.' },
  no_orders: { dr: 'هیچ سفارشی یافت نشد', ps: 'هیڅ امر ونه موندل شو', en: 'No orders found' },
  no_services: { dr: 'هیچ خدماتی یافت نشد', ps: 'هیڅ خدمتونه ونه موندل شول', en: 'No services found' },
  no_users: { dr: 'هیچ کاربری یافت نشد', ps: 'هیڅ کاروونکي ونه موندل شول', en: 'No users found' },
  my_suggestions: { dr: 'پیشنهادات من', ps: 'زما وړاندیزونه', en: 'My Suggestions' },
  admin_reply: { dr: 'پاسخ ادمین', ps: 'د مدیر ځواب', en: 'Admin Reply' },
  no_suggestions_yet: { dr: 'شما هنوز هیچ پیشنهادی ارسال نکرده‌اید', ps: 'تاسو تر اوسه هیڅ وړاندیز نه دی لیږلی', en: "You haven't submitted any suggestions yet." },
  type_reply: { dr: 'پاسخ خود را تایپ کنید...', ps: 'خپل ځواب ولیکئ...', en: 'Type your reply...' },
  delete_suggestion: { dr: 'حذف پیشنهاد', ps: 'وړاندیز حذف کړئ', en: 'Delete Suggestion' },
  enter_image_url: { dr: 'یا آدرس تصویر را وارد کنید', ps: 'یا د انځور پته دننه کړئ', en: 'Or enter Image URL' },
  card_expiry_placeholder: { dr: 'ماه/سال', ps: 'میاشت/کال', en: 'MM/YY' },
  card_cvc_placeholder: { dr: 'کد امنیتی', ps: 'امنیتي کوډ', en: 'CVC' },
  user_details: { dr: 'جزئیات کاربر', ps: 'د کارونکي توضیحات', en: 'User Details' },
  edit_user: { dr: 'ویرایش کاربر', ps: 'کارن سمول', en: 'Edit User' },
  verification_status: { dr: 'وضعیت تایید', ps: 'د تایید حالت', en: 'Verification Status' },
  verified: { dr: 'تایید شده', ps: 'تایید شوی', en: 'Verified' },
  not_verified: { dr: 'تایید نشده', ps: 'نه تایید شوی', en: 'Not Verified' },
  email_verified_label: { dr: 'ایمیل تایید شده', ps: 'بریښنالیک تایید شوی', en: 'Email Verified' },
  search_users: { dr: 'جستجوی کاربر...', ps: 'د کارونکي لټون...', en: 'Search users...' },
  search_orders: { dr: 'جستجوی سفارش...', ps: 'د امر لټون...', en: 'Search orders...' },
  search_services: { dr: 'جستجوی سرویس...', ps: 'د خدمت لټون...', en: 'Search services...' },
  edit_order: { dr: 'ویرایش سفارش', ps: 'امر سمول', en: 'Edit Order' },
  order_details: { dr: 'جزئیات سفارش', ps: 'د امر توضیحات', en: 'Order Details' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'dr';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'en' ? 'ltr' : 'rtl';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  const isRTL = language !== 'en';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
