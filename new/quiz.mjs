// Тест «Подберите процедуру»: 5 ключевых вопросов, баллы по четырём процедурам.
// Баллы привязаны только к уже опубликованным целям процедур (tools/content.mjs): объём тела, лимфодренаж,
// тонус кожи, целлюлит, микроциркуляция, мышечный тонус, отёки, расслабление. Никаких медицинских утверждений:
// это подсказка, под результатом показывается оговорка (текст beforeText с основного сайта).
//
// W[i][j] – баллы за j-й вариант i-го вопроса в порядке [r-sleek, b-flexy, ems-zero, presoterapija]
export const IDS = ['r-sleek', 'b-flexy', 'ems-zero', 'presoterapija'];

export const W = [
  // 1 главная цель
  [[3, 1, 1, 0], [1, 3, 0, 0], [0, 0, 3, 0], [0, 0, 0, 3], [1, 0, 0, 2]],
  // 2 отношение к нагрузке
  [[1, 0, 1, 0], [0, 0, 3, 0], [0, 1, 1, 0]],
  // 3 какое воздействие комфортнее
  [[3, 1, 0, 0], [1, 3, 0, 0], [0, 0, 0, 3], [0, 0, 3, 0]],
  // 4 отёки и тяжесть в ногах
  [[0, 0, 0, 3], [0, 0, 0, 1], [0, 0, 0, 0]],
  // 5 целлюлит / неровная кожа
  [[1, 3, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0]],
];

// «Почему»: какие опубликованные цели процедуры показываем в результате (индексы goals из tools/content.mjs)
export const WHY = { 'r-sleek': [0, 1, 3], 'b-flexy': [0, 1, 2], 'ems-zero': [0, 1, 3], 'presoterapija': [0, 1, 2] };

export const QUIZ = {
  ru: [
    ['Что для вас сейчас главное?', ['Уменьшить объёмы и подчеркнуть контуры', 'Заняться целлюлитом и неровной кожей', 'Подтянуть мышцы без тренировок', 'Убрать отёки и тяжесть в ногах', 'Просто расслабиться']],
    ['Как вы относитесь к физической нагрузке?', ['Люблю тренироваться', 'Хочу результат без нагрузки', 'Иногда занимаюсь']],
    ['Какое воздействие вам комфортнее?', ['Глубокий, интенсивный массаж', 'Вакуум и ролики', 'Мягкое расслабляющее', 'Стимуляция мышц']],
    ['Беспокоят ли вас отёки или тяжесть в ногах?', ['Да, часто', 'Иногда', 'Нет']],
    ['Беспокоит ли вас целлюлит или неровность кожи?', ['Да, заметно', 'Немного', 'Нет']],
  ],
  lv: [
    ['Kas tev šobrīd ir svarīgākais?', ['Samazināt apjomus un uzsvērt kontūras', 'Pievērsties celulītam un nelīdzenai ādai', 'Nostiprināt muskuļus bez treniņiem', 'Mazināt tūsku un smagumu kājās', 'Vienkārši atslābināties']],
    ['Kā tu attiecies pret fiziskām aktivitātēm?', ['Man patīk trenēties', 'Vēlos rezultātu bez slodzes', 'Dažreiz nodarbojos']],
    ['Kāda iedarbība tev ir ērtāka?', ['Dziļa, intensīva masāža', 'Vakuums un rullīši', 'Maiga, atslābinoša', 'Muskuļu stimulācija']],
    ['Vai tevi traucē tūska vai smagums kājās?', ['Jā, bieži', 'Dažreiz', 'Nē']],
    ['Vai tevi traucē celulīts vai nelīdzena āda?', ['Jā, ir pamanāms', 'Nedaudz', 'Nē']],
  ],
  en: [
    ['What matters most to you right now?', ['Reduce volume and define contours', 'Tackle cellulite and uneven skin', 'Tone muscles without working out', 'Ease swelling and heavy legs', 'Simply relax']],
    ['How do you feel about exercise?', ['I like working out', 'I want results without exercise', 'I exercise occasionally']],
    ['Which kind of treatment feels more comfortable?', ['Deep, intensive massage', 'Vacuum and rollers', 'Gentle and relaxing', 'Muscle stimulation']],
    ['Do swelling or heavy legs bother you?', ['Yes, often', 'Sometimes', 'No']],
    ['Do cellulite or uneven skin bother you?', ['Yes, noticeably', 'A little', 'No']],
  ],
};
