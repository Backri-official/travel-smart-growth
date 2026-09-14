export type PostSection = { heading: string; body: string[] };

export type Post = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  date: string;
  readMinutes: number;
  excerpt: string;
  sections: PostSection[];
};

export const enPosts: Post[] = [
  {
    slug: "cabin-baggage-tips-gulf-airlines",
    title: "Cabin baggage from DXB and AUH: how to pack so you never get stopped",
    metaTitle: "Cabin Baggage Tips for Dubai & Abu Dhabi Flights | Backri",
    description:
      "Practical cabin baggage tips for travellers flying out of Dubai, Abu Dhabi and Sharjah — sizing, weight, liquids and what to keep within reach.",
    date: "2026-08-12",
    readMinutes: 5,
    excerpt:
      "Sizing, weight, liquids and the small habits that keep you moving through the gate at Dubai and Abu Dhabi.",
    sections: [
      {
        heading: "Check your own allowance before you pack",
        body: [
          "Cabin allowances differ by airline, fare type and route, and Gulf carriers do weigh hand luggage at the gate on busy departures. Open your booking confirmation and read the exact size and weight printed on it rather than trusting what worked last time.",
          "If you are flying with two airlines on one ticket, plan for the stricter of the two allowances. Low-cost carriers in the region are usually the tightest.",
        ],
      },
      {
        heading: "Pack by category, not by pile",
        body: [
          "Group clothing into categories — tops, layers, underwear, laundry — and keep each one in its own packing cube. You compress the same clothes into less space, and at the other end you unpack in seconds instead of turning the bag over.",
          "Keep one cube half empty on the way out. It becomes your laundry bag, and it leaves room for anything you buy.",
        ],
      },
      {
        heading: "Keep documents in one place you can reach standing up",
        body: [
          "Between check-in, immigration and boarding you will show your passport three or four times. A passport wallet that holds passport, boarding pass and one card means you never dig through a bag while a queue builds behind you.",
          "Photograph your passport, visa page and travel insurance and save them offline on your phone as well.",
        ],
      },
      {
        heading: "Liquids and electronics near the top",
        body: [
          "Airport security in the UAE asks for liquids and larger electronics separately. Put your liquids pouch and laptop in the outer compartment so you can lift them out without unpacking on the belt.",
          "Cables, chargers, adaptors and a power bank belong in one tech pouch — loose cables are the single most common reason bags get re-screened.",
        ],
      },
    ],
  },
  {
    slug: "travel-documents-organised-uae",
    title: "The UAE traveller's document checklist",
    metaTitle: "Travel Document Checklist for UAE Residents | Backri",
    description:
      "What UAE residents should carry and organise before flying: passport validity, residence visa, Emirates ID, and how to keep it all in one wallet.",
    date: "2026-08-26",
    readMinutes: 4,
    excerpt:
      "Passport validity, residence visa, Emirates ID and copies — organised once, so departure day is boring.",
    sections: [
      {
        heading: "Start with passport validity",
        body: [
          "Many destinations expect six months of validity beyond your travel dates, and some also require blank pages for stamps or visas. Check both today, not the week before you fly — renewals and appointments take time in peak season.",
        ],
      },
      {
        heading: "Residency and re-entry",
        body: [
          "If you live in the UAE, your residence visa and Emirates ID matter as much as your passport. Confirm your visa is valid for the whole trip and that you will not exceed the time allowed outside the country before your residency is affected.",
        ],
      },
      {
        heading: "One wallet, one routine",
        body: [
          "Give every document a fixed slot: passport in the centre, boarding pass behind it, one payment card and your ID in the side pockets. When the slot is always the same, you stop patting your pockets at the gate.",
          "Travelling as a family? A single organiser that holds several passports keeps everyone's documents with the person who handles the paperwork.",
        ],
      },
      {
        heading: "Back everything up",
        body: [
          "Keep offline copies of passports, visas, tickets, hotel bookings and insurance on your phone, and one printed copy in your suitcase. If a bag or a phone disappears, this is what makes the next two hours manageable.",
        ],
      },
    ],
  },
  {
    slug: "summer-escape-packing-list-gcc",
    title: "Escaping the Gulf summer: a packing list that actually works",
    metaTitle: "Summer Travel Packing List for GCC Travellers | Backri",
    description:
      "A packing approach for GCC travellers leaving 45°C heat for cooler destinations — layers, laundry, and keeping a carry-on light.",
    date: "2026-09-02",
    readMinutes: 5,
    excerpt:
      "Leaving 45°C for somewhere cool means packing two climates at once. Here is how to do it in one bag.",
    sections: [
      {
        heading: "You are packing for two climates",
        body: [
          "You leave the Gulf in the heat and arrive somewhere that needs a jacket. Wear the heaviest layer on the plane and keep the rest thin and stackable — three light layers beat one bulky coat and take a third of the space.",
        ],
      },
      {
        heading: "Choose a colour family",
        body: [
          "Pick two neutrals and one accent. Everything matches everything, you carry fewer shoes, and the outfit count goes up while the bag gets smaller.",
        ],
      },
      {
        heading: "Plan to wash, not to carry",
        body: [
          "For trips under two weeks, pack a week of clothes and plan one laundry stop. It is the single biggest weight saving available to you.",
        ],
      },
      {
        heading: "Protect what leaks and what creases",
        body: [
          "Sunscreen and toiletries go in a sealed pouch, never loose against clothes. Roll casual clothes, fold anything structured, and put shoes in a bag at the base of the case.",
        ],
      },
    ],
  },
  {
    slug: "carry-on-only-short-trips",
    title: "Carry-on only: the four-day Gulf weekend",
    metaTitle: "Carry-On Only Packing for Short Gulf Trips | Backri",
    description:
      "How to do a four-day trip from the UAE with cabin baggage only — a simple capsule, one tech pouch and no check-in queue.",
    date: "2026-09-09",
    readMinutes: 4,
    excerpt:
      "Short trips from the UAE rarely need a checked bag. Skip the belt and walk straight out.",
    sections: [
      {
        heading: "Why cabin-only wins for short trips",
        body: [
          "On a two to four day trip, checking a bag can add close to an hour at each end and puts your belongings out of your hands. Weekend flights across the Gulf are short enough that everything you need fits above your seat.",
        ],
      },
      {
        heading: "The four-day capsule",
        body: [
          "Three tops, one pair of trousers plus the pair you wear, one layer, underwear and socks per day, one pair of shoes plus the pair on your feet. Add anything the trip specifically demands — gym kit, a suit, modest wear for a mosque visit — and nothing else.",
        ],
      },
      {
        heading: "Two pouches keep it civilised",
        body: [
          "One pouch for tech — cables, charger, adaptor, power bank, headphones. One for toiletries, within your airline's liquid limits. Everything else goes in cubes so the bag stays flat and easy to lift into the locker.",
        ],
      },
      {
        heading: "Keep the essentials on your body",
        body: [
          "Passport, one card, phone and keys stay in a passport wallet you keep with you even if the cabin bag has to be gate-checked on a full flight.",
        ],
      },
    ],
  },
];

export const arPosts: Post[] = [
  {
    slug: "cabin-baggage-tips-gulf-airlines",
    title: "حقيبة المقصورة من مطارات دبي وأبوظبي: كيف تحزم دون توقيف على البوابة",
    metaTitle: "نصائح حقيبة اليد لرحلات دبي وأبوظبي | باكري",
    description:
      "نصائح عملية لحقيبة المقصورة للمسافرين من دبي وأبوظبي والشارقة: المقاس والوزن والسوائل وما يجب أن يبقى في متناول يدك.",
    date: "2026-08-12",
    readMinutes: 5,
    excerpt: "المقاس والوزن والسوائل والعادات الصغيرة التي تُبقيك متحركاً نحو البوابة.",
    sections: [
      {
        heading: "تحقق من مسموحك أنت قبل الحزم",
        body: [
          "يختلف مسموح حقيبة المقصورة بحسب الشركة ونوع التذكرة والمسار، وشركات الخليج تزن حقائب اليد فعلاً على البوابة في أوقات الذروة. افتح تأكيد الحجز واقرأ المقاس والوزن المكتوبين فيه بدلاً من الاعتماد على رحلتك السابقة.",
          "إذا كانت رحلتك على شركتين في تذكرة واحدة، اعتمد المسموح الأقل بينهما. شركات الطيران الاقتصادية في المنطقة هي الأكثر تشدداً عادةً.",
        ],
      },
      {
        heading: "احزم بالتصنيف لا بالتكديس",
        body: [
          "اجمع الملابس في فئات — قمصان، طبقات، ملابس داخلية، ملابس للغسيل — وضع كل فئة في مكعب تنظيم خاص. تضغط الملابس نفسها في مساحة أقل، وعند الوصول تفرّغ الحقيبة في ثوانٍ.",
          "اترك مكعباً نصف فارغ في الذهاب؛ سيصبح كيس الغسيل ويترك مساحة لأي مشتريات.",
        ],
      },
      {
        heading: "أوراقك في مكان واحد تصل إليه واقفاً",
        body: [
          "بين تسجيل الوصول والجوازات والصعود ستُخرج جواز سفرك ثلاث أو أربع مرات. محفظة جواز تحمل الجواز وبطاقة الصعود وبطاقة واحدة تعني ألا تبحث داخل حقيبتك والصف يطول خلفك.",
          "صوّر جواز السفر وصفحة التأشيرة والتأمين واحفظها على هاتفك دون إنترنت.",
        ],
      },
      {
        heading: "السوائل والأجهزة في الأعلى",
        body: [
          "يطلب أمن المطارات في الإمارات السوائل والأجهزة الكبيرة بشكل منفصل. ضع كيس السوائل والحاسوب في الجيب الخارجي لترفعهما دون تفريغ الحقيبة.",
          "الأسلاك والشواحن والمحوّل والبطارية المتنقلة في حافظة إلكترونيات واحدة؛ الأسلاك المتفرقة هي السبب الأكثر شيوعاً لإعادة تفتيش الحقائب.",
        ],
      },
    ],
  },
  {
    slug: "travel-documents-organised-uae",
    title: "قائمة أوراق السفر للمقيم في الإمارات",
    metaTitle: "قائمة أوراق السفر لمقيمي الإمارات | باكري",
    description:
      "ما يجب على المقيم في الإمارات تجهيزه قبل السفر: صلاحية الجواز، الإقامة، الهوية الإماراتية، وكيف تحفظها في محفظة واحدة.",
    date: "2026-08-26",
    readMinutes: 4,
    excerpt: "صلاحية الجواز والإقامة والهوية والنسخ — تُنظَّم مرة واحدة ليصبح يوم السفر هادئاً.",
    sections: [
      {
        heading: "ابدأ بصلاحية جواز السفر",
        body: [
          "كثير من الدول تطلب صلاحية ستة أشهر بعد تاريخ سفرك، وبعضها يطلب صفحات فارغة للأختام أو التأشيرات. تحقق من الأمرين اليوم لا في الأسبوع الأخير؛ فالتجديد والمواعيد تأخذ وقتاً في موسم الذروة.",
        ],
      },
      {
        heading: "الإقامة والعودة",
        body: [
          "إن كنت تقيم في الإمارات فإن الإقامة والهوية الإماراتية بأهمية جواز السفر. تأكد أن إقامتك سارية طوال الرحلة وأنك لن تتجاوز المدة المسموحة خارج الدولة.",
        ],
      },
      {
        heading: "محفظة واحدة وروتين واحد",
        body: [
          "خصّص لكل ورقة مكاناً ثابتاً: الجواز في الوسط، بطاقة الصعود خلفه، بطاقة دفع واحدة والهوية في الجيوب الجانبية. عندما يثبت المكان تتوقف عن تفقّد جيوبك على البوابة.",
          "تسافر مع العائلة؟ منظّم واحد يحمل عدة جوازات يُبقي أوراق الجميع مع من يتولى الإجراءات.",
        ],
      },
      {
        heading: "احفظ نسخاً احتياطية",
        body: [
          "اجعل نسخاً غير متصلة بالإنترنت من الجوازات والتأشيرات والتذاكر وحجوزات الفندق والتأمين على هاتفك، ونسخة مطبوعة داخل الحقيبة. إن فُقد هاتف أو حقيبة فهذا ما يجعل الساعتين التاليتين محتملتين.",
        ],
      },
    ],
  },
  {
    slug: "summer-escape-packing-list-gcc",
    title: "الهروب من صيف الخليج: قائمة حزم عملية",
    metaTitle: "قائمة حزم لسفر الصيف من دول الخليج | باكري",
    description:
      "طريقة حزم للمسافر الخليجي الذي يترك حرارة 45 درجة إلى وجهة باردة: الطبقات والغسيل وحقيبة يد خفيفة.",
    date: "2026-09-02",
    readMinutes: 5,
    excerpt: "مغادرة 45 درجة إلى مكان بارد تعني حزم مناخين في حقيبة واحدة. هكذا تفعلها.",
    sections: [
      {
        heading: "أنت تحزم لمناخين",
        body: [
          "تغادر الخليج في الحرارة وتصل إلى مكان يحتاج معطفاً. ارتدِ أثقل طبقة في الطائرة واجعل الباقي رقيقاً قابلاً للتراكب — ثلاث طبقات خفيفة أفضل من معطف ضخم وتأخذ ثلث المساحة.",
        ],
      },
      {
        heading: "اختر عائلة ألوان واحدة",
        body: [
          "لونان محايدان ولون واحد مميز. كل قطعة تناسب الأخرى، تحمل أحذية أقل، وتزيد التنسيقات وتصغر الحقيبة.",
        ],
      },
      {
        heading: "خطّط للغسيل لا للحمل",
        body: [
          "للرحلات الأقل من أسبوعين، احزم ملابس أسبوع وخطّط لغسلة واحدة. هذا أكبر توفير للوزن يمكنك تحقيقه.",
        ],
      },
      {
        heading: "احمِ ما يسيل وما يتجعّد",
        body: [
          "واقي الشمس والمستحضرات في حافظة مغلقة لا سائبة بين الملابس. لُف الملابس العادية واطوِ المنسّقة، وضع الأحذية في كيس في قاع الحقيبة.",
        ],
      },
    ],
  },
  {
    slug: "carry-on-only-short-trips",
    title: "بحقيبة يد فقط: عطلة أربعة أيام من الخليج",
    metaTitle: "الحزم بحقيبة يد فقط للرحلات القصيرة | باكري",
    description:
      "كيف تسافر أربعة أيام من الإمارات بحقيبة مقصورة فقط: خزانة مصغّرة وحافظة إلكترونيات وبلا انتظار للحقائب.",
    date: "2026-09-09",
    readMinutes: 4,
    excerpt: "الرحلات القصيرة من الإمارات لا تحتاج حقيبة مسجّلة. تجاوز حزام الحقائب واخرج مباشرة.",
    sections: [
      {
        heading: "لماذا حقيبة المقصورة تكفي",
        body: [
          "في رحلة من يومين إلى أربعة، تسجيل الحقيبة قد يضيف قرابة ساعة في كل طرف ويُخرج أمتعتك من يدك. رحلات نهاية الأسبوع في الخليج قصيرة بما يكفي ليُوضع كل ما تحتاجه فوق مقعدك.",
        ],
      },
      {
        heading: "خزانة الأربعة أيام",
        body: [
          "ثلاثة قمصان، بنطال إضافي إلى جانب الذي ترتديه، طبقة واحدة، ملابس داخلية وجوارب لكل يوم، وحذاء إضافي واحد. أضف ما تطلبه الرحلة تحديداً — ملابس رياضة أو بدلة أو ملابس محتشمة لزيارة مسجد — ولا شيء غير ذلك.",
        ],
      },
      {
        heading: "حافظتان تكفيان لترتيب كل شيء",
        body: [
          "حافظة للإلكترونيات: أسلاك، شاحن، محوّل، بطارية، سماعات. وحافظة للمستحضرات بحدود السوائل المسموحة. والبقية في مكعبات تنظيم لتبقى الحقيبة مسطحة وسهلة الرفع.",
        ],
      },
      {
        heading: "الأساسيات معك دائماً",
        body: [
          "الجواز وبطاقة واحدة والهاتف والمفاتيح في محفظة جواز تبقى معك حتى لو طُلب تسجيل حقيبة المقصورة على البوابة في رحلة ممتلئة.",
        ],
      },
    ],
  },
];

export function getPost(posts: Post[], slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
