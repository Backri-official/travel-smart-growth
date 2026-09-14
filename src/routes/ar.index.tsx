import { createFileRoute, Link } from "@tanstack/react-router";
import { arPosts } from "@/content/posts";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Plane, ShieldCheck, Truck, Gift } from "lucide-react";
import heroImage from "@/assets/hero.jpg";
import { storefrontApiRequest, STOREFRONT_QUERY_AR, type ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";

const productsQueryOptions = queryOptions({
  queryKey: ["shopify-products", "ar"],
  queryFn: async () => {
    const data = await storefrontApiRequest(STOREFRONT_QUERY_AR, { first: 20 });
    return (data?.data?.products?.edges || []) as ShopifyProduct[];
  },
});

export const Route = createFileRoute("/ar/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions),
  component: IndexAr,
  head: () => ({
    meta: [
      { title: "محفظة جواز سفر وحقائب سفر فاخرة في دبي والإمارات | باكري" },
      {
        name: "description",
        content:
          "تسوّق محافظ وأغطية جوازات جلدية، حقائب صعود للطائرة، شنط سفر ومنظمات ترتيب في دبي. توصيل مجاني داخل الإمارات فوق 500 درهم وشحن إلى دول الخليج.",
      },
      {
        name: "keywords",
        content:
          "محفظة جواز سفر, غطاء جواز سفر, حقائب سفر دبي, شنط سفر الإمارات, حقيبة صعود للطائرة, منظم حقائب, إكسسوارات سفر الخليج",
      },
      { property: "og:title", content: "محفظة جواز سفر وحقائب سفر فاخرة في دبي والإمارات | باكري" },
      {
        property: "og:description",
        content:
          "محافظ جوازات جلدية فاخرة، حقائب صعود، شنط سفر ومنظمات ترتيب. توصيل مجاني داخل الإمارات فوق 500 درهم وشحن إلى دول الخليج.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/ar" },
      { property: "og:locale", content: "ar_AE" },
      { property: "og:locale:alternate", content: "en_AE" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "/ar" },
      { rel: "alternate", hrefLang: "ar-AE", href: "/ar" },
      { rel: "alternate", hrefLang: "en-AE", href: "/" },
      { rel: "alternate", hrefLang: "x-default", href: "/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "OnlineStore",
          name: "باكري",
          alternateName: "Backri",
          inLanguage: "ar-AE",
          description:
            "محافظ جوازات جلدية فاخرة وحقائب سفر ومنظمات ترتيب للمسافرين في الإمارات ودول الخليج.",
          url: "/ar",
          currenciesAccepted: "AED",
          areaServed: [
            { "@type": "Country", name: "الإمارات العربية المتحدة" },
            { "@type": "Country", name: "السعودية" },
            { "@type": "Country", name: "قطر" },
            { "@type": "Country", name: "الكويت" },
            { "@type": "Country", name: "البحرين" },
            { "@type": "Country", name: "عمان" },
          ],
        }),
      },
    ],
  }),
});


function IndexAr() {
  const { data: products } = useSuspenseQuery(productsQueryOptions);

  return (
    <main dir="rtl" lang="ar" className="font-arabic">
      {/* البانر الرئيسي */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="حقيبة سفر جلدية فاخرة من باكري وحقيبة صعود إلى الطائرة في ضوء الصحراء الدافئ"
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-background/95 via-background/60 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-28 sm:py-40">
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent-foreground">
              تصميم في الإمارات — توصيل إلى دول الخليج
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mt-4">
              محافظ جوازات وحقائب سفر فاخرة للمسافر الخليجي
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              محافظ وأغطية جوازات جلدية، حقائب صعود للطائرة، شنط سفر ومنظمات ترتيب
              للمسافرين في دبي وأبوظبي وجميع دول الخليج. مصنوعة لترافقك لسنوات طويلة.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#collection-ar"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                تسوّق المجموعة
              </a>
              <p className="text-sm text-muted-foreground">
                عرض الإطلاق — توصيل مجاني داخل الإمارات فوق 500 درهم
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* المزايا */}
      <section className="border-y bg-card">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { icon: Plane, title: "من دبي إلى لندن", text: "بمقاس المقصورة وجاهزة لأوراقك" },
            { icon: Truck, title: "توصيل خليجي", text: "مجاني داخل الإمارات فوق 500 درهم" },
            { icon: ShieldCheck, title: "ضمان سنتين", text: "جلد طبيعي كامل الحبة، مضمون" },
            { icon: Gift, title: "جاهزة للإهداء", text: "علبة أنيقة مع كل طلب" },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex flex-col items-start gap-2">
              <Icon className="h-5 w-5 text-accent-foreground" />
              <p className="font-semibold text-sm">{title}</p>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* المجموعة */}
      <section id="collection-ar" className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent-foreground">
              المجموعة
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">كل ما تحتاجه الرحلة</h2>
          </div>
          <p className="hidden sm:block text-sm text-muted-foreground max-w-xs text-left">
            ثمانية أساسيات فقط. كل قطعة مصممة لتكمل الأخرى.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-lg border border-dashed p-16 text-center">
            <p className="text-lg font-medium">لا توجد منتجات</p>
            <p className="text-sm text-muted-foreground mt-2">
              يتم إضافة قطع جديدة إلى المجموعة قريباً.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* عرض الحزمة */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] opacity-80">
            الطريقة الأذكى للشراء
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 max-w-2xl mx-auto leading-tight">
            اجمع أي حقيبة مع منظم واجعل سفرك مرتباً من اليوم الأول
          </h2>
          <p className="mt-4 opacity-80 max-w-xl mx-auto">
            حقيبة الصعود ومكعبات التنظيم صُممت كنظام واحد. أضف محفظة الجواز ولن تفارقك أوراقك.
          </p>
          <a
            href="#collection-ar"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-primary-foreground px-6 py-3 text-sm font-medium text-primary transition-opacity hover:opacity-90"
          >
            كوّن مجموعتك
          </a>
        </div>
      </section>

      {/* التوصيل والمناطق */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold">
          إكسسوارات سفر تُوصَّل إلى الإمارات ودول الخليج
        </h2>
        <div className="mt-6 grid gap-8 md:grid-cols-2 text-muted-foreground leading-relaxed">
          <p>
            اطلب محفظة جواز سفر أو غطاء جواز أو حقيبة صعود للطائرة أو شنطة سفر
            ونوصلها إلى أي مكان في الإمارات: دبي، أبوظبي، الشارقة، عجمان، رأس الخيمة،
            الفجيرة وأم القيوين. التوصيل مجاني داخل الإمارات للطلبات فوق 500 درهم،
            وخلال 2 إلى 4 أيام لبقية الطلبات.
          </p>
          <p>
            كما نشحن إلى السعودية وقطر والكويت والبحرين وعُمان. جميع الأسعار بالدرهم
            الإماراتي، وكل قطعة بمقاس المقصورة لرحلاتك من مطارات دبي وأبوظبي، وتصل في
            علبة أنيقة جاهزة للإهداء مع ضمان حرفية لمدة سنتين.
          </p>
        </div>
      </section>


      {/* المجلة */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        <div className="rounded-lg bg-secondary p-8 sm:p-12">
          <p className="text-xs tracking-widest text-accent">مجلة باكري</p>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3">
            نصائح سفر للمسافرين في الإمارات ودول الخليج
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl leading-loose">
            قواعد حقيبة المقصورة من دبي وأبوظبي، قائمة أوراق السفر للمقيمين في الإمارات،
            قوائم حزم الصيف، والسفر بحقيبة يد فقط.
          </p>
          <ul className="mt-6 space-y-2">
            {arPosts.slice(0, 3).map((post) => (
              <li key={post.slug}>
                <Link
                  to="/ar/journal/$slug"
                  params={{ slug: post.slug }}
                  className="text-sm hover:text-accent transition-colors underline underline-offset-4 decoration-accent/40"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/ar/journal"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            اقرأ المجلة
          </Link>
        </div>
      </section>

      {/* التذييل */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 flex flex-col sm:flex-row items-start justify-between gap-8">
          <div>
            <p className="text-2xl font-bold">باكري</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              إكسسوارات سفر فاخرة، مصممة في الإمارات وتُوصَّل إلى دول الخليج.
            </p>
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">وعدنا</p>
            <p>مواد طبيعية كاملة الحبة</p>
            <p>ضمان حرفية لمدة سنتين</p>
            <p>إرجاع سهل خلال 30 يوماً</p>
          </div>
        </div>
        <div className="border-t py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} باكري. جميع الحقوق محفوظة.
        </div>
      </footer>
    </main>
  );
}
