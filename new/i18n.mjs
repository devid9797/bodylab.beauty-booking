// Тексты нового дизайна на трёх языках (ru / lv / en).
// Где на текущем сайте уже есть готовая формулировка (названия и описания процедур, подарочная карта,
// Stebby, форма записи, условия отмены) – она взята оттуда, чтобы тексты не расходились.
// Новые тексты (заголовки, шаги, подписи) написаны для прототипа – латышскую версию стоит показать носителю.
// Правило из tools/content.mjs соблюдено: только подтверждённые факты (цены, длительность, адрес, условия).

export const LANGS = ['lv', 'ru', 'en'];

// Формат цены: ru/lv – «35 €», en – «€35»
export const CUR = { ru: { pre: '', suf: '€' }, lv: { pre: '', suf: '€' }, en: { pre: '€', suf: '' } };

// Постоянные данные
export const PHONE = '+371 20888805';
export const WA = 'https://wa.me/37120888805';
export const IG = 'https://www.instagram.com/bodylab.beauty';
export const ADDRESS_SHORT = 'Augusta Deglava iela 66';

const MONTHS_NOM = {
  ru: ['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'],
  lv: ['janvāris','februāris','marts','aprīlis','maijs','jūnijs','jūlijs','augusts','septembris','oktobris','novembris','decembris'],
  en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
};
const MONTHS_DATE = { // для строки даты «ср, 21 октября»
  ru: ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'],
  lv: MONTHS_NOM.lv,
  en: MONTHS_NOM.en,
};
const WD_SHORT = {
  ru: ['вс','пн','вт','ср','чт','пт','сб'],
  lv: ['Sv','Pr','Ot','Tr','Ce','Pk','Se'],
  en: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
};
const WD_FULL = {
  ru: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
  lv: ['svētdiena','pirmdiena','otrdiena','trešdiena','ceturtdiena','piektdiena','sestdiena'],
  en: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
};
const WD_HEAD = {
  ru: ['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'],
  lv: ['PR','OT','TR','CE','PK','SE','SV'],
  en: ['MON','TUE','WED','THU','FRI','SAT','SUN'],
};

export const T = {
  // ───────────────────────────── РУССКИЙ ─────────────────────────────
  ru: {
    code: 'RU', htmlLang: 'ru', ogLocale: 'ru_RU',
    homeTitle: 'BodyLab.Beauty – студия моделирования тела в Риге (новый дизайн)',
    bookTitle: 'Онлайн-запись – BodyLab.Beauty (новый дизайн, демо)',
    menuAria: 'Меню', backToSite: 'Назад на сайт', book: 'Записаться', bookOnline: 'Записаться онлайн',
    menu: ['Процедуры', 'Как проходит визит', 'Цены', 'Отзывы', 'Подарочная карта', 'Контакты'],
    langLabel: 'Язык',
    live: 'Онлайн-запись открыта',
    h1a: 'Красивое тело', h1b: 'начинается ', h1em: 'здесь',
    heroLead: 'Студия моделирования тела в Риге: R-Sleek, B-Flexy, EMS Zero и прессотерапия. Выберите процедуру и запишитесь онлайн.',
    pickTime: 'Выбрать время', seeTreatments: 'Смотреть процедуры',
    chip1: ['минут', 'одна процедура'], chip2: ['от 20 €', 'первая процедура'],
    strip: ['R-Sleek', 'B-Flexy', 'EMS Zero', 'Прессотерапия', 'Лимфодренаж', 'Моделирование тела'],
    pin: { eyebrow: 'Процедуры', h2a: 'Четыре процедуры – ', h2em: 'выберите свою', lead: 'От глубокого массажа до лимфодренажа. У каждой процедуры своя цель.' },
    details: 'Подробнее',
    svc: {
      'r-sleek': { tag: 'Массаж моделирования тела', desc: 'Механическое воздействие вращающимися роликами, создающее эффект глубокого массажа.', badge: 'Топ процедура',
        chips: ['Уменьшение объёма', 'Лимфодренаж', 'Коллаген', 'Упругость кожи'], prices: [['1 процедура · 45 мин', '35 €'], ['10 процедур', '330 €']] },
      'b-flexy': { tag: 'Вакуумно-роликовый массаж', desc: 'Используется роликово-вакуумная технология, сочетающая вакуумное всасывание и механический массаж.', badge: 'Против целлюлита',
        chips: ['Против целлюлита', 'Микроциркуляция', 'Контуры тела', 'Текстура кожи'], prices: [['1 процедура · 45 мин', '30 €'], ['10 процедур', '280 €']] },
      'ems-zero': { tag: 'EMS-стимуляция мышц', desc: 'Электромагнитная стимуляция мышц, которая активирует мышечные волокна и ускоряет обмен веществ.', badge: 'Без усилий',
        chips: ['Тонус мышц', 'Сжигание жира', 'Обмен веществ', 'Без нагрузки'], prices: [['1 процедура · 30 мин', '20 €'], ['2 подряд · 60 мин', '35 €']] },
      'presoterapija': { tag: 'Прессотерапия / лимфодренаж', desc: 'Воздействие сжатым воздухом на тело, способствующее оттоку лимфы и жидкости.', badge: 'Расслабляющая',
        chips: ['Меньше отёков', 'Отток лимфы', 'Лёгкость в ногах', 'Расслабление'], prices: [['1 процедура · 45 мин', '25 €']] },
    },
    visit: { eyebrow: 'Как это работает', h2a: 'Всё, чтобы прийти ', h2em: 'и расслабиться', lead: 'Четыре простых шага.',
      steps: [
        ['Выберите время онлайн', 'Выберите свободное время в онлайн-календаре и заполните короткую форму – регистрация не нужна.'],
        ['Приходите в студию', 'Deglava Biroji, 5 этаж, кабинет 506. За сутки до визита придёт напоминание.'],
        ['Процедура 30–45 минут', 'Одна процедура длится 30 или 45 минут, EMS Zero можно взять на 60 минут (две подряд).'],
        ['Абонемент выгоднее', 'Для R-Sleek и B-Flexy есть абонемент на 10 процедур – дешевле, чем 10 разовых.'],
      ] },
    stats: { eyebrow: 'BodyLab.Beauty в цифрах', h2a: 'Просто, понятно ', h2em: 'и честно', labels: ['процедуры в одной студии', 'длится основная процедура', 'стоимость первой процедуры'], min: ' мин', from: 'от ', eur: ' €' },
    prices: { eyebrow: 'Цены', h2a: 'Варианты ', h2em: 'процедур', choose: 'Выбрать', min: 'мин',
      cards: {
        'b-flexy': { badge: 'Против целлюлита', items: ['1 процедура', 'Абонемент на 10: 280 €', 'Вакуумно-роликовый массаж'] },
        'r-sleek': { badge: 'Топ процедура', items: ['1 процедура', 'Абонемент на 10: 330 €', 'Глубокий моделирующий массаж'] },
        'ems-zero': { badge: 'Без усилий', items: ['1 процедура', '2 подряд (60 мин): 35 €', 'Стимуляция мышц'] },
        'presoterapija': { badge: 'Расслабляющая', items: ['1 процедура', 'Лимфодренаж', 'Лёгкость в ногах'] },
      },
      note: 'При отмене или переносе менее чем за 24 часа до процедуры взимается полная стоимость. Оплата через Stebby принимается.' },
    reviews: { eyebrow: 'Отзывы', h2a: 'Что пишут ', h2em: 'клиентки', alt: 'Отзыв клиента' },
    gift: { eyebrow: 'Подарок', title: 'Подарочная карта', desc: 'Не знаете, что подарить? Подарочная карта BodyLab.Beauty – идеальный подарок на любой случай: выберите сумму или конкретную процедуру, а мы позаботимся об остальном.',
      details: ['Действительна 3 месяца с даты покупки', 'Можно выбрать любую сумму или конкретную процедуру', 'Доступна в печатном или цифровом виде'], btn: 'Заказать подарочную карту', wa: 'Здравствуйте! Я хочу заказать подарочную карту BodyLab.Beauty.', alt: 'Подарочная карта BodyLab.Beauty' },
    stebby: { eyebrow: 'Оплата', title: 'Оплата через Stebby', desc: 'Stebby – крупнейшая платформа велнес-льгот в странах Балтии. Если ваш работодатель предоставляет льготы Stebby, вы можете оплатить процедуры BodyLab.Beauty прямо через приложение Stebby.' },
    contact: { eyebrow: 'Контакты', h2a: 'Ждём вас ', h2em: 'в студии', address: 'Адрес', phone: 'Телефон', addrText: 'Augusta Deglava iela 66, «Deglava Biroji», 5-й этаж, кабинет 506, Рига', imgAlt1: 'Студия BodyLab.Beauty', imgAlt2: 'Интерьер студии' },
    footer: { rights: '© BodyLab.Beauty · Рига', current: 'Текущий сайт', info: 'Информация для клиентов', thisPage: 'Текущая страница процедуры' },
    // страница процедуры
    s: { treatments: 'Процедуры', about: 'О процедуре', pickVariant: 'Выберите ', variantEm: 'вариант', honest: 'Честно о результате', ask: 'Уточнить в WhatsApp',
      askText: (name, label) => `Здравствуйте! Хочу узнать про: ${name}, ${label}.`, perSession: 'за процедуру', min: 'минут', oneSession: 'одна процедура', length: 'длительность', price: 'цена', orWord: ' или ',
      onlineBook: 'Онлайн-запись', from: 'от ', sessions: 'процедур', ctaEyebrow: 'Запись', ctaH2a: 'Готовы ', ctaH2em: 'начать?', ctaLead: 'Выберите свободное время онлайн – это быстро.', faq: 'FAQ', waBtn: 'WhatsApp' },
    // страница записи
    b: {
      demo: 'Демо-страница: так будет выглядеть запись. Данные никуда не отправляются, а время сгенерировано.',
      eyebrow: 'Онлайн-запись', steps: ['Процедура', 'Дата и время', 'Ваши данные'],
      s1h: 'Что вам подходит?', s1lead: 'Выберите процедуру. Время и цену подтвердим на следующих шагах.', pickDate: 'Выбрать дату',
      s2h: 'Выберите доступную дату', s2lead: 'Свободные дни отмечены точкой. Затем выберите время.', prev: 'Предыдущий месяц', next: 'Следующий месяц', back: 'Назад', toData: 'Ваши данные',
      freeTime: 'Свободное время', s3h: 'Почти готово', s3lead: 'Оставьте контакты, регистрация не нужна.',
      first: 'Имя *', last: 'Фамилия *', phone: 'Телефон *', ig: 'Instagram (необязательно)', comment: 'Комментарий (необязательно)', commentPh: 'Вопросы, пожелания или другая информация',
      terms: 'Подтверждая запись, вы соглашаетесь, что если запись отменена или перенесена менее чем за 24 часа до процедуры, взимается полная стоимость процедуры.',
      errReq: 'Пожалуйста, заполните все обязательные поля.', errPhone: 'Пожалуйста, введите корректный номер телефона для выбранной страны.', submit: 'Подтвердить запись',
      done: 'Спасибо! Ваша запись подтверждена.', doneHint: 'Примерно за сутки до визита вам придёт напоминание. Если не сможете прийти, пожалуйста, сообщите нам для отмены записи.',
      gcal: '+ Google Календарь', ics: '+ Календарь телефона', home: 'На главную', demoToast: 'Демо: в рабочей версии здесь добавится событие в календарь',
      sumTitle: 'Ваша запись', sumProc: 'Процедура', sumDur: 'Длительность', sumDate: 'Дата', sumTime: 'Время', sumTotal: 'Итого', sumName: 'Имя', sumSvc: 'Услуга',
      help: ['Augusta Deglava iela 66, «Deglava Biroji», 5-й этаж, кабинет 506, Рига. Вопросы – ', 'WhatsApp', '.'], min: 'мин',
      footLive: 'Рабочая запись на текущем сайте',
      opts: { 'r-sleek': 'Массаж моделирования тела', 'b-flexy': 'Вакуумно-роликовый массаж', 'ems-zero-1': '1 процедура', 'ems-zero-2': '2 процедуры подряд', 'presoterapija': 'Лимфодренаж' },
      names: { 'presoterapija': 'Прессотерапия' }, dateFmt: '{wd}, {d} {m}',
    },
    months: MONTHS_NOM.ru, monthsDate: MONTHS_DATE.ru, wdShort: WD_SHORT.ru, wdFull: WD_FULL.ru, wdHead: WD_HEAD.ru,
  },

  // ───────────────────────────── LATVIEŠU ─────────────────────────────
  lv: {
    code: 'LV', htmlLang: 'lv', ogLocale: 'lv_LV',
    homeTitle: 'BodyLab.Beauty – ķermeņa modelēšanas studija Rīgā (jaunais dizains)',
    bookTitle: 'Tiešsaistes pieraksts – BodyLab.Beauty (jaunais dizains, demo)',
    menuAria: 'Izvēlne', backToSite: 'Atpakaļ uz vietni', book: 'Pierakstīties', bookOnline: 'Pierakstīties online',
    menu: ['Procedūras', 'Kā norit vizīte', 'Cenas', 'Atsauksmes', 'Dāvanu karte', 'Kontakti'],
    langLabel: 'Valoda',
    live: 'Online pieraksts ir atvērts',
    h1a: 'Skaists ķermenis', h1b: 'sākas ', h1em: 'šeit',
    heroLead: 'Ķermeņa modelēšanas studija Rīgā: R-Sleek, B-Flexy, EMS Zero un presoterapija. Izvēlies procedūru un pierakstieties online.',
    pickTime: 'Izvēlēties laiku', seeTreatments: 'Skatīt procedūras',
    chip1: ['minūtes', 'viena procedūra'], chip2: ['no 20 €', 'pirmā procedūra'],
    strip: ['R-Sleek', 'B-Flexy', 'EMS Zero', 'Presoterapija', 'Limfodrenāža', 'Ķermeņa modelēšana'],
    pin: { eyebrow: 'Procedūras', h2a: 'Četras procedūras – ', h2em: 'izvēlies savu', lead: 'No dziļās masāžas līdz limfodrenāžai. Katrai procedūrai ir savs mērķis.' },
    details: 'Sīkāk',
    svc: {
      'r-sleek': { tag: 'Ķermeņa modelēšanas masāža', desc: 'Tiek veikta mehāniska iedarbība ar rotējošiem rullīšiem, kas rada dziļu masāžas efektu.', badge: 'Top procedūra',
        chips: ['Apjomu samazināšana', 'Limfodrenāža', 'Kolagēns', 'Ādas elastība'], prices: [['1 procedūra · 45 min', '35 €'], ['10 procedūras', '330 €']] },
      'b-flexy': { tag: 'Vakuuma rullīšu masāža', desc: 'Tiek izmantota rullīšu-vakuuma tehnoloģija, kur vienlaicīgi tiek veikta vakuuma sūkšana un mehāniska masāža.', badge: 'Pretcelulīta',
        chips: ['Pretcelulīta', 'Mikrocirkulācija', 'Ķermeņa kontūras', 'Ādas struktūra'], prices: [['1 procedūra · 45 min', '30 €'], ['10 procedūras', '280 €']] },
      'ems-zero': { tag: 'EMS muskuļu stimulācija', desc: 'Elektromagnētiskā muskuļu stimulācija, kas aktivizē muskuļu šķiedras un paātrina vielmaiņu.', badge: 'Bez piepūles',
        chips: ['Muskuļu tonuss', 'Tauku dedzināšana', 'Vielmaiņa', 'Bez slodzes'], prices: [['1 procedūra · 30 min', '20 €'], ['2 pēc kārtas · 60 min', '35 €']] },
      'presoterapija': { tag: 'Presoterapija / limfodrenāža', desc: 'Saspiesta gaisa iedarbība uz ķermeni, kas veicina limfas un šķidruma aizplūšanu.', badge: 'Atslābinoša',
        chips: ['Mazāk tūskas', 'Limfas aizplūšana', 'Vieglums kājās', 'Atslābināšanās'], prices: [['1 procedūra · 45 min', '25 €']] },
    },
    visit: { eyebrow: 'Kā tas darbojas', h2a: 'Viss, lai atnāktu ', h2em: 'un atslābtu', lead: 'Četri vienkārši soļi.',
      steps: [
        ['Izvēlies laiku online', 'Izvēlies brīvu laiku tiešsaistes kalendārā un aizpildi īsu formu – reģistrācija nav nepieciešama.'],
        ['Atnāc uz studiju', 'Deglava Biroji, 5. stāvs, 506. kabinets. Vienu dienu pirms vizītes pienāks atgādinājums.'],
        ['Procedūra 30–45 minūtes', 'Viena procedūra ilgst 30 vai 45 minūtes, EMS Zero var izvēlēties arī 60 minūtēm (divas pēc kārtas).'],
        ['Abonements ir izdevīgāks', 'R-Sleek un B-Flexy ir pieejams 10 procedūru abonements – lētāk nekā 10 atsevišķas procedūras.'],
      ] },
    stats: { eyebrow: 'BodyLab.Beauty skaitļos', h2a: 'Vienkārši, saprotami ', h2em: 'un godīgi', labels: ['procedūras vienā studijā', 'ilgst pamatprocedūra', 'pirmās procedūras cena'], min: ' min', from: 'no ', eur: ' €' },
    prices: { eyebrow: 'Cenas', h2a: 'Procedūru ', h2em: 'varianti', choose: 'Izvēlēties', min: 'min',
      cards: {
        'b-flexy': { badge: 'Pretcelulīta', items: ['1 procedūra', '10 procedūru abonements: 280 €', 'Vakuuma rullīšu masāža'] },
        'r-sleek': { badge: 'Top procedūra', items: ['1 procedūra', '10 procedūru abonements: 330 €', 'Dziļa modelējoša masāža'] },
        'ems-zero': { badge: 'Bez piepūles', items: ['1 procedūra', '2 pēc kārtas (60 min): 35 €', 'Muskuļu stimulācija'] },
        'presoterapija': { badge: 'Atslābinoša', items: ['1 procedūra', 'Limfodrenāža', 'Vieglums kājās'] },
      },
      note: 'Ja pieraksts tiek atcelts vai pārcelts mazāk nekā 24 stundas pirms procedūras, tiek piemērota pilna cena. Maksāt var arī ar Stebby.' },
    reviews: { eyebrow: 'Atsauksmes', h2a: 'Ko raksta ', h2em: 'klientes', alt: 'Klienta atsauksme' },
    gift: { eyebrow: 'Dāvana', title: 'Dāvanu karte', desc: 'Nezini, ko uzdāvināt? BodyLab.Beauty dāvanu karte ir ideāla dāvana jebkurā gadījumā – izvēlies summu vai konkrētu procedūru, un mēs parūpēsimies par pārējo.',
      details: ['Derīga 3 mēnešus no iegādes datuma', 'Iespējams izvēlēties jebkuru summu vai konkrētu procedūru', 'Pieejama izdrukātā vai digitālā formātā'], btn: 'Pasūtīt dāvanu karti', wa: 'Sveiki! Es vēlos pasūtīt BodyLab.Beauty dāvanu karti.', alt: 'BodyLab.Beauty dāvanu karte' },
    stebby: { eyebrow: 'Apmaksa', title: 'Maksā ar Stebby', desc: 'Stebby ir lielākā labbūtības pabalstu platforma Baltijā. Ja tavs darba devējs piedāvā Stebby labumus, vari tos izmantot, lai apmaksātu BodyLab.Beauty procedūras tieši caur Stebby lietotni.' },
    contact: { eyebrow: 'Kontakti', h2a: 'Gaidām jūs ', h2em: 'studijā', address: 'Adrese', phone: 'Tālrunis', addrText: 'Augusta Deglava iela 66, «Deglava Biroji», 5. stāvs, 506. kabinets, Rīga', imgAlt1: 'BodyLab.Beauty studija', imgAlt2: 'Studijas interjers' },
    footer: { rights: '© BodyLab.Beauty · Rīga', current: 'Pašreizējā vietne', info: 'Informācija klientiem', thisPage: 'Pašreizējā procedūras lapa' },
    s: { treatments: 'Procedūras', about: 'Par procedūru', pickVariant: 'Izvēlies ', variantEm: 'variantu', honest: 'Godīgi par rezultātu', ask: 'Pajautāt WhatsApp',
      askText: (name, label) => `Sveiki! Vēlos uzzināt par: ${name}, ${label}.`, perSession: 'par procedūru', min: 'minūtes', oneSession: 'viena procedūra', length: 'ilgums', price: 'cena', orWord: ' vai ',
      onlineBook: 'Online pieraksts', from: 'no ', sessions: 'procedūras', ctaEyebrow: 'Pieraksts', ctaH2a: 'Gatavi ', ctaH2em: 'sākt?', ctaLead: 'Izvēlies brīvu laiku online – tas ir ātri.', faq: 'BUJ', waBtn: 'WhatsApp' },
    b: {
      demo: 'Demo lapa: šādi izskatīsies pieraksts. Dati netiek nosūtīti, bet laiki ir ģenerēti.',
      eyebrow: 'Tiešsaistes pieraksts', steps: ['Procedūra', 'Datums un laiks', 'Jūsu dati'],
      s1h: 'Kas jums der?', s1lead: 'Izvēlieties procedūru. Laiku un cenu apstiprināsim nākamajos soļos.', pickDate: 'Izvēlēties datumu',
      s2h: 'Izvēlies pieejamu datumu', s2lead: 'Brīvās dienas atzīmētas ar punktu. Pēc tam izvēlieties laiku.', prev: 'Iepriekšējais mēnesis', next: 'Nākamais mēnesis', back: 'Atpakaļ', toData: 'Jūsu dati',
      freeTime: 'Brīvie laiki', s3h: 'Gandrīz gatavs', s3lead: 'Atstājiet kontaktus – reģistrācija nav nepieciešama.',
      first: 'Vārds *', last: 'Uzvārds *', phone: 'Telefons *', ig: 'Instagram (nav obligāti)', comment: 'Komentārs (nav obligāti)', commentPh: 'Jautājumi, vēlmes vai cita informācija',
      terms: 'Apstiprinot pierakstu, Jūs piekrītat, ka gadījumā, ja pieraksts tiek atcelts vai pārcelts mazāk nekā 24 stundas pirms procedūras, tiek piemērota pilna procedūras cena.',
      errReq: 'Lūdzu, aizpildiet visus obligātos laukus.', errPhone: 'Lūdzu, ievadiet derīgu tālruņa numuru izvēlētajai valstij.', submit: 'Apstiprināt pierakstu',
      done: 'Paldies! Jūsu pieraksts ir apstiprināts.', doneHint: 'Vienu dienu pirms tikšanās jums pienāks atgādinājums. Ja nevarēsiet ierasties, lūdzu, informējiet mūs par pieraksta atcelšanu.',
      gcal: '+ Google Kalendārs', ics: '+ Tālruņa kalendārs', home: 'Uz sākumu', demoToast: 'Demo: darba versijā šeit tiks pievienots notikums kalendārā',
      sumTitle: 'Jūsu pieraksts', sumProc: 'Procedūra', sumDur: 'Ilgums', sumDate: 'Datums', sumTime: 'Laiks', sumTotal: 'Kopā', sumName: 'Vārds', sumSvc: 'Pakalpojums',
      help: ['Augusta Deglava iela 66, «Deglava Biroji», 5. stāvs, 506. kabinets, Rīga. Jautājumi – ', 'WhatsApp', '.'], min: 'min',
      footLive: 'Darbojošais pieraksts pašreizējā vietnē',
      opts: { 'r-sleek': 'Ķermeņa modelēšanas masāža', 'b-flexy': 'Vakuuma rullīšu masāža', 'ems-zero-1': '1 procedūra', 'ems-zero-2': '2 procedūras pēc kārtas', 'presoterapija': 'Limfodrenāža' },
      names: { 'presoterapija': 'Presoterapija' }, dateFmt: '{wd}, {d}. {m}',
    },
    months: MONTHS_NOM.lv, monthsDate: MONTHS_DATE.lv, wdShort: WD_SHORT.lv, wdFull: WD_FULL.lv, wdHead: WD_HEAD.lv,
  },

  // ───────────────────────────── ENGLISH ─────────────────────────────
  en: {
    code: 'EN', htmlLang: 'en', ogLocale: 'en_GB',
    homeTitle: 'BodyLab.Beauty – body contouring studio in Riga (new design)',
    bookTitle: 'Online booking – BodyLab.Beauty (new design, demo)',
    menuAria: 'Menu', backToSite: 'Back to site', book: 'Book now', bookOnline: 'Book online',
    menu: ['Treatments', 'How a visit works', 'Prices', 'Reviews', 'Gift card', 'Contact'],
    langLabel: 'Language',
    live: 'Online booking is open',
    h1a: 'A beautiful body', h1b: 'starts ', h1em: 'here',
    heroLead: 'Body contouring studio in Riga: R-Sleek, B-Flexy, EMS Zero and pressotherapy. Pick a treatment and book online.',
    pickTime: 'Choose a time', seeTreatments: 'See treatments',
    chip1: ['minutes', 'one session'], chip2: ['from €20', 'first session'],
    strip: ['R-Sleek', 'B-Flexy', 'EMS Zero', 'Pressotherapy', 'Lymphatic drainage', 'Body contouring'],
    pin: { eyebrow: 'Treatments', h2a: 'Four treatments – ', h2em: 'pick yours', lead: 'From deep massage to lymphatic drainage. Each treatment has its own purpose.' },
    details: 'Details',
    svc: {
      'r-sleek': { tag: 'Body contouring massage', desc: 'A mechanical treatment using rotating rollers that creates a deep massage effect.', badge: 'Top treatment',
        chips: ['Volume reduction', 'Lymph drainage', 'Collagen', 'Skin elasticity'], prices: [['1 session · 45 min', '€35'], ['10 sessions', '€330']] },
      'b-flexy': { tag: 'Vacuum roller massage', desc: 'Roller-vacuum technology combining vacuum suction with mechanical massage.', badge: 'Anti-cellulite',
        chips: ['Anti-cellulite', 'Microcirculation', 'Body contours', 'Skin texture'], prices: [['1 session · 45 min', '€30'], ['10 sessions', '€280']] },
      'ems-zero': { tag: 'EMS muscle stimulation', desc: 'Electromagnetic muscle stimulation that activates muscle fibers and speeds up metabolism.', badge: 'Effortless',
        chips: ['Muscle tone', 'Fat burning', 'Metabolism', 'No exercise'], prices: [['1 session · 30 min', '€20'], ['2 in a row · 60 min', '€35']] },
      'presoterapija': { tag: 'Pressotherapy / lymphatic drainage', desc: 'A compressed-air treatment that promotes lymph and fluid drainage.', badge: 'Relaxing',
        chips: ['Less swelling', 'Lymph flow', 'Lighter legs', 'Relaxation'], prices: [['1 session · 45 min', '€25']] },
    },
    visit: { eyebrow: 'How it works', h2a: 'Everything to come in ', h2em: 'and unwind', lead: 'Four simple steps.',
      steps: [
        ['Pick a time online', 'Choose a free time in the online calendar and fill in a short form – no account needed.'],
        ['Come to the studio', 'Deglava Biroji, 5th floor, room 506. You will get a reminder about a day before your visit.'],
        ['A 30–45 minute session', 'One session takes 30 or 45 minutes; EMS Zero can also be booked for 60 minutes (two in a row).'],
        ['A package is better value', 'R-Sleek and B-Flexy have a 10-session package – cheaper than 10 single sessions.'],
      ] },
    stats: { eyebrow: 'BodyLab.Beauty in numbers', h2a: 'Simple, clear ', h2em: 'and honest', labels: ['treatments in one studio', 'a main session lasts', 'price of the first session'], min: ' min', from: 'from €', eur: '' },
    prices: { eyebrow: 'Prices', h2a: 'Treatment ', h2em: 'options', choose: 'Choose', min: 'min',
      cards: {
        'b-flexy': { badge: 'Anti-cellulite', items: ['1 session', '10-session package: €280', 'Vacuum roller massage'] },
        'r-sleek': { badge: 'Top treatment', items: ['1 session', '10-session package: €330', 'Deep contouring massage'] },
        'ems-zero': { badge: 'Effortless', items: ['1 session', '2 in a row (60 min): €35', 'Muscle stimulation'] },
        'presoterapija': { badge: 'Relaxing', items: ['1 session', 'Lymphatic drainage', 'Lighter legs'] },
      },
      note: 'If a booking is cancelled or rescheduled less than 24 hours before the treatment, the full price applies. Stebby payment is accepted.' },
    reviews: { eyebrow: 'Reviews', h2a: 'What clients ', h2em: 'say', alt: 'Client review' },
    gift: { eyebrow: 'Gift', title: 'Gift card', desc: "Not sure what to gift? A BodyLab.Beauty gift card is the perfect present for any occasion – choose an amount or a specific treatment, and we'll take care of the rest.",
      details: ['Valid for 3 months from the purchase date', 'Choose any amount or a specific treatment', 'Available printed or sent digitally'], btn: 'Order a gift card', wa: 'Hello! I would like to order a BodyLab.Beauty gift card.', alt: 'BodyLab.Beauty gift card' },
    stebby: { eyebrow: 'Payment', title: 'Pay with Stebby', desc: 'Stebby is the largest employee wellness benefits platform in the Baltics. If your employer offers Stebby benefits, you can use them to pay for BodyLab.Beauty treatments directly through the Stebby app.' },
    contact: { eyebrow: 'Contact', h2a: 'See you ', h2em: 'at the studio', address: 'Address', phone: 'Phone', addrText: 'Augusta Deglava iela 66, “Deglava Biroji”, 5th floor, room 506, Riga, Latvia', imgAlt1: 'BodyLab.Beauty studio', imgAlt2: 'Studio interior' },
    footer: { rights: '© BodyLab.Beauty · Riga', current: 'Current site', info: 'Client information', thisPage: 'Current treatment page' },
    s: { treatments: 'Treatments', about: 'About the treatment', pickVariant: 'Choose an ', variantEm: 'option', honest: 'Honestly about results', ask: 'Ask on WhatsApp',
      askText: (name, label) => `Hello! I would like to know about: ${name}, ${label}.`, perSession: 'per session', min: 'minutes', oneSession: 'one session', length: 'duration', price: 'price', orWord: ' or ',
      onlineBook: 'Online booking', from: 'from ', sessions: 'sessions', ctaEyebrow: 'Booking', ctaH2a: 'Ready to ', ctaH2em: 'start?', ctaLead: 'Pick a free time online – it is quick.', faq: 'FAQ', waBtn: 'WhatsApp' },
    b: {
      demo: 'Demo page: this is how booking will look. Nothing is sent, and the available times are generated.',
      eyebrow: 'Online booking', steps: ['Treatment', 'Date & time', 'Your details'],
      s1h: 'What suits you?', s1lead: 'Choose a treatment. We confirm the time and price in the next steps.', pickDate: 'Choose a date',
      s2h: 'Choose an available date', s2lead: 'Free days are marked with a dot. Then pick a time.', prev: 'Previous month', next: 'Next month', back: 'Back', toData: 'Your details',
      freeTime: 'Available times', s3h: 'Almost done', s3lead: 'Leave your contact details – no account needed.',
      first: 'First name *', last: 'Last name *', phone: 'Phone *', ig: 'Instagram (optional)', comment: 'Comment (optional)', commentPh: 'Questions, wishes or anything else',
      terms: 'By confirming your booking, you agree that if it is cancelled or rescheduled less than 24 hours before the treatment, the full price of the treatment is charged.',
      errReq: 'Please fill in all required fields.', errPhone: 'Please enter a valid phone number for the selected country.', submit: 'Confirm booking',
      done: 'Thank you! Your booking is confirmed.', doneHint: "You'll receive a reminder about a day before your appointment. If you can't make it, please let us know so we can cancel your booking.",
      gcal: '+ Google Calendar', ics: '+ Phone Calendar', home: 'Home', demoToast: 'Demo: in the live version this adds the event to your calendar',
      sumTitle: 'Your booking', sumProc: 'Treatment', sumDur: 'Duration', sumDate: 'Date', sumTime: 'Time', sumTotal: 'Total', sumName: 'Name', sumSvc: 'Service',
      help: ['Augusta Deglava iela 66, “Deglava Biroji”, 5th floor, room 506, Riga. Questions – ', 'WhatsApp', '.'], min: 'min',
      footLive: 'Working booking on the current site',
      opts: { 'r-sleek': 'Body contouring massage', 'b-flexy': 'Vacuum roller massage', 'ems-zero-1': '1 session', 'ems-zero-2': '2 sessions in a row', 'presoterapija': 'Lymphatic drainage' },
      names: { 'presoterapija': 'Pressotherapy' }, dateFmt: '{wd}, {d} {m}',
    },
    months: MONTHS_NOM.en, monthsDate: MONTHS_DATE.en, wdShort: WD_SHORT.en, wdFull: WD_FULL.en, wdHead: WD_HEAD.en,
  },
};
