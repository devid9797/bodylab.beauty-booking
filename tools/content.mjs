// Content for the SEO metadata of the home pages and for the service pages.
// Only facts that are already published on the site go here (prices, durations,
// address, descriptions, policies). Anything unconfirmed - opening hours,
// contraindications, staff qualifications, results - stays out until the owner
// confirms it.
//
// After editing: node tools/build.mjs

export const SITE = 'https://bodylab-beauty.lv';
export const SALON_ID = `${SITE}/#salon`;
export const LANGS = ['lv', 'ru', 'en'];
export const DEFAULT_LANG = 'lv';

export const BUSINESS = {
  name: 'BodyLab.Beauty',
  phone: '+37120888805',
  phoneDisplay: '+371 20888805',
  instagram: 'https://www.instagram.com/bodylab.beauty',
  whatsapp: 'https://api.whatsapp.com/send?phone=37120888805',
  street: 'Augusta Deglava iela 66, "Deglava Biroji", 5. stāvs, 506. kabinets',
  city: 'Rīga',
  country: 'LV',
  logo: `${SITE}/images/logo.jpg`,
  image: `${SITE}/images/og-image.jpg`,
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Augusta+Deglava+iela+66%2C+R%C4%ABga',
  stebbyUrl: 'https://app.stebby.eu/group/bodylab.beauty',
};

// Home page path per language. "/" is the Latvian page (it also serves the
// existing ?rsvp=1 and UTM links); "/lv/" only redirects to it.
export const HOME_PATH = { lv: '/', ru: '/ru/', en: '/en/' };

export const HOME_META = {
  lv: {
    title: 'BodyLab.Beauty – ķermeņa modelēšanas studija Rīgā | Online pieraksts',
    description: 'BodyLab.Beauty – ķermeņa modelēšanas studija Rīgā, Augusta Deglava ielā 66. R-Sleek, B-Flexy, EMS Zero un presoterapija: cenas, apraksti un online pieraksts uz brīvu laiku.',
    ogLocale: 'lv_LV',
  },
  ru: {
    title: 'BodyLab.Beauty – студия моделирования тела в Риге | Онлайн-запись',
    description: 'BodyLab.Beauty – студия моделирования тела в Риге, Augusta Deglava iela 66. R-Sleek, B-Flexy, EMS Zero и прессотерапия: цены, описание процедур и онлайн-запись на свободное время.',
    ogLocale: 'ru_RU',
  },
  en: {
    title: 'BodyLab.Beauty – Body Contouring Studio in Riga | Online Booking',
    description: 'BodyLab.Beauty is a body contouring studio in Riga, Augusta Deglava iela 66. R-Sleek, B-Flexy, EMS Zero and pressotherapy: prices, treatment details and online booking.',
    ogLocale: 'en_GB',
  },
};

// Labels and shared texts for the service pages.
export const UI = {
  lv: {
    home: 'Sākums',
    book: name => `Pierakstīties uz ${name}`,
    bookVariant: label => `Pierakstīties: ${label}`,
    howTitle: 'Kā notiek procedūra',
    goalsTitle: 'Procedūras mērķi',
    expectTitle: 'Ko sagaidīt',
    expectText: 'Katra ķermeņa reakcija uz procedūrām ir individuāla. Rezultāts ir atkarīgs no procedūru skaita un regularitātes, dzīvesveida un ķermeņa īpatnībām. Procedūra nav medicīniska ārstēšana, un mēs nesolām konkrētu svara vai apjomu samazinājumu.',
    beforeText: 'Ja jums ir veselības problēmas vai šaubas, vai procedūra jums ir piemērota, pirms pieraksta konsultējieties ar ārstu un pastāstiet par to mums.',
    pricesTitle: 'Cenas un ilgums',
    colOption: 'Variants',
    colDuration: 'Ilgums',
    colPrice: 'Cena',
    minutes: n => `${n} min`,
    paymentText: `Procedūras var apmaksāt arī ar Stebby labbūtības pabalstiem, ja tos piedāvā jūsu darba devējs. Pieejama arī BodyLab.Beauty dāvanu karte.`,
    faqTitle: 'Biežāk uzdotie jautājumi',
    whereTitle: 'Kur notiek procedūra',
    address: 'Augusta Deglava iela 66, "Deglava Biroji", 5. stāvs, 506. kabinets, Rīga',
    parking: 'Pie ēkas ir stāvvieta – 1 stunda bez maksas (reģistrācija automātā 1. stāvā pie lifta vai Mobilly lietotnē, zona LDB).',
    phoneLabel: 'Tālrunis / WhatsApp:',
    mapLink: 'Atvērt Google Maps',
    otherTitle: 'Citas procedūras',
    backHome: '← Visas procedūras un pieraksts',
    langLabel: 'Valoda',
    faqBook: { q: 'Kā pierakstīties?', a: 'Izvēlieties brīvu laiku tiešsaistes kalendārā mūsu mājaslapā un aizpildiet īsu formu – reģistrācija nav nepieciešama. Jautājumus varat uzdot WhatsApp: +371 20888805.' },
    faqCancel: { q: 'Vai pierakstu var atcelt?', a: 'Jā, lūdzam par to informēt iepriekš. Ja pieraksts tiek atcelts mazāk nekā 24 stundas pirms procedūras, tiek piemērota pilna procedūras cena.' },
    faqPay: { q: 'Kā var samaksāt?', a: 'Procedūras var apmaksāt arī ar Stebby labbūtības pabalstiem, ja tos piedāvā jūsu darba devējs. Procedūru var arī uzdāvināt ar BodyLab.Beauty dāvanu karti, kas derīga 3 mēnešus.' },
    faqWhere: { q: 'Kur atrodas studija un vai ir stāvvieta?', a: 'Studija atrodas Rīgā, Augusta Deglava ielā 66 ("Deglava Biroji"), 5. stāvā, 506. kabinetā. Pie ēkas ir stāvvieta – 1 stunda bez maksas.' },
  },
  ru: {
    home: 'Главная',
    book: name => `Записаться на ${name}`,
    bookVariant: label => `Записаться: ${label}`,
    howTitle: 'Как проходит процедура',
    goalsTitle: 'Задачи процедуры',
    expectTitle: 'Чего ожидать',
    expectText: 'Реакция на процедуры у всех индивидуальна. Результат зависит от количества и регулярности процедур, образа жизни и особенностей организма. Процедура не является медицинским лечением, и мы не обещаем конкретного снижения веса или объёмов.',
    beforeText: 'Если у вас есть проблемы со здоровьем или сомнения, подходит ли вам процедура, перед записью проконсультируйтесь с врачом и сообщите нам об этом.',
    pricesTitle: 'Цены и длительность',
    colOption: 'Вариант',
    colDuration: 'Длительность',
    colPrice: 'Цена',
    minutes: n => `${n} мин`,
    paymentText: 'Процедуры можно оплатить и льготами Stebby, если их предоставляет ваш работодатель. Также доступна подарочная карта BodyLab.Beauty.',
    faqTitle: 'Частые вопросы',
    whereTitle: 'Где проходит процедура',
    address: 'Augusta Deglava iela 66, "Deglava Biroji", 5-й этаж, кабинет 506, Рига',
    parking: 'У здания есть парковка – 1 час бесплатно (регистрация в автомате на 1-м этаже у лифта или в приложении Mobilly, зона LDB).',
    phoneLabel: 'Телефон / WhatsApp:',
    mapLink: 'Открыть в Google Maps',
    otherTitle: 'Другие процедуры',
    backHome: '← Все процедуры и запись',
    langLabel: 'Язык',
    faqBook: { q: 'Как записаться?', a: 'Выберите свободное время в онлайн-календаре на нашем сайте и заполните короткую форму – регистрация не нужна. Вопросы можно задать в WhatsApp: +371 20888805.' },
    faqCancel: { q: 'Можно ли отменить запись?', a: 'Да, просим сообщить об этом заранее. Если запись отменяется менее чем за 24 часа до процедуры, оплачивается полная стоимость процедуры.' },
    faqPay: { q: 'Как можно оплатить?', a: 'Процедуры можно оплатить и льготами Stebby, если их предоставляет ваш работодатель. Процедуру можно подарить с подарочной картой BodyLab.Beauty, она действует 3 месяца.' },
    faqWhere: { q: 'Где находится студия и есть ли парковка?', a: 'Студия находится в Риге, Augusta Deglava iela 66 ("Deglava Biroji"), 5-й этаж, кабинет 506. У здания есть парковка – 1 час бесплатно.' },
  },
  en: {
    home: 'Home',
    book: name => `Book ${name}`,
    bookVariant: label => `Book: ${label}`,
    howTitle: 'How the treatment works',
    goalsTitle: 'What the treatment aims at',
    expectTitle: 'What to expect',
    expectText: 'Everyone responds to treatments differently. Results depend on the number and regularity of sessions, lifestyle and individual body characteristics. The treatment is not medical care, and we do not promise a specific amount of weight or volume loss.',
    beforeText: 'If you have health conditions or are unsure whether the treatment is right for you, please consult your doctor before booking and let us know.',
    pricesTitle: 'Prices and duration',
    colOption: 'Option',
    colDuration: 'Duration',
    colPrice: 'Price',
    minutes: n => `${n} min`,
    paymentText: 'Treatments can also be paid with Stebby wellness benefits if your employer offers them. A BodyLab.Beauty gift card is available as well.',
    faqTitle: 'Frequently asked questions',
    whereTitle: 'Where the treatment takes place',
    address: 'Augusta Deglava iela 66, "Deglava Biroji", 5th floor, room 506, Riga, Latvia',
    parking: 'There is parking by the building – 1 hour free (register at the machine on the 1st floor by the elevator or in the Mobilly app, zone LDB).',
    phoneLabel: 'Phone / WhatsApp:',
    mapLink: 'Open in Google Maps',
    otherTitle: 'Other treatments',
    backHome: '← All treatments and booking',
    langLabel: 'Language',
    faqBook: { q: 'How do I book?', a: 'Pick a free time in the online calendar on our website and fill in a short form – no account needed. You can also ask questions on WhatsApp: +371 20888805.' },
    faqCancel: { q: 'Can I cancel my booking?', a: 'Yes, please let us know in advance. If a booking is cancelled less than 24 hours before the appointment, the full price of the treatment applies.' },
    faqPay: { q: 'How can I pay?', a: 'Treatments can also be paid with Stebby wellness benefits if your employer offers them. You can also give a treatment as a present with a BodyLab.Beauty gift card, valid for 3 months.' },
    faqWhere: { q: 'Where is the studio and is there parking?', a: 'The studio is in Riga, Augusta Deglava iela 66 ("Deglava Biroji"), 5th floor, room 506. There is parking by the building – 1 hour free.' },
  },
};

// Prices/durations as shown on the home page. `book` is the ?book= key the home
// page maps to the booking form's service option.
export const SERVICES = [
  {
    id: 'r-sleek',
    slug: { lv: 'r-sleek', ru: 'r-sleek', en: 'r-sleek' },
    name: { lv: 'R-Sleek', ru: 'R-Sleek', en: 'R-Sleek' },
    image: '/images/service-rsleek.jpg',
    offers: [
      { label: { lv: '1 procedūra', ru: '1 процедура', en: '1 session' }, minutes: 45, price: 35, book: 'r-sleek' },
      { label: { lv: '10 procedūru abonements', ru: 'Абонемент на 10 процедур', en: '10-session package' }, minutes: 45, sessions: 10, price: 330 },
    ],
    meta: {
      lv: { title: 'R-Sleek ķermeņa modelēšanas masāža Rīgā – 35 € | BodyLab.Beauty', description: 'R-Sleek – masāža ar rotējošiem rullīšiem BodyLab.Beauty studijā Rīgā. 45 min – 35 €, 10 procedūru abonements – 330 €. Online pieraksts uz brīvu laiku.' },
      ru: { title: 'R-Sleek – массаж для моделирования тела в Риге, 35 € | BodyLab.Beauty', description: 'R-Sleek – массаж вращающимися роликами в студии BodyLab.Beauty в Риге. 45 мин – 35 €, абонемент на 10 процедур – 330 €. Онлайн-запись на свободное время.' },
      en: { title: 'R-Sleek Body Contouring Massage in Riga – €35 | BodyLab.Beauty', description: 'R-Sleek roller massage at BodyLab.Beauty studio in Riga. 45 min – €35, 10-session package – €330. Book a free time online.' },
    },
    h1: {
      lv: 'R-Sleek ķermeņa modelēšanas masāža Rīgā',
      ru: 'R-Sleek – массаж для моделирования тела в Риге',
      en: 'R-Sleek body contouring massage in Riga',
    },
    lead: {
      lv: 'R-Sleek ir ķermeņa modelēšanas masāža ar rotējošiem rullīšiem. Mūsu populārākā procedūra BodyLab.Beauty studijā Rīgā.',
      ru: 'R-Sleek – массаж для моделирования тела вращающимися роликами. Самая популярная процедура в студии BodyLab.Beauty в Риге.',
      en: 'R-Sleek is a body contouring massage with rotating rollers – the most popular treatment at BodyLab.Beauty studio in Riga.',
    },
    how: {
      lv: ['Procedūras laikā uz ķermeni mehāniski iedarbojas rotējoši rullīši, radot dziļas masāžas efektu.', 'Viena procedūra ilgst 45 minūtes.'],
      ru: ['Во время процедуры на тело механически воздействуют вращающиеся ролики, создавая эффект глубокого массажа.', 'Одна процедура длится 45 минут.'],
      en: ['During the treatment, rotating rollers work on the body mechanically, creating a deep massage effect.', 'One session takes 45 minutes.'],
    },
    goals: {
      lv: ['Ķermeņa apjomu samazināšana', 'Dziļa limfodrenāža', 'Kolagēna izstrādāšanas stimulēšana', 'Ādas tonusa un elastības uzlabošana'],
      ru: ['Уменьшение объёма тела', 'Глубокий лимфодренаж', 'Стимуляция выработки коллагена', 'Улучшение тонуса и эластичности кожи'],
      en: ['Body volume reduction', 'Deep lymphatic drainage', 'Stimulating collagen production', 'Improving skin tone and elasticity'],
    },
    faq: {
      lv: [
        { q: 'Cik ilgi ilgst R-Sleek procedūra un cik tā maksā?', a: 'Viena R-Sleek procedūra ilgst 45 minūtes un maksā 35 €.' },
        { q: 'Vai ir pieejams R-Sleek abonements?', a: 'Jā, 10 R-Sleek procedūru abonements maksā 330 € – tas ir 33 € par procedūru.' },
        { q: 'Ar ko R-Sleek atšķiras no B-Flexy?', a: 'R-Sleek iedarbība ir mehāniska – ar rotējošiem rullīšiem. B-Flexy rullīšu masāžu apvieno ar vakuuma sūkšanu.' },
      ],
      ru: [
        { q: 'Сколько длится процедура R-Sleek и сколько она стоит?', a: 'Одна процедура R-Sleek длится 45 минут и стоит 35 €.' },
        { q: 'Есть ли абонемент на R-Sleek?', a: 'Да, абонемент на 10 процедур R-Sleek стоит 330 € – это 33 € за процедуру.' },
        { q: 'Чем R-Sleek отличается от B-Flexy?', a: 'R-Sleek – механическое воздействие вращающимися роликами. B-Flexy сочетает роликовый массаж с вакуумным всасыванием.' },
      ],
      en: [
        { q: 'How long does an R-Sleek session take and how much is it?', a: 'One R-Sleek session takes 45 minutes and costs €35.' },
        { q: 'Is there an R-Sleek package?', a: 'Yes, a package of 10 R-Sleek sessions costs €330 – that is €33 per session.' },
        { q: 'How is R-Sleek different from B-Flexy?', a: 'R-Sleek works mechanically with rotating rollers. B-Flexy combines roller massage with vacuum suction.' },
      ],
    },
  },
  {
    id: 'b-flexy',
    slug: { lv: 'b-flexy', ru: 'b-flexy', en: 'b-flexy' },
    name: { lv: 'B-Flexy', ru: 'B-Flexy', en: 'B-Flexy' },
    image: '/images/service-bflexy.jpg',
    offers: [
      { label: { lv: '1 procedūra', ru: '1 процедура', en: '1 session' }, minutes: 45, price: 30, book: 'b-flexy' },
      { label: { lv: '10 procedūru abonements', ru: 'Абонемент на 10 процедур', en: '10-session package' }, minutes: 45, sessions: 10, price: 280 },
    ],
    meta: {
      lv: { title: 'B-Flexy vakuuma rullīšu masāža Rīgā – 30 € | BodyLab.Beauty', description: 'B-Flexy – pretcelulīta vakuuma rullīšu masāža BodyLab.Beauty studijā Rīgā. 45 min – 30 €, 10 procedūru abonements – 280 €. Online pieraksts.' },
      ru: { title: 'B-Flexy – вакуумно-роликовый массаж в Риге, 30 € | BodyLab.Beauty', description: 'B-Flexy – антицеллюлитный вакуумно-роликовый массаж в студии BodyLab.Beauty в Риге. 45 мин – 30 €, абонемент на 10 процедур – 280 €. Онлайн-запись.' },
      en: { title: 'B-Flexy Vacuum Roller Massage in Riga – €30 | BodyLab.Beauty', description: 'B-Flexy anti-cellulite vacuum roller massage at BodyLab.Beauty studio in Riga. 45 min – €30, 10-session package – €280. Book online.' },
    },
    h1: {
      lv: 'B-Flexy vakuuma rullīšu masāža Rīgā',
      ru: 'B-Flexy – вакуумно-роликовый массаж в Риге',
      en: 'B-Flexy vacuum roller massage in Riga',
    },
    lead: {
      lv: 'B-Flexy ir pretcelulīta masāža, kas apvieno rullīšu masāžu un vakuumu. Procedūra BodyLab.Beauty studijā Rīgā.',
      ru: 'B-Flexy – антицеллюлитный массаж, сочетающий роликовый массаж и вакуум. Процедура в студии BodyLab.Beauty в Риге.',
      en: 'B-Flexy is an anti-cellulite massage that combines roller massage with vacuum, available at BodyLab.Beauty studio in Riga.',
    },
    how: {
      lv: ['Tiek izmantota rullīšu-vakuuma tehnoloģija: vienlaikus tiek veikta vakuuma sūkšana un mehāniska masāža ar rullīšiem.', 'Viena procedūra ilgst 45 minūtes.'],
      ru: ['Используется роликово-вакуумная технология: одновременно выполняются вакуумное всасывание и механический массаж роликами.', 'Одна процедура длится 45 минут.'],
      en: ['The treatment uses roller-vacuum technology: vacuum suction and mechanical roller massage work at the same time.', 'One session takes 45 minutes.'],
    },
    goals: {
      lv: ['Celulīta izpausmju mazināšana', 'Audu mikrocirkulācijas uzlabošana', 'Ķermeņa kontūru pilnveidošana', 'Ādas struktūras izlīdzināšana'],
      ru: ['Уменьшение проявлений целлюлита', 'Улучшение микроциркуляции тканей', 'Коррекция контуров тела', 'Выравнивание текстуры кожи'],
      en: ['Reducing the appearance of cellulite', 'Improving tissue microcirculation', 'Refining body contours', 'Smoothing skin texture'],
    },
    faq: {
      lv: [
        { q: 'Cik ilgi ilgst B-Flexy procedūra un cik tā maksā?', a: 'Viena B-Flexy procedūra ilgst 45 minūtes un maksā 30 €.' },
        { q: 'Vai ir pieejams B-Flexy abonements?', a: 'Jā, 10 B-Flexy procedūru abonements maksā 280 € – tas ir 28 € par procedūru.' },
        { q: 'Ar ko B-Flexy atšķiras no R-Sleek?', a: 'B-Flexy rullīšu masāžu apvieno ar vakuuma sūkšanu. R-Sleek iedarbība ir mehāniska – ar rotējošiem rullīšiem.' },
      ],
      ru: [
        { q: 'Сколько длится процедура B-Flexy и сколько она стоит?', a: 'Одна процедура B-Flexy длится 45 минут и стоит 30 €.' },
        { q: 'Есть ли абонемент на B-Flexy?', a: 'Да, абонемент на 10 процедур B-Flexy стоит 280 € – это 28 € за процедуру.' },
        { q: 'Чем B-Flexy отличается от R-Sleek?', a: 'B-Flexy сочетает роликовый массаж с вакуумным всасыванием. R-Sleek – механическое воздействие вращающимися роликами.' },
      ],
      en: [
        { q: 'How long does a B-Flexy session take and how much is it?', a: 'One B-Flexy session takes 45 minutes and costs €30.' },
        { q: 'Is there a B-Flexy package?', a: 'Yes, a package of 10 B-Flexy sessions costs €280 – that is €28 per session.' },
        { q: 'How is B-Flexy different from R-Sleek?', a: 'B-Flexy combines roller massage with vacuum suction. R-Sleek works mechanically with rotating rollers.' },
      ],
    },
  },
  {
    id: 'ems-zero',
    slug: { lv: 'ems-zero', ru: 'ems-zero', en: 'ems-zero' },
    name: { lv: 'EMS Zero', ru: 'EMS Zero', en: 'EMS Zero' },
    image: '/images/service-emszero.jpg',
    offers: [
      { label: { lv: '1 procedūra', ru: '1 процедура', en: '1 session' }, minutes: 30, price: 20, book: 'ems-zero-1' },
      { label: { lv: '2 procedūras pēc kārtas', ru: '2 процедуры подряд', en: '2 sessions in a row' }, minutes: 60, price: 35, book: 'ems-zero-2' },
    ],
    meta: {
      lv: { title: 'EMS Zero muskuļu stimulācija Rīgā – no 20 € | BodyLab.Beauty', description: 'EMS Zero – elektromagnētiskā muskuļu stimulācija BodyLab.Beauty studijā Rīgā. 30 min – 20 €, 60 min (2 procedūras) – 35 €. Online pieraksts.' },
      ru: { title: 'EMS Zero – стимуляция мышц в Риге, от 20 € | BodyLab.Beauty', description: 'EMS Zero – электромагнитная стимуляция мышц в студии BodyLab.Beauty в Риге. 30 мин – 20 €, 60 мин (2 процедуры) – 35 €. Онлайн-запись.' },
      en: { title: 'EMS Zero Muscle Stimulation in Riga – from €20 | BodyLab.Beauty', description: 'EMS Zero electromagnetic muscle stimulation at BodyLab.Beauty studio in Riga. 30 min – €20, 60 min (2 sessions) – €35. Book online.' },
    },
    h1: {
      lv: 'EMS Zero muskuļu stimulācija Rīgā',
      ru: 'EMS Zero – стимуляция мышц в Риге',
      en: 'EMS Zero muscle stimulation in Riga',
    },
    lead: {
      lv: 'EMS Zero ir elektromagnētiskā muskuļu stimulācija, kas muskuļus aktivizē bez fiziskas slodzes. Procedūra BodyLab.Beauty studijā Rīgā.',
      ru: 'EMS Zero – электромагнитная стимуляция мышц, которая активирует мышцы без физической нагрузки. Процедура в студии BodyLab.Beauty в Риге.',
      en: 'EMS Zero is electromagnetic muscle stimulation that activates the muscles without physical exercise, available at BodyLab.Beauty studio in Riga.',
    },
    how: {
      lv: ['Elektromagnētiskā stimulācija aktivizē muskuļu šķiedras – procedūras laikā jums pašam nav jāveic fiziski vingrinājumi.', 'Var izvēlēties vienu procedūru (30 minūtes) vai divas procedūras pēc kārtas (60 minūtes).'],
      ru: ['Электромагнитная стимуляция активирует мышечные волокна – во время процедуры вам не нужно выполнять физические упражнения.', 'Можно выбрать одну процедуру (30 минут) или две процедуры подряд (60 минут).'],
      en: ['Electromagnetic stimulation activates the muscle fibres – you do not need to do any exercise during the treatment.', 'You can choose one session (30 minutes) or two sessions in a row (60 minutes).'],
    },
    goals: {
      lv: ['Muskuļu tonusa uzlabošana', 'Tauku sadedzināšanas veicināšana', 'Vielmaiņas paātrināšana', 'Rezultāts bez fiziskas slodzes'],
      ru: ['Улучшение мышечного тонуса', 'Ускорение сжигания жира', 'Ускорение обмена веществ', 'Результат без физической нагрузки'],
      en: ['Improving muscle tone', 'Supporting fat burning', 'Speeding up metabolism', 'Working the muscles without physical strain'],
    },
    faq: {
      lv: [
        { q: 'Cik maksā EMS Zero procedūra?', a: 'Viena EMS Zero procedūra (30 minūtes) maksā 20 €, divas procedūras pēc kārtas (60 minūtes) – 35 €.' },
        { q: 'Ar ko atšķiras 1 un 2 EMS Zero procedūras?', a: 'Atšķiras ilgums: 1 procedūra ilgst 30 minūtes, 2 procedūras pēc kārtas – 60 minūtes. Variantu izvēlaties pierakstoties.' },
        { q: 'Vai procedūras laikā jāvingro?', a: 'Nē. Muskuļus aktivizē elektromagnētiskā stimulācija, fiziski vingrinājumi nav jāveic.' },
      ],
      ru: [
        { q: 'Сколько стоит процедура EMS Zero?', a: 'Одна процедура EMS Zero (30 минут) стоит 20 €, две процедуры подряд (60 минут) – 35 €.' },
        { q: 'Чем отличаются 1 и 2 процедуры EMS Zero?', a: 'Длительностью: 1 процедура длится 30 минут, 2 процедуры подряд – 60 минут. Вариант выбирается при записи.' },
        { q: 'Нужно ли делать упражнения во время процедуры?', a: 'Нет. Мышцы активирует электромагнитная стимуляция, физические упражнения выполнять не нужно.' },
      ],
      en: [
        { q: 'How much is an EMS Zero session?', a: 'One EMS Zero session (30 minutes) costs €20, two sessions in a row (60 minutes) cost €35.' },
        { q: 'What is the difference between 1 and 2 EMS Zero sessions?', a: 'The duration: 1 session takes 30 minutes, 2 sessions in a row take 60 minutes. You choose the option when booking.' },
        { q: 'Do I need to exercise during the treatment?', a: 'No. The muscles are activated by electromagnetic stimulation – no exercise is needed.' },
      ],
    },
  },
  {
    id: 'presoterapija',
    slug: { lv: 'presoterapija', ru: 'presoterapija', en: 'pressotherapy' },
    name: { lv: 'Presoterapija', ru: 'Прессотерапия', en: 'Pressotherapy' },
    image: '/images/service-presoterapija.jpg',
    offers: [
      { label: { lv: '1 procedūra', ru: '1 процедура', en: '1 session' }, minutes: 45, price: 25, book: 'presoterapija' },
    ],
    meta: {
      lv: { title: 'Presoterapija (limfodrenāža) Rīgā – 25 € | BodyLab.Beauty', description: 'Presoterapija – limfodrenāžas procedūra ar saspiesta gaisa iedarbību BodyLab.Beauty studijā Rīgā. 45 min – 25 €. Online pieraksts uz brīvu laiku.' },
      ru: { title: 'Прессотерапия (лимфодренаж) в Риге – 25 € | BodyLab.Beauty', description: 'Прессотерапия – лимфодренажная процедура с воздействием сжатого воздуха в студии BodyLab.Beauty в Риге. 45 мин – 25 €. Онлайн-запись на свободное время.' },
      en: { title: 'Pressotherapy (Lymphatic Drainage) in Riga – €25 | BodyLab.Beauty', description: 'Pressotherapy – a lymphatic drainage treatment using compressed air at BodyLab.Beauty studio in Riga. 45 min – €25. Book a free time online.' },
    },
    h1: {
      lv: 'Presoterapija (limfodrenāža) Rīgā',
      ru: 'Прессотерапия (лимфодренаж) в Риге',
      en: 'Pressotherapy (lymphatic drainage) in Riga',
    },
    lead: {
      lv: 'Presoterapija ir atslābinoša limfodrenāžas procedūra ar saspiesta gaisa iedarbību. Procedūra BodyLab.Beauty studijā Rīgā.',
      ru: 'Прессотерапия – расслабляющая лимфодренажная процедура с воздействием сжатого воздуха. Процедура в студии BodyLab.Beauty в Риге.',
      en: 'Pressotherapy is a relaxing lymphatic drainage treatment using compressed air, available at BodyLab.Beauty studio in Riga.',
    },
    how: {
      lv: ['Saspiests gaiss iedarbojas uz ķermeni un veicina limfas un šķidruma aizplūšanu.', 'Viena procedūra ilgst 45 minūtes.'],
      ru: ['Сжатый воздух воздействует на тело и способствует оттоку лимфы и жидкости.', 'Одна процедура длится 45 минут.'],
      en: ['Compressed air works on the body and promotes lymph and fluid drainage.', 'One session takes 45 minutes.'],
    },
    goals: {
      lv: ['Pietūkuma mazināšana', 'Limfas aizplūšanas uzlabošana', '"Smaguma" sajūtas mazināšana kājās', 'Ķermeņa relaksācija'],
      ru: ['Уменьшение отёчности', 'Улучшение оттока лимфы', 'Уменьшение чувства тяжести в ногах', 'Расслабление тела'],
      en: ['Reducing swelling', 'Improving lymph drainage', 'Easing the feeling of heaviness in the legs', 'Full-body relaxation'],
    },
    faq: {
      lv: [
        { q: 'Cik ilgi ilgst presoterapija un cik tā maksā?', a: 'Viena presoterapijas procedūra ilgst 45 minūtes un maksā 25 €.' },
        { q: 'Kā darbojas presoterapija?', a: 'Procedūrā tiek izmantota saspiesta gaisa iedarbība uz ķermeni, kas veicina limfas un šķidruma aizplūšanu.' },
      ],
      ru: [
        { q: 'Сколько длится прессотерапия и сколько она стоит?', a: 'Одна процедура прессотерапии длится 45 минут и стоит 25 €.' },
        { q: 'Как работает прессотерапия?', a: 'Во время процедуры на тело воздействует сжатый воздух, что способствует оттоку лимфы и жидкости.' },
      ],
      en: [
        { q: 'How long does pressotherapy take and how much is it?', a: 'One pressotherapy session takes 45 minutes and costs €25.' },
        { q: 'How does pressotherapy work?', a: 'The treatment applies compressed air to the body, which promotes lymph and fluid drainage.' },
      ],
    },
  },
];
