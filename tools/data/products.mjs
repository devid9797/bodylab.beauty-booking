// Arosha product catalogue (prices, names, texts in lv/en/ru). Moved here from the old index.html;
// edit prices and texts in this file, then run: node tools/build.mjs
export const PRODUCT_ORDER = [
  "niodrain",
  "cellunight",
  "bodyrescue",
  "pressopants",
  "silhouetterefill",
  "silhouettepants",
  "niodrainpantset",
  "niodrainpantrefill",
  "bodyslim"
];

export const PRODUCTS = {
  "niodrain": {
    "image": "/images/product-niodrain.jpg",
    "price": "65 €",
    "content": {
      "lv": {
        "name": "Arosha 501 Nio Drain",
        "size": "200 ml",
        "sizes": null,
        "description": "Drenējošs krēms ar īpašām aktīvajām sastāvdaļām, kurām piemīt drenējošas un asinsvadus sašaurinošas īpašības.",
        "composition": [
          [
            "E vitamīns",
            "Spēcīgs antioksidants, atjauno ādas mitrumu un stiprina kolagēnu."
          ],
          [
            "Saldo mandeļu eļļa",
            "Bagātīgi mitrina un veicina audu atjaunošanos."
          ],
          [
            "Rīsu eļļa",
            "Antioksidanta iedarbība, aizsargā ādu."
          ],
          [
            "NIOCONTROL tehnoloģija",
            "Aktīvās vielas iekapsulētas niosomās labākai uzsūkšanai."
          ]
        ],
        "usage": "Uzklāt uz ādas un masēt, līdz pilnībā uzsūcies. Izvairīties no kontakta ar acīm un gļotādām.",
        "properties": [
          "Uzlabo mikrocirkulāciju",
          "Veicina šķidruma aizplūšanu",
          "Antioksidanta aizsardzība",
          "Viegla, ātri uzsūcas tekstūra"
        ]
      },
      "en": {
        "name": "Arosha 501 Nio Drain",
        "size": "200 ml",
        "sizes": null,
        "description": "A draining cream with specific active ingredients that have draining and vasoconstrictive properties.",
        "composition": [
          [
            "Vitamin E",
            "Powerful antioxidant, restores skin hydration and strengthens collagen."
          ],
          [
            "Sweet Almond Oil",
            "Deeply moisturising, supports tissue renewal."
          ],
          [
            "Rice Bran Oil",
            "Antioxidant protection for the skin."
          ],
          [
            "NIOCONTROL technology",
            "Active ingredients encapsulated in niosomes for better absorption."
          ]
        ],
        "usage": "Apply to the skin and massage until fully absorbed. Avoid contact with eyes and mucous membranes.",
        "properties": [
          "Improves microcirculation",
          "Promotes fluid drainage",
          "Antioxidant protection",
          "Light, fast-absorbing texture"
        ]
      },
      "ru": {
        "name": "Arosha 501 Nio Drain",
        "size": "200 мл",
        "sizes": null,
        "description": "Дренажный крем со специальными активными веществами, обладающими дренажным и сосудосуживающим действием.",
        "composition": [
          [
            "Витамин E",
            "Мощный антиоксидант, восстанавливает увлажнённость кожи и укрепляет коллаген."
          ],
          [
            "Масло сладкого миндаля",
            "Глубоко увлажняет, способствует восстановлению тканей."
          ],
          [
            "Рисовое масло",
            "Антиоксидантная защита кожи."
          ],
          [
            "Технология NIOCONTROL",
            "Активные вещества в ниосомах для лучшего проникновения."
          ]
        ],
        "usage": "Нанести на кожу и массировать до полного впитывания. Избегать контакта с глазами и слизистыми.",
        "properties": [
          "Улучшает микроциркуляцию",
          "Способствует оттоку жидкости",
          "Антиоксидантная защита",
          "Лёгкая, быстро впитывающаяся текстура"
        ]
      }
    }
  },
  "pressopants": {
    "image": "/images/product-pressopants.jpg",
    "price": "75 €",
    "content": {
      "lv": {
        "name": "Arosha 500 Pressopants",
        "size": null,
        "sizes": "S (38-40), M (42-44), L (46-48), XL/XXL (50-52)",
        "description": "Kompresijas legingi ar Dermofibra® Bio-Infrared diegu, lai stimulētu asinsriti un izvadītu lieko šķidrumu.",
        "usage": "Valkāt dienā vai naktī, virs vai zem apģērba, arī sporta laikā. Mazgāt tikai ar rokām. Ieteicams lietot kopā ar Arosha ķermeņa krēmiem.",
        "properties": [
          "Uzlabo asinsriti",
          "Drenējošs efekts",
          "Mazina celulīta izpausmes",
          "Uzlabo ķermeņa kontūras"
        ]
      },
      "en": {
        "name": "Arosha 500 Pressopants",
        "size": null,
        "sizes": "S (38-40), M (42-44), L (46-48), XL/XXL (50-52)",
        "description": "Compression leggings with Dermofibra® Bio-Infrared thread to stimulate circulation and remove excess fluid.",
        "usage": "Wear day or night, over or under clothing, even during sport. Hand wash only. Recommended together with Arosha body creams.",
        "properties": [
          "Improves circulation",
          "Draining effect",
          "Reduces the appearance of cellulite",
          "Improves body contours"
        ]
      },
      "ru": {
        "name": "Arosha 500 Pressopants",
        "size": null,
        "sizes": "S (38-40), M (42-44), L (46-48), XL/XXL (50-52)",
        "description": "Компрессионные легинсы с нитью Dermofibra® Bio-Infrared для стимуляции кровообращения и выведения лишней жидкости.",
        "usage": "Носить днём или ночью, поверх или под одеждой, можно во время спорта. Стирать только вручную. Рекомендуется использовать вместе с кремами Arosha.",
        "properties": [
          "Улучшает кровообращение",
          "Дренажный эффект",
          "Уменьшает проявления целлюлита",
          "Улучшает контуры тела"
        ]
      }
    }
  },
  "silhouetterefill": {
    "image": "/images/product-silhouette-refill.jpg",
    "price": "18 €",
    "content": {
      "lv": {
        "name": "Arosha 521 Silhouette Pants Refill",
        "size": "1 uzpildes komplekts",
        "sizes": null,
        "description": "Kosmētiskais līdzeklis cīņai ar celulīta nepilnībām, satur fosfatidilholīnu un kofeīnu.",
        "usage": "Uzvilkt .521 Silhouette bikses, virsū uzvilkt plastmasas bikses, atstāt 30-60 min, noņemt un iemasēt atlikušo produktu. Bikses izskalot zem tekoša ūdens, žāvēt gaisā. Lietot 1-2 reizes nedēļā.",
        "properties": [
          "Tauku šķelšana",
          "Celulīta korekcija",
          "Ādas struktūras uzlabošana",
          "Ādas gludināšana un tonizēšana"
        ]
      },
      "en": {
        "name": "Arosha 521 Silhouette Pants Refill",
        "size": "1 refill kit",
        "sizes": null,
        "description": "A cosmetic treatment for cellulite imperfections, containing phosphatidylcholine and caffeine.",
        "usage": "Put on the .521 Silhouette pants, cover with the plastic shorts, leave for 30-60 minutes, remove and massage in the remaining product. Rinse the pants under running water and air dry. Use 1-2 times a week.",
        "properties": [
          "Fat breakdown",
          "Cellulite correction",
          "Improves skin texture",
          "Smooths and tones the skin"
        ]
      },
      "ru": {
        "name": "Arosha 521 Silhouette Pants Refill",
        "size": "1 комплект заправки",
        "sizes": null,
        "description": "Косметическое средство для борьбы с проявлениями целлюлита, содержит фосфатидилхолин и кофеин.",
        "usage": "Надеть брюки .521 Silhouette, сверху пластиковые шорты, оставить на 30-60 минут, снять и втереть остаток средства. Промыть брюки под проточной водой, сушить на воздухе. Использовать 1-2 раза в неделю.",
        "properties": [
          "Расщепление жира",
          "Коррекция целлюлита",
          "Улучшение текстуры кожи",
          "Разглаживание и тонизирование кожи"
        ]
      }
    }
  },
  "silhouettepants": {
    "image": "/images/product-silhouettepants.jpg",
    "price": "50 €",
    "content": {
      "lv": {
        "name": "Arosha 521 Silhouette Pants (bikses + uzpilde)",
        "size": null,
        "sizes": "Viens izmērs (S-L)",
        "description": "Kosmētiskais līdzeklis cīņai ar celulīta nepilnībām, satur fosfatidilholīnu un kofeīnu.",
        "usage": "Uzvilkt .521 Silhouette bikses, virsū uzvilkt plastmasas bikses, atstāt 30-60 min, noņemt un iemasēt atlikušo produktu. Bikses izskalot zem tekoša ūdens, žāvēt gaisā. Pirms nākamās lietošanas legingus atkārtoti piesūcināt ar uzpildes serumu. Lietot 1-2 reizes nedēļā.",
        "properties": [
          "Tauku šķelšana",
          "Celulīta korekcija",
          "Ādas struktūras uzlabošana",
          "Ādas gludināšana un tonizēšana"
        ]
      },
      "en": {
        "name": "Arosha 521 Silhouette Pants (pants + refill)",
        "size": null,
        "sizes": "One size (S-L)",
        "description": "A cosmetic treatment for cellulite imperfections, containing phosphatidylcholine and caffeine.",
        "usage": "Put on the .521 Silhouette pants, cover with the plastic shorts, leave for 30-60 minutes, remove and massage in the remaining product. Rinse the pants under running water and air dry. Re-soak the leggings in the refill serum before the next use. Use 1-2 times a week.",
        "properties": [
          "Fat breakdown",
          "Cellulite correction",
          "Improves skin texture",
          "Smooths and tones the skin"
        ]
      },
      "ru": {
        "name": "Arosha 521 Silhouette Pants (брюки + заправка)",
        "size": null,
        "sizes": "Один размер (S-L)",
        "description": "Косметическое средство для борьбы с проявлениями целлюлита, содержит фосфатидилхолин и кофеин.",
        "usage": "Надеть брюки .521 Silhouette, сверху пластиковые шорты, оставить на 30-60 минут, снять и втереть остаток средства. Промыть брюки под проточной водой, сушить на воздухе. Перед следующим использованием пропитать легинсы заправочной сывороткой. Использовать 1-2 раза в неделю.",
        "properties": [
          "Расщепление жира",
          "Коррекция целлюлита",
          "Улучшение текстуры кожи",
          "Разглаживание и тонизирование кожи"
        ]
      }
    }
  },
  "niodrainpantset": {
    "image": "/images/product-niodrainpant-set.jpg",
    "price": "50 €",
    "content": {
      "lv": {
        "name": "Arosha 520 Nio Drain Pant (bikses + uzpilde)",
        "size": null,
        "sizes": "Viens izmērs (S-L)",
        "description": "Kosmētikas līdzeklis ar drenāžas īpašībām, kurā iekapsulēts bērza ekstrakts un Nāves jūras sāļi.",
        "usage": "Uzvilkt drenējošās bikses, virsū uzvilkt plastmasas bikses uz 30-60 min, pēc tam noņemt un iemasēt atlikušo produktu. Bikses izskalot zem tekoša ūdens. Lietot 1-2 reizes nedēļā.",
        "properties": [
          "Mazina kāju smaguma sajūtu un pietūkumu",
          "Detoksikācija",
          "Stimulē mikrocirkulāciju",
          "Pretiekaisuma iedarbība"
        ]
      },
      "en": {
        "name": "Arosha 520 Nio Drain Pant (pants + refill)",
        "size": null,
        "sizes": "One size (S-L)",
        "description": "A cosmetic product with draining properties, featuring encapsulated birch extract and Dead Sea salts.",
        "usage": "Put on the draining pants, cover with the plastic shorts for 30-60 minutes, then remove and massage in the remaining product. Rinse the pants under running water. Use 1-2 times a week.",
        "properties": [
          "Reduces heavy, swollen legs",
          "Detoxifying",
          "Stimulates microcirculation",
          "Anti-inflammatory"
        ]
      },
      "ru": {
        "name": "Arosha 520 Nio Drain Pant (брюки + заправка)",
        "size": null,
        "sizes": "Один размер (S-L)",
        "description": "Косметическое средство с дренажными свойствами, содержащее инкапсулированный экстракт берёзы и соли Мёртвого моря.",
        "usage": "Надеть дренажные брюки, сверху пластиковые шорты на 30-60 минут, затем снять и втереть остаток средства. Промыть брюки под проточной водой. Использовать 1-2 раза в неделю.",
        "properties": [
          "Уменьшает тяжесть и отёчность ног",
          "Детоксикация",
          "Стимулирует микроциркуляцию",
          "Противовоспалительное действие"
        ]
      }
    }
  },
  "niodrainpantrefill": {
    "image": "/images/product-niodrainpant-refill.jpg",
    "price": "18 €",
    "content": {
      "lv": {
        "name": "Arosha 520 Nio Drain Pants Refill",
        "size": "1 uzpildes komplekts (bez legingiem)",
        "sizes": null,
        "description": "Kosmētikas līdzeklis ar drenāžas īpašībām, kurā iekapsulēts bērza ekstrakts un Nāves jūras sāļi.",
        "usage": "Uzvilkt drenējošās bikses, virsū uzvilkt plastmasas bikses uz 30-60 min, pēc tam noņemt un iemasēt atlikušo produktu. Bikses izskalot zem tekoša ūdens. Lietot 1-2 reizes nedēļā.",
        "properties": [
          "Mazina kāju smaguma sajūtu un pietūkumu",
          "Detoksikācija",
          "Stimulē mikrocirkulāciju",
          "Pretiekaisuma iedarbība"
        ]
      },
      "en": {
        "name": "Arosha 520 Nio Drain Pants Refill",
        "size": "1 refill kit (no leggings)",
        "sizes": null,
        "description": "A cosmetic product with draining properties, featuring encapsulated birch extract and Dead Sea salts.",
        "usage": "Put on the draining pants, cover with the plastic shorts for 30-60 minutes, then remove and massage in the remaining product. Rinse the pants under running water. Use 1-2 times a week.",
        "properties": [
          "Reduces heavy, swollen legs",
          "Detoxifying",
          "Stimulates microcirculation",
          "Anti-inflammatory"
        ]
      },
      "ru": {
        "name": "Arosha 520 Nio Drain Pants Refill",
        "size": "1 комплект заправки (без брюк)",
        "sizes": null,
        "description": "Косметическое средство с дренажными свойствами, содержащее инкапсулированный экстракт берёзы и соли Мёртвого моря.",
        "usage": "Надеть дренажные брюки, сверху пластиковые шорты на 30-60 минут, затем снять и втереть остаток средства. Промыть брюки под проточной водой. Использовать 1-2 раза в неделю.",
        "properties": [
          "Уменьшает тяжесть и отёчность ног",
          "Детоксикация",
          "Стимулирует микроциркуляцию",
          "Противовоспалительное действие"
        ]
      }
    }
  },
  "cellunight": {
    "image": "/images/product-cellunight.jpg",
    "price": "65 €",
    "content": {
      "lv": {
        "name": "Arosha 516 Cellunight",
        "size": "200 ml",
        "sizes": null,
        "description": "Nakts krēms ar NOCTURSHAPE™, kas iedarbojas uz nakts olbaltumvielu atbildīgo par tauku uzkrāšanos.",
        "composition": [
          [
            "NOCTURSHAPE™",
            "No planktona iegūta molekula, kas bloķē nakts tauku uzkrāšanos."
          ],
          [
            "Kofeīns",
            "Stimulē tauku šķelšanos, antioksidants."
          ],
          [
            "Karnitīns",
            "Atbalsta tauku dedzināšanu."
          ],
          [
            "Kolagenāzes ferments",
            "Mazina \"apelsīna mizas\" efektu."
          ],
          [
            "Sviesta koka sviests, mandeļu un rīsu eļļas",
            "Mitrina un mīkstina ādu."
          ]
        ],
        "usage": "Uzklāt vakarā uz ādas, masēt līdz pilnīgai uzsūkšanai. Tikai ārējai lietošanai.",
        "properties": [
          "Mazina celulīta izpausmes",
          "Uzlabo ādas elastību",
          "Nostiprina un tonizē ādu"
        ]
      },
      "en": {
        "name": "Arosha 516 Cellunight",
        "size": "200 ml",
        "sizes": null,
        "description": "A night cream with NOCTURSHAPE™, which targets the night-time protein responsible for fat storage.",
        "composition": [
          [
            "NOCTURSHAPE™",
            "Plankton-derived molecule that blocks night-time fat storage."
          ],
          [
            "Caffeine",
            "Stimulates fat breakdown, antioxidant."
          ],
          [
            "Carnitine",
            "Supports fat burning."
          ],
          [
            "Collagenase enzyme",
            "Reduces the \"orange peel\" effect."
          ],
          [
            "Shea butter, almond & rice oils",
            "Moisturise and soften the skin."
          ]
        ],
        "usage": "Apply in the evening and massage until fully absorbed. External use only.",
        "properties": [
          "Reduces the appearance of cellulite",
          "Improves skin elasticity",
          "Firms and tones the skin"
        ]
      },
      "ru": {
        "name": "Arosha 516 Cellunight",
        "size": "200 мл",
        "sizes": null,
        "description": "Ночной крем с NOCTURSHAPE™, воздействующий на ночной белок, отвечающий за накопление жира.",
        "composition": [
          [
            "NOCTURSHAPE™",
            "Молекула из планктона, блокирующая ночное накопление жира."
          ],
          [
            "Кофеин",
            "Стимулирует расщепление жиров, антиоксидант."
          ],
          [
            "Карнитин",
            "Поддерживает сжигание жира."
          ],
          [
            "Фермент коллагеназа",
            "Уменьшает эффект «апельсиновой корки»."
          ],
          [
            "Масло ши, миндальное и рисовое масла",
            "Увлажняют и смягчают кожу."
          ]
        ],
        "usage": "Наносить вечером и массировать до полного впитывания. Только для наружного применения.",
        "properties": [
          "Уменьшает проявления целлюлита",
          "Улучшает эластичность кожи",
          "Укрепляет и тонизирует кожу"
        ]
      }
    }
  },
  "bodyslim": {
    "image": "/images/product-bodyslim.jpg",
    "price": "80 €",
    "content": {
      "lv": {
        "name": "Arosha 503 Bodyslim",
        "size": null,
        "sizes": "S/M, M/L, L/XL, XL/XXL",
        "description": "Bodijs no Dermofibra® diega ar slaidinošu un ķermeņa formu veidojošu efektu uz vēdera zonas.",
        "usage": "Mazgāt tikai ar rokām 30°C temperatūrā, nelietot audu mīkstinātāju. Uzmanīgi ar pulksteņiem un rotaslietām.",
        "properties": [
          "Tonizējošs un veidojošs efekts",
          "Uzlabo asinsriti",
          "Limfātiskā atbalsta iedarbība",
          "Mazina celulīta izpausmes"
        ]
      },
      "en": {
        "name": "Arosha 503 Bodyslim",
        "size": null,
        "sizes": "S/M, M/L, L/XL, XL/XXL",
        "description": "A bodysuit made from Dermofibra® thread with a slimming and body-shaping effect on the abdominal area.",
        "usage": "Hand wash only at 30°C, no fabric softener. Be careful around watches and jewellery.",
        "properties": [
          "Toning, reshaping effect",
          "Improves circulation",
          "Supports lymphatic drainage",
          "Reduces the appearance of cellulite"
        ]
      },
      "ru": {
        "name": "Arosha 503 Bodyslim",
        "size": null,
        "sizes": "S/M, M/L, L/XL, XL/XXL",
        "description": "Боди из нити Dermofibra® с моделирующим и подтягивающим эффектом в области живота.",
        "usage": "Стирать только вручную при 30°C, без кондиционера для белья. Соблюдать осторожность рядом с часами и украшениями.",
        "properties": [
          "Тонизирующий и моделирующий эффект",
          "Улучшает кровообращение",
          "Поддержка лимфодренажа",
          "Уменьшает проявления целлюлита"
        ]
      }
    }
  },
  "bodyrescue": {
    "image": "/images/product-bodyrescue.jpg",
    "price": "65 €",
    "content": {
      "lv": {
        "name": "Arosha 515 Body Rescue Cellulite",
        "size": "200 ml",
        "sizes": null,
        "description": "Intensīvs krēms pret celulītu ar SLIM COMPLEX, kofeīnu un karnitīnu cīņai pret ādas nepilnībām.",
        "composition": [
          [
            "Rodisterols (2%)",
            "Veicina tauku dedzināšanu, uzlabo ādas stingrumu."
          ],
          [
            "Sculptosan (1%)",
            "Palielina ādas stingrumu un elastību."
          ],
          [
            "Kofeīns (4%)",
            "Veicina dehidratāciju un toksīnu izvadi."
          ],
          [
            "L-karnitīns (0.5%)",
            "Stimulē tauku izmantošanu, limfātisks atbalsts."
          ]
        ],
        "usage": "Uzklāt uz ādas un masēt līdz pilnīgai uzsūkšanai. Tikai ārējai lietošanai.",
        "properties": [
          "Mazina celulīta izpausmes",
          "Uzlabo asinsriti",
          "Nostiprina un izlīdzina ādu"
        ]
      },
      "en": {
        "name": "Arosha 515 Body Rescue Cellulite",
        "size": "200 ml",
        "sizes": null,
        "description": "An intensive anti-cellulite cream with SLIM COMPLEX, caffeine and carnitine to fight skin imperfections.",
        "composition": [
          [
            "Rodisterol (2%)",
            "Promotes fat burning, improves skin firmness."
          ],
          [
            "Sculptosan (1%)",
            "Increases skin firmness and elasticity."
          ],
          [
            "Caffeine (4%)",
            "Supports dehydration and toxin removal."
          ],
          [
            "L-Carnitine (0.5%)",
            "Stimulates fat use, supports the lymphatic system."
          ]
        ],
        "usage": "Apply to the skin and massage until fully absorbed. External use only.",
        "properties": [
          "Reduces the appearance of cellulite",
          "Improves circulation",
          "Firms and smooths the skin"
        ]
      },
      "ru": {
        "name": "Arosha 515 Body Rescue Cellulite",
        "size": "200 мл",
        "sizes": null,
        "description": "Интенсивный крем против целлюлита с SLIM COMPLEX, кофеином и карнитином для борьбы с несовершенствами кожи.",
        "composition": [
          [
            "Родистерол (2%)",
            "Способствует сжиганию жира, улучшает упругость кожи."
          ],
          [
            "Sculptosan (1%)",
            "Повышает упругость и эластичность кожи."
          ],
          [
            "Кофеин (4%)",
            "Способствует выведению жидкости и токсинов."
          ],
          [
            "L-карнитин (0.5%)",
            "Стимулирует использование жира, поддержка лимфосистемы."
          ]
        ],
        "usage": "Нанести на кожу и массировать до полного впитывания. Только для наружного применения.",
        "properties": [
          "Уменьшает проявления целлюлита",
          "Улучшает кровообращение",
          "Укрепляет и разглаживает кожу"
        ]
      }
    }
  }
};
