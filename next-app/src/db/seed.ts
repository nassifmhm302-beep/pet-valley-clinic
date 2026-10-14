import "dotenv/config";
import { db, pool } from "@/db";
import {
  settings,
  branches,
  specialties,
  doctors,
  doctorAvailability,
  serviceCategories,
  services,
  doctorServices,
  productCategories,
  products,
  articles,
  galleryPhotos,
} from "@/db/schema";

const img = (id: string, w = 1200, h = 900) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

async function main() {
  console.log("Seeding Pet Valley database...");

  // ---------- Settings ----------
  await db
    .insert(settings)
    .values([
      {
        key: "topbar",
        value: {
          locationText: "عمّان، الأردن",
          hoursText: "يوميًا 9:00ص - 9:00م",
          promoText: "خصم 15% على أول حجز تطعيم لحيوانك هذا الشهر",
          trackOrderEnabled: true,
          whatsapp: "962790000000",
        },
      },
      {
        key: "contact",
        value: {
          phone: "+962790000000",
          whatsapp: "962790000000",
          email: "info@petvalleyclinic.com",
          address: "شارع المدينة المنورة، عمّان، الأردن",
          city: "عمّان",
          instagram: "https://instagram.com/pet.valley.clinic/",
          facebook: "",
          hoursText: "يوميًا من 9:00 صباحًا حتى 9:00 مساءً",
        },
      },
      {
        key: "hero",
        value: {
          title: "رعاية تحبها… وراحة يشعر بها حيوانك",
          subtitle:
            "رعاية بيطرية متكاملة لحيواناتك الأليفة، من الفحص والتطعيم إلى العناية والإقامة، داخل العيادة أو في منزلك عند توفر الخدمة.",
          ctaPrimary: "احجز موعدًا",
          ctaSecondary: "اكتشف خدماتنا",
          imageUrl: img("7468978", 1400, 1500),
          showHomeVisitCta: true,
        },
      },
      {
        key: "demoMode",
        value: { enabled: true },
      },
      {
        key: "shipping",
        value: { flatRate: 3, freeOverAmount: 40, codEnabled: true },
      },
      {
        key: "offers",
        value: [
          {
            title: "خصم 15% على أول حجز تطعيم",
            description: "عرض خاص للحجوزات الجديدة من قسم التطعيمات هذا الشهر عبر الموقع.",
            badge: "عرض خاص",
            ctaLabel: "احجز العرض",
            ctaHref: "/booking?service=vaccinations",
            imageUrl: img("7469213", 900, 700),
            color: "honey",
          },
          {
            title: "وفّر حتى 20% على منتجات العناية المختارة",
            description: "تسوّق منتجات الشامبو والفرشاة ضمن تشكيلة العناية بخصومات حقيقية مسجّلة في المتجر.",
            badge: "وفر الآن",
            ctaLabel: "تسوق العروض",
            ctaHref: "/shop/category/grooming-hygiene",
            imageUrl: img("19145883", 900, 700),
            color: "teal",
          },
        ],
      },
    ])
    .onConflictDoNothing();

  // ---------- Branches ----------
  const insertedBranches = await db
    .insert(branches)
    .values([
      {
        name: "فرع بيت فالي الرئيسي",
        address: "شارع المدينة المنورة، عمّان، الأردن",
        city: "عمّان",
        phone: "+962790000000",
        whatsapp: "962790000000",
        hours: [
          { day: "السبت - الخميس", open: "09:00", close: "21:00" },
          { day: "الجمعة", open: "14:00", close: "21:00" },
        ],
        mapEmbedUrl: "https://www.google.com/maps?q=Amman%20Jordan&output=embed",
        isActive: true,
        isDraft: false,
        sortOrder: 1,
      },
    ])
    .returning();

  const mainBranch = insertedBranches[0];

  // ---------- Specialties ----------
  const insertedSpecialties = await db
    .insert(specialties)
    .values([
      { slug: "general-medicine", name: "طب بيطري عام" },
      { slug: "surgery", name: "جراحة بيطرية" },
      { slug: "dermatology", name: "أمراض جلدية" },
      { slug: "grooming", name: "عناية وتجميل" },
    ])
    .returning();

  const specGeneral = insertedSpecialties[0];
  const specSurgery = insertedSpecialties[1];
  const specDerma = insertedSpecialties[2];
  const specGrooming = insertedSpecialties[3];

  // ---------- Doctors (demo data clearly marked) ----------
  const insertedDoctors = await db
    .insert(doctors)
    .values([
      {
        slug: "dr-lama-khalil",
        name: "د. لمى خليل",
        title: "طبيبة بيطرية عامة",
        specialtyId: specGeneral.id,
        bio: "تهتم د. لمى بتقديم رعاية شاملة للحيوانات الأليفة من الفحص الدوري إلى متابعة التطعيمات، مع التركيز على راحة الحيوان وطمأنينة صاحبه.",
        qualifications: ["بكالوريوس الطب البيطري", "دبلوم طب الحيوانات الأليفة"],
        photoUrl: img("32788235", 800, 1000),
        branchId: mainBranch.id,
        experienceYears: null,
        isActive: true,
        isDemo: true,
        sortOrder: 1,
      },
      {
        slug: "dr-omar-nasser",
        name: "د. عمر ناصر",
        title: "طبيب بيطري - جراحة",
        specialtyId: specSurgery.id,
        bio: "يتابع د. عمر حالات العمليات الجراحية والتعقيم بحرص كامل على السلامة، ويحرص على شرح كل خطوة لأصحاب الحيوانات قبل أي إجراء.",
        qualifications: ["بكالوريوس الطب البيطري", "تدريب متقدم في الجراحة العامة للحيوانات"],
        photoUrl: img("6235652", 800, 1000),
        branchId: mainBranch.id,
        experienceYears: null,
        isActive: true,
        isDemo: true,
        sortOrder: 2,
      },
      {
        slug: "dr-sara-fayez",
        name: "د. سارة فايز",
        title: "طبيبة بيطرية - أمراض جلدية وتغذية",
        specialtyId: specDerma.id,
        bio: "تساعد د. سارة أصحاب الحيوانات في التعامل مع الحساسية ومشاكل الفراء والجلد، إلى جانب تقديم استشارات غذائية مناسبة لكل حالة.",
        qualifications: ["بكالوريوس الطب البيطري", "دورات متخصصة في أمراض الجلد البيطرية"],
        photoUrl: img("39550296", 800, 1000),
        branchId: mainBranch.id,
        experienceYears: null,
        isActive: true,
        isDemo: true,
        sortOrder: 3,
      },
      {
        slug: "groomer-huda-saleh",
        name: "هدى صالح",
        title: "أخصائية عناية وتجميل الحيوانات",
        specialtyId: specGrooming.id,
        bio: "تقدم هدى خدمات الاستحمام والحلاقة وقص الأظافر بأسلوب هادئ يراعي راحة الحيوان، مع اهتمام خاص بالسلالات ذات الفراء الكثيف.",
        qualifications: ["شهادة متخصصة في تجميل وعناية الحيوانات الأليفة"],
        photoUrl: img("28644631", 800, 1000),
        branchId: mainBranch.id,
        experienceYears: null,
        isActive: true,
        isDemo: true,
        sortOrder: 4,
      },
    ])
    .returning();

  const [drLama, drOmar, drSara, groomerHuda] = insertedDoctors;

  for (const doc of insertedDoctors) {
    await db.insert(doctorAvailability).values(
      [0, 1, 2, 3, 4].map((weekday) => ({
        doctorId: doc.id,
        weekday,
        startTime: "09:00:00",
        endTime: "17:00:00",
        slotMinutes: 30,
        isActive: true,
      }))
    );
  }

  // ---------- Service categories ----------
  const insertedServiceCats = await db
    .insert(serviceCategories)
    .values([
      { slug: "medical-care", name: "الرعاية الطبية", icon: "Stethoscope", sortOrder: 1 },
      { slug: "vaccinations", name: "التطعيمات والوقاية", icon: "Syringe", sortOrder: 2 },
      { slug: "surgery", name: "العمليات والتعقيم", icon: "Scissors", sortOrder: 3 },
      { slug: "grooming", name: "العناية والنظافة", icon: "Sparkles", sortOrder: 4 },
      { slug: "boarding", name: "الإقامة والفندقة", icon: "Hotel", sortOrder: 5 },
      { slug: "remote-care", name: "الزيارات المنزلية والاستشارات عن بعد", icon: "Home", sortOrder: 6 },
    ])
    .returning();

  const [catMedical, catVaccine, catSurgery, catGrooming, catBoarding, catRemote] =
    insertedServiceCats;

  // ---------- Services ----------
  const insertedServices = await db
    .insert(services)
    .values([
      {
        slug: "general-checkup",
        name: "الكشف والمعاينة العامة",
        categoryId: catMedical.id,
        shortDescription: "فحص شامل لحيوانك الأليف لتقييم صحته العامة واكتشاف أي مشكلة مبكرًا.",
        description:
          "يشمل الكشف العام فحصًا دقيقًا لعلامات الحيوان الحيوية، ووزنه، وحالة جلده وفرائه، وأسنانه، مع استشارة الطبيب حول أي ملاحظات لدى صاحب الحيوان. تساعد هذه الزيارة على المتابعة الدورية واكتشاف أي تغيّر في الحالة الصحية قبل تفاقمه.",
        imageUrl: img("7470634"),
        durationMinutes: 30,
        priceFrom: "15",
        priceNote: "يبدأ السعر من، وقد يختلف حسب حالة الحيوان",
        candidateNotes: "مناسب للفحص الدوري، أو عند ملاحظة أي تغيّر في سلوك أو شهية الحيوان.",
        preparationNotes: "يفضل إحضار السجل الطبي السابق للحيوان إن وجد.",
        faqs: [
          { q: "كم تستغرق مدة الكشف؟", a: "عادة ما يستغرق الكشف العام حوالي 30 دقيقة." },
          { q: "هل يحتاج حيواني لصيام قبل الكشف؟", a: "لا يُشترط الصيام للكشف العام ما لم يطلب الطبيب غير ذلك." },
        ],
        allowInClinic: true,
        allowHomeVisit: true,
        allowTelemedicine: false,
        isActive: true,
        sortOrder: 1,
      },
      {
        slug: "vaccinations",
        name: "التطعيمات الوقائية",
        categoryId: catVaccine.id,
        shortDescription: "برنامج تطعيمات متكامل يحمي حيوانك من الأمراض المعدية الشائعة.",
        description:
          "نقدم خطة تطعيمات مصممة حسب عمر ونوع الحيوان، مع متابعة الجرعات التنشيطية في مواعيدها. يقيّم الطبيب الحالة الصحية للحيوان قبل كل جرعة لضمان سلامته.",
        imageUrl: img("7469213"),
        durationMinutes: 20,
        priceFrom: "12",
        priceNote: "السعر يختلف حسب نوع التطعيم",
        candidateNotes: "يُنصح به للجراء والقطط الصغيرة، ومتابعة الجرعات السنوية للحيوانات البالغة.",
        preparationNotes: "يجب أن يكون الحيوان بصحة جيدة وخاليًا من الحمى وقت التطعيم.",
        faqs: [
          { q: "متى تبدأ تطعيمات الجراء؟", a: "عادة تبدأ الجرعات الأولى في عمر 6-8 أسابيع وفق تقييم الطبيب." },
        ],
        allowInClinic: true,
        allowHomeVisit: true,
        allowTelemedicine: false,
        isActive: true,
        sortOrder: 2,
      },
      {
        slug: "surgery-sterilization",
        name: "العمليات الجراحية والتعقيم",
        categoryId: catSurgery.id,
        shortDescription: "عمليات جراحية وتعقيم بإشراف طبي كامل ضمن بيئة معقّمة وآمنة.",
        description:
          "تجرى العمليات الجراحية والتعقيم داخل غرفة عمليات مجهزة، مع متابعة ما بعد العملية وإرشادات واضحة لصاحب الحيوان للعناية بالحيوان خلال فترة التعافي.",
        imageUrl: img("8853183"),
        durationMinutes: 90,
        priceFrom: null,
        priceNote: "يحدَّد السعر بعد تقييم الطبيب لحالة الحيوان",
        candidateNotes: "يراجع الطبيب كل حالة على حدة لتحديد مدى الحاجة للعملية والتوقيت المناسب.",
        preparationNotes: "غالبًا ما يُطلب صيام الحيوان لساعات محددة قبل العملية وفق تعليمات الطبيب.",
        faqs: [{ q: "هل التعقيم آمن؟", a: "يقيّم الطبيب صحة الحيوان قبل العملية لضمان أعلى درجات الأمان." }],
        allowInClinic: true,
        allowHomeVisit: false,
        allowTelemedicine: false,
        isActive: true,
        sortOrder: 3,
      },
      {
        slug: "grooming",
        name: "العناية والنظافة (Grooming)",
        categoryId: catGrooming.id,
        shortDescription: "استحمام وحلاقة وتهذيب فراء وقص أظافر بأسلوب هادئ ومريح للحيوان.",
        description:
          "تشمل جلسة العناية استحمامًا بمنتجات مناسبة لنوع الفراء، وتهذيبًا وحلاقة حسب السلالة، وتنظيف الأذنين والعينين وقص الأظافر، لتخرج بحيوان نظيف ومرتاح.",
        imageUrl: img("19145874"),
        durationMinutes: 60,
        priceFrom: "10",
        priceNote: "يختلف السعر حسب حجم وسلالة الحيوان",
        candidateNotes: "مناسب لجميع السلالات، ويُنصح به بشكل دوري للحيوانات ذات الفراء الكثيف.",
        preparationNotes: "لا حاجة لتحضيرات خاصة، يمكن القدوم مباشرة في الموعد المحدد.",
        faqs: [{ q: "كم مرة يُنصح بالعناية؟", a: "يختلف حسب نوع الفراء، وغالبًا يُنصح بجلسة كل 4-6 أسابيع." }],
        allowInClinic: true,
        allowHomeVisit: false,
        allowTelemedicine: false,
        isActive: true,
        sortOrder: 4,
      },
      {
        slug: "boarding",
        name: "الإقامة والفندقة",
        categoryId: catBoarding.id,
        shortDescription: "إقامة آمنة ومريحة لحيوانك خلال سفرك مع متابعة يومية من الفريق.",
        description:
          "توفر العيادة أماكن إقامة نظيفة ومهوّاة لحيوانك الأليف، مع وجبات غذائية منتظمة ووقت للعب والحركة، ومتابعة صحية يومية طوال مدة الإقامة.",
        imageUrl: img("16465615"),
        durationMinutes: 1440,
        priceFrom: "8",
        priceNote: "السعر لليوم الواحد، ويختلف حسب حجم الحيوان",
        candidateNotes: "مناسبة لفترات السفر أو عند الحاجة لمكان آمن لحيوانك لبضعة أيام.",
        preparationNotes: "يُفضل إحضار طعام الحيوان المعتاد وأي أدوية يحتاجها خلال الإقامة.",
        faqs: [{ q: "هل يمكن زيارة الحيوان أثناء إقامته؟", a: "نعم، يمكن الاستفسار عن مواعيد الزيارة عبر التواصل مع العيادة." }],
        allowInClinic: true,
        allowHomeVisit: false,
        allowTelemedicine: false,
        isActive: true,
        sortOrder: 5,
      },
      {
        slug: "home-visits",
        name: "الزيارات المنزلية",
        categoryId: catRemote.id,
        shortDescription: "فحص أو متابعة لحيوانك الأليف داخل منزلك عند توفر الخدمة في منطقتك.",
        description:
          "تتيح الزيارة المنزلية فحصًا أو متابعة أساسية لحيوانك في بيئته المعتادة، وهي خيار مناسب للحيوانات التي تتوتر من أجواء العيادة أو عند صعوبة التنقل.",
        imageUrl: img("22504402"),
        durationMinutes: 45,
        priceFrom: "20",
        priceNote: "يضاف رسم تنقل حسب المنطقة",
        candidateNotes: "مناسبة للفحص البسيط والمتابعة، وتُستثنى منها الحالات التي تتطلب تجهيزات العيادة.",
        preparationNotes: "يرجى تجهيز مكان هادئ ومضاء لإجراء الفحص عند وصول الطبيب.",
        faqs: [{ q: "هل تتوفر الزيارة المنزلية في كل المناطق؟", a: "تتوفر الخدمة ضمن نطاق محدد يتم تأكيده عند الحجز." }],
        allowInClinic: false,
        allowHomeVisit: true,
        allowTelemedicine: false,
        isActive: true,
        sortOrder: 6,
      },
      {
        slug: "teleconsultation",
        name: "استشارة عن بعد",
        categoryId: catRemote.id,
        shortDescription: "استشارة سريعة مع الطبيب عبر مكالمة لمناقشة حالة حيوانك قبل تحديد موعد زيارة.",
        description:
          "تساعد الاستشارة عن بعد في تقييم أولي لحالة الحيوان وتقديم التوجيه المناسب، مع إمكانية تحويلها إلى حجز زيارة فعلية عند الحاجة لفحص مباشر.",
        imageUrl: img("6235116"),
        durationMinutes: 15,
        priceFrom: "5",
        priceNote: null,
        candidateNotes: "مناسبة للاستفسارات العامة وتقييم مدى الحاجة لزيارة العيادة.",
        preparationNotes: "يُفضل تجهيز صور أو فيديو قصير يوضح الحالة إن أمكن.",
        faqs: [],
        allowInClinic: false,
        allowHomeVisit: false,
        allowTelemedicine: true,
        isActive: true,
        sortOrder: 7,
      },
    ])
    .returning();

  const [svcCheckup, svcVaccine, svcSurgery, svcGrooming, svcBoarding, svcHomeVisit, svcTele] =
    insertedServices;

  await db.insert(doctorServices).values([
    { doctorId: drLama.id, serviceId: svcCheckup.id },
    { doctorId: drLama.id, serviceId: svcVaccine.id },
    { doctorId: drLama.id, serviceId: svcHomeVisit.id },
    { doctorId: drLama.id, serviceId: svcTele.id },
    { doctorId: drOmar.id, serviceId: svcSurgery.id },
    { doctorId: drOmar.id, serviceId: svcCheckup.id },
    { doctorId: drSara.id, serviceId: svcCheckup.id },
    { doctorId: drSara.id, serviceId: svcVaccine.id },
    { doctorId: drSara.id, serviceId: svcTele.id },
    { doctorId: groomerHuda.id, serviceId: svcGrooming.id },
    { doctorId: groomerHuda.id, serviceId: svcBoarding.id },
  ]);

  // ---------- Product categories ----------
  const insertedProductCats = await db
    .insert(productCategories)
    .values([
      { slug: "dog-food", name: "طعام الكلاب", imageUrl: img("13581209"), sortOrder: 1 },
      { slug: "cat-food", name: "طعام القطط", imageUrl: img("2361952"), sortOrder: 2 },
      { slug: "grooming-hygiene", name: "العناية والنظافة", imageUrl: img("19145883"), sortOrder: 3 },
      { slug: "accessories", name: "الإكسسوارات", imageUrl: img("38398910"), sortOrder: 4 },
      { slug: "toys", name: "ألعاب الحيوانات", imageUrl: img("27680249"), sortOrder: 5 },
    ])
    .returning();

  const [catDogFood, catCatFood, catGroomingShop, catAccessories, catToys] = insertedProductCats;

  await db.insert(products).values([
    {
      slug: "dry-dog-food-chicken-3kg",
      name: "غذاء جاف للكلاب بالدجاج والأرز 3 كغ",
      categoryId: catDogFood.id,
      brand: "عينة تجريبية",
      sku: "DEMO-DF-001",
      description:
        "وجبة متكاملة للكلاب البالغة تجمع بين الدجاج والأرز، مصممة لدعم الطاقة اليومية وصحة الفراء. هذا المنتج نموذج تجريبي بانتظار اعتماد الكتالوج الرسمي للعيادة.",
      specs: [
        { label: "الوزن", value: "3 كغ" },
        { label: "الفئة", value: "كلاب بالغة" },
      ],
      usageInstructions: "يحدَّد مقدار الوجبة اليومية حسب وزن الكلب، وفق الإرشادات المعتمدة من الشركة المصنعة.",
      weight: "3 كغ",
      price: "18.50",
      compareAtPrice: "22.00",
      images: [img("13581209", 900, 900)],
      stock: 24,
      rating: null,
      ratingCount: 0,
      isActive: true,
      isFeatured: true,
      isBestSeller: true,
      isDemo: true,
      relatedServiceIds: [svcCheckup.id],
      sortOrder: 1,
    },
    {
      slug: "dry-cat-food-tuna-2kg",
      name: "غذاء جاف للقطط بنكهة التونة 2 كغ",
      categoryId: catCatFood.id,
      brand: "عينة تجريبية",
      sku: "DEMO-CF-001",
      description:
        "تركيبة غنية بالبروتين لدعم صحة القطط البالغة، بنكهة التونة المحببة للقطط. منتج نموذجي أثناء مرحلة التصميم.",
      specs: [{ label: "الوزن", value: "2 كغ" }],
      usageInstructions: "يقدَّم حسب عمر ووزن القطة، مع توفير ماء عذب دائمًا.",
      weight: "2 كغ",
      price: "14.00",
      compareAtPrice: null,
      images: [img("2361952", 900, 900)],
      stock: 30,
      rating: null,
      ratingCount: 0,
      isActive: true,
      isFeatured: true,
      isBestSeller: false,
      isDemo: true,
      relatedServiceIds: [],
      sortOrder: 2,
    },
    {
      slug: "wet-cat-food-can",
      name: "غذاء رطب معلّب للقطط",
      categoryId: catCatFood.id,
      brand: "عينة تجريبية",
      sku: "DEMO-CF-002",
      description: "علبة غذاء رطب كوجبة مكمّلة للقطط من جميع الأعمار، منتج نموذجي بانتظار الاعتماد الرسمي.",
      specs: [{ label: "الوزن", value: "400 غم" }],
      usageInstructions: "تُقدَّم كوجبة يومية مكمّلة إلى جانب الغذاء الجاف.",
      weight: "400 غم",
      price: "3.25",
      compareAtPrice: "4.00",
      images: [img("38313609", 900, 900)],
      stock: 50,
      rating: null,
      ratingCount: 0,
      isActive: true,
      isFeatured: false,
      isBestSeller: true,
      isDemo: true,
      relatedServiceIds: [],
      sortOrder: 3,
    },
    {
      slug: "pet-shampoo-sensitive-skin",
      name: "شامبو لطيف للبشرة الحساسة",
      categoryId: catGroomingShop.id,
      brand: "عينة تجريبية",
      sku: "DEMO-GR-001",
      description: "شامبو مخصص للحيوانات ذات البشرة الحساسة، يساعد في تنظيف الفراء برفق دون تهييج الجلد.",
      specs: [{ label: "الحجم", value: "250 مل" }],
      usageInstructions: "يُخفَّف بالماء ويُدلَّك برفق على الفراء ثم يُشطف جيدًا.",
      weight: "250 مل",
      price: "9.00",
      compareAtPrice: null,
      images: [img("19145883", 900, 900)],
      stock: 18,
      rating: null,
      ratingCount: 0,
      isActive: true,
      isFeatured: true,
      isBestSeller: false,
      isDemo: true,
      relatedServiceIds: [svcGrooming.id],
      sortOrder: 4,
    },
    {
      slug: "grooming-brush",
      name: "فرشاة تنظيف وتهذيب الفراء",
      categoryId: catGroomingShop.id,
      brand: "عينة تجريبية",
      sku: "DEMO-GR-002",
      description: "فرشاة مريحة تساعد في إزالة الفراء المتساقط وتهذيب شكل الفراء بانتظام بين جلسات العناية.",
      specs: [{ label: "النوع", value: "فرشاة سلك ناعم" }],
      usageInstructions: "تُستخدم بحركات هادئة باتجاه نمو الفراء.",
      weight: null,
      price: "6.50",
      compareAtPrice: "8.00",
      images: [img("19145874", 900, 900)],
      stock: 22,
      rating: null,
      ratingCount: 0,
      isActive: true,
      isFeatured: false,
      isBestSeller: false,
      isDemo: true,
      relatedServiceIds: [svcGrooming.id],
      sortOrder: 5,
    },
    {
      slug: "interactive-rubber-ball",
      name: "كرة مطاطية تفاعلية للكلاب",
      categoryId: catToys.id,
      brand: "عينة تجريبية",
      sku: "DEMO-TY-001",
      description: "كرة متينة مناسبة للعب والمضغ، تساعد على تحفيز نشاط الكلب وتسليته.",
      specs: [{ label: "المادة", value: "مطاط آمن" }],
      usageInstructions: "يُفضَّل الإشراف أثناء اللعب للكلاب كثيرة المضغ.",
      weight: null,
      price: "5.00",
      compareAtPrice: null,
      images: [img("27680249", 900, 900)],
      stock: 40,
      rating: null,
      ratingCount: 0,
      isActive: true,
      isFeatured: true,
      isBestSeller: false,
      isDemo: true,
      relatedServiceIds: [],
      sortOrder: 6,
    },
    {
      slug: "cozy-pet-bed",
      name: "سرير مريح وناعم للحيوانات الأليفة",
      categoryId: catAccessories.id,
      brand: "عينة تجريبية",
      sku: "DEMO-AC-001",
      description: "سرير دافئ بحشوة ناعمة يمنح حيوانك مكانًا مريحًا للنوم والاسترخاء.",
      specs: [{ label: "المقاس", value: "متوسط" }],
      usageInstructions: "يُنظَّف غطاؤه القابل للإزالة بالغسل العادي.",
      weight: null,
      price: "16.00",
      compareAtPrice: "20.00",
      images: [img("103651", 900, 900)],
      stock: 15,
      rating: null,
      ratingCount: 0,
      isActive: true,
      isFeatured: false,
      isBestSeller: true,
      isDemo: true,
      relatedServiceIds: [],
      sortOrder: 7,
    },
    {
      slug: "leather-collar-leash-set",
      name: "طوق ورباط نزهة جلدي",
      categoryId: catAccessories.id,
      brand: "عينة تجريبية",
      sku: "DEMO-AC-002",
      description: "طقم طوق ورباط جلدي متين ومريح لنزهات يومية آمنة مع كلبك.",
      specs: [{ label: "المقاس", value: "قابل للتعديل" }],
      usageInstructions: "يُضبط الطوق بما يسمح بإدخال إصبعين بين الطوق ورقبة الحيوان.",
      weight: null,
      price: "11.50",
      compareAtPrice: null,
      images: [img("38398910", 900, 900)],
      stock: 20,
      rating: null,
      ratingCount: 0,
      isActive: true,
      isFeatured: false,
      isBestSeller: false,
      isDemo: true,
      relatedServiceIds: [],
      sortOrder: 8,
    },
  ]);

  // ---------- Articles ----------
  await db.insert(articles).values([
    {
      slug: "puppy-vaccination-schedule",
      title: "جدول تطعيمات الجراء والقطط الصغيرة: ما الذي يجب معرفته؟",
      excerpt: "دليل مبسط حول مواعيد التطعيمات الأساسية للجراء والقطط الصغيرة وأهمية الالتزام بها.",
      content:
        "<p>تُعد التطعيمات من أهم خطوات الوقاية الصحية للحيوانات الأليفة في بداية حياتها. تبدأ الجرعات الأولى عادة بعد الفطام، ويحدد الطبيب البيطري الجدول المناسب حسب نوع الحيوان وحالته الصحية.</p><h2>لماذا تعتبر التطعيمات مهمة؟</h2><p>تساعد التطعيمات على حماية الجراء والقطط الصغيرة من أمراض معدية قد تكون خطيرة في هذه المرحلة العمرية الحساسة.</p><h2>متابعة الجرعات التنشيطية</h2><p>يحتاج معظم البرامج التطعيمية إلى جرعات تنشيطية على فترات محددة يحددها الطبيب المختص بعد تقييم حالة الحيوان.</p>",
      coverImageUrl: img("7469213"),
      category: "التطعيمات",
      author: "فريق بيت فالي الطبي",
      tags: ["تطعيمات", "جراء", "قطط"],
      isPublished: true,
    },
    {
      slug: "home-grooming-tips",
      title: "نصائح للعناية بفراء حيوانك الأليف بين جلسات الصالون",
      excerpt: "خطوات بسيطة تساعدك في الحفاظ على نظافة فراء حيوانك في المنزل بين زيارات العناية.",
      content:
        "<p>لا تقتصر العناية بفراء الحيوان على زيارات صالون التجميل فقط، بل يمكن لصاحب الحيوان المساهمة في الحفاظ على نظافته وصحته بين الجلسات.</p><h2>التمشيط المنتظم</h2><p>يساعد التمشيط بانتظام على تقليل تساقط الفراء ومنع تشابكه، خصوصًا للسلالات ذات الفراء الطويل.</p><h2>اختيار المنتجات المناسبة</h2><p>يُنصح باستخدام منتجات عناية مخصصة للحيوانات الأليفة تحت إشراف الطبيب أو المختص.</p>",
      coverImageUrl: img("19145874"),
      category: "العناية والنظافة",
      author: "فريق بيت فالي الطبي",
      tags: ["عناية", "فراء", "تجميل"],
      isPublished: true,
    },
    {
      slug: "signs-to-watch-in-pet-health",
      title: "علامات لا يجب تجاهلها في صحة حيوانك الأليف",
      excerpt: "تعرف على أبرز العلامات التي تستدعي زيارة الطبيب البيطري في أقرب وقت ممكن.",
      content:
        "<p>قد تظهر على الحيوانات الأليفة علامات بسيطة تشير إلى وجود مشكلة صحية تستحق المتابعة الطبية.</p><h2>تغيّر الشهية أو النشاط</h2><p>يُعد الانخفاض المفاجئ في الشهية أو النشاط من المؤشرات التي تستدعي استشارة الطبيب.</p><h2>تغيّرات الجلد والفراء</h2><p>احمرار الجلد أو تساقط الفراء بشكل غير معتاد قد يشير إلى حساسية أو مشكلة جلدية تحتاج تقييمًا من مختص.</p><p>في جميع الأحوال، يُنصح دائمًا بمراجعة الطبيب البيطري لتقييم الحالة بدقة بدلًا من الاعتماد على التقدير الذاتي.</p>",
      coverImageUrl: img("6235648"),
      category: "صحة عامة",
      author: "فريق بيت فالي الطبي",
      tags: ["صحة", "وقاية"],
      isPublished: true,
    },
  ]);

  // ---------- Gallery ----------
  await db.insert(galleryPhotos).values(
    ["10096129", "9248865", "38398913", "11079312", "31831037", "38747749", "5748854"].map(
      (id, idx) => ({
        imageUrl: img(id, 700, 700),
        caption: "أحد أصدقاء بيت فالي",
        petName: null,
        sortOrder: idx,
        isActive: true,
      })
    )
  );

  console.log("Seed completed successfully.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
