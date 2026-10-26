// Тест «Подберите процедуру»: 10 вопросов, баллы по четырём процедурам.
// Баллы привязаны только к уже опубликованным целям процедур (tools/content.mjs): объём тела, лимфодренаж,
// тонус кожи, целлюлит, микроциркуляция, мышечный тонус, отёки, расслабление. Никаких медицинских утверждений:
// это подсказка, под результатом показывается оговорка (текст beforeText с основного сайта).
//
// W[i][j] – баллы за j-й вариант i-го вопроса в порядке [r-sleek, b-flexy, ems-zero, presoterapija]
export const IDS = ['r-sleek', 'b-flexy', 'ems-zero', 'presoterapija'];

export const W = [
  // 1 главная цель
  [[3, 1, 1, 0], [1, 3, 0, 0], [0, 0, 3, 0], [0, 0, 0, 3], [1, 0, 0, 2]],
  // 2 зона
  [[2, 2, 1, 0], [2, 1, 2, 0], [1, 1, 0, 2], [1, 0, 2, 0], [2, 1, 1, 1]],
  // 3 отношение к нагрузке
  [[1, 0, 1, 0], [0, 0, 3, 0], [0, 1, 1, 0]],
  // 4 какое воздействие комфортнее
  [[3, 1, 0, 0], [1, 3, 0, 0], [0, 0, 0, 3], [0, 0, 3, 0]],
  // 5 время на визит
  [[0, 0, 2, 0], [1, 1, 0, 1], [0, 0, 1, 0]],
  // 6 отёки и тяжесть в ногах
  [[0, 0, 0, 3], [0, 0, 0, 1], [0, 0, 0, 0]],
  // 7 состояние кожи / целлюлит
  [[1, 3, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0]],
  // 8 регулярность
  [[0, 0, 0, 0], [1, 1, 0, 0]],
  // 9 образ жизни
  [[0, 0, 0, 2], [0, 0, 0, 2], [1, 0, 1, 0]],
  // 10 что важнее
  [[2, 1, 1, 0], [1, 2, 0, 0], [0, 0, 3, 0], [0, 0, 0, 3]],
];

// «Почему»: какие опубликованные цели процедуры показываем в результате (индексы goals из tools/content.mjs)
export const WHY = { 'r-sleek': [0, 1, 3], 'b-flexy': [0, 1, 2], 'ems-zero': [0, 1, 3], 'presoterapija': [0, 1, 2] };

export const QUIZ = {
  ru: [
    ['Что для вас сейчас главное?', ['Уменьшить объёмы и подчеркнуть контуры', 'Заняться целлюлитом и неровной кожей', 'Подтянуть мышцы без тренировок', 'Убрать отёки и тяжесть в ногах', 'Просто расслабиться']],
    ['С какой зоной хотите поработать?', ['Бёдра и ягодицы', 'Живот и талия', 'Ноги', 'Руки и спина', 'Всё тело']],
    ['Как вы относитесь к физической нагрузке?', ['Люблю тренироваться', 'Хочу результат без нагрузки', 'Иногда занимаюсь']],
    ['Какое воздействие вам комфортнее?', ['Глубокий, интенсивный массаж', 'Вакуум и ролики', 'Мягкое расслабляющее', 'Стимуляция мышц']],
    ['Сколько времени у вас есть на визит?', ['Около 30 минут', 'До 45 минут', 'Час и больше']],
    ['Беспокоят ли вас отёки или тяжесть в ногах?', ['Да, часто', 'Иногда', 'Нет']],
    ['Беспокоит ли вас целлюлит или неровность кожи?', ['Да, заметно', 'Немного', 'Нет']],
    ['Как вам удобнее?', ['Попробовать один раз', 'Пройти курс процедур']],
    ['Какой у вас образ жизни?', ['Сидячая работа', 'Много на ногах', 'Активный']],
    ['Что для вас важнее всего?', ['Форма и объёмы', 'Состояние кожи', 'Тонус мышц', 'Самочувствие и лёгкость']],
  ],
  lv: [
    ['Kas tev šobrīd ir svarīgākais?', ['Samazināt apjomus un uzsvērt kontūras', 'Pievērsties celulītam un nelīdzenai ādai', 'Nostiprināt muskuļus bez treniņiem', 'Mazināt tūsku un smagumu kājās', 'Vienkārši atslābināties']],
    ['Ar kuru zonu vēlies strādāt?', ['Gurni un sēžamvieta', 'Vēders un vidukļa zona', 'Kājas', 'Rokas un mugura', 'Viss ķermenis']],
    ['Kā tu attiecies pret fiziskām aktivitātēm?', ['Man patīk trenēties', 'Vēlos rezultātu bez slodzes', 'Dažreiz nodarbojos']],
    ['Kāda iedarbība tev ir ērtāka?', ['Dziļa, intensīva masāža', 'Vakuums un rullīši', 'Maiga, atslābinoša', 'Muskuļu stimulācija']],
    ['Cik laika tev ir vizītei?', ['Apmēram 30 minūtes', 'Līdz 45 minūtēm', 'Stunda un vairāk']],
    ['Vai tevi traucē tūska vai smagums kājās?', ['Jā, bieži', 'Dažreiz', 'Nē']],
    ['Vai tevi traucē celulīts vai nelīdzena āda?', ['Jā, ir pamanāms', 'Nedaudz', 'Nē']],
    ['Kā tev ir ērtāk?', ['Izmēģināt vienu reizi', 'Iziet procedūru kursu']],
    ['Kāds ir tavs dzīvesveids?', ['Mazkustīgs darbs', 'Daudz uz kājām', 'Aktīvs']],
    ['Kas tev ir svarīgākais?', ['Forma un apjomi', 'Ādas stāvoklis', 'Muskuļu tonuss', 'Pašsajūta un vieglums']],
  ],
  en: [
    ['What matters most to you right now?', ['Reduce volume and define contours', 'Tackle cellulite and uneven skin', 'Tone muscles without working out', 'Ease swelling and heavy legs', 'Simply relax']],
    ['Which area would you like to work on?', ['Hips and glutes', 'Stomach and waist', 'Legs', 'Arms and back', 'The whole body']],
    ['How do you feel about exercise?', ['I like working out', 'I want results without exercise', 'I exercise occasionally']],
    ['Which kind of treatment feels more comfortable?', ['Deep, intensive massage', 'Vacuum and rollers', 'Gentle and relaxing', 'Muscle stimulation']],
    ['How much time do you have for a visit?', ['About 30 minutes', 'Up to 45 minutes', 'An hour or more']],
    ['Do swelling or heavy legs bother you?', ['Yes, often', 'Sometimes', 'No']],
    ['Do cellulite or uneven skin bother you?', ['Yes, noticeably', 'A little', 'No']],
    ['What suits you better?', ['Try it once', 'Do a course of sessions']],
    ['What is your lifestyle like?', ['Desk job', 'On my feet a lot', 'Active']],
    ['What matters most?', ['Shape and volume', 'Skin condition', 'Muscle tone', 'Well-being and lightness']],
  ],
};
