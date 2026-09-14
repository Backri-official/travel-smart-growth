import { createFileRoute, Link } from "@tanstack/react-router";
import { arPosts } from "@/content/posts";

export const Route = createFileRoute("/ar/journal/")({
  component: ArJournalIndex,
  head: () => ({
    meta: [
      { title: "نصائح سفر للمسافرين في الإمارات والخليج | مجلة باكري" },
      {
        name: "description",
        content:
          "نصائح سفر عملية للمسافرين من الإمارات ودول الخليج: حقيبة المقصورة من دبي وأبوظبي، أوراق السفر، قوائم حزم الصيف، والسفر بحقيبة يد فقط.",
      },
      {
        name: "keywords",
        content: "نصائح سفر الإمارات, حقيبة اليد دبي, قائمة حزم السفر, السفر من الخليج, محفظة جواز سفر",
      },
      { property: "og:title", content: "نصائح سفر للمسافرين في الإمارات والخليج | مجلة باكري" },
      {
        property: "og:description",
        content: "أدلة قصيرة وعملية عن حقيبة المقصورة والأوراق والحزم لرحلاتك من الإمارات والخليج.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/ar/journal" },
      { property: "og:locale", content: "ar_AE" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "/ar/journal" },
      { rel: "alternate", hrefLang: "ar-AE", href: "/ar/journal" },
      { rel: "alternate", hrefLang: "en-AE", href: "/journal" },
    ],
  }),
});

function ArJournalIndex() {
  return (
    <main dir="rtl" lang="ar" className="font-arabic text-right">
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pt-16 pb-10">
        <p className="text-xs tracking-widest text-accent">مجلة باكري</p>
        <h1 className="text-3xl sm:text-4xl font-bold mt-3 leading-snug">
          نصائح سفر للمسافرين في الإمارات ودول الخليج
        </h1>
        <p className="mt-5 text-muted-foreground leading-loose">
          أدلة قصيرة وعملية من فريق باكري — كتبناها لرحلاتك المنطلقة من دبي وأبوظبي
          وبقية دول الخليج، عن حقيبة المقصورة وأوراق السفر وترتيب الحقيبة.
        </p>
        <Link
          to="/journal"
          lang="en"
          dir="ltr"
          className="mt-4 inline-block text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Read in English
        </Link>
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-20">
        <ul className="divide-y border-t">
          {arPosts.map((post) => (
            <li key={post.slug} className="py-8">
              <p className="text-xs text-muted-foreground">
                {new Date(post.date).toLocaleDateString("ar-AE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                · قراءة {post.readMinutes} دقائق
              </p>
              <h2 className="text-2xl font-bold mt-2 leading-snug">
                <Link
                  to="/ar/journal/$slug"
                  params={{ slug: post.slug }}
                  className="hover:text-accent transition-colors"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3 text-muted-foreground leading-loose">{post.excerpt}</p>
              <Link
                to="/ar/journal/$slug"
                params={{ slug: post.slug }}
                className="mt-4 inline-block text-sm font-medium text-foreground underline underline-offset-4 decoration-accent"
              >
                اقرأ الدليل
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-lg bg-secondary p-8 text-center">
          <h2 className="text-2xl font-bold">جهّز حقيبتك كما يجب</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            محافظ جوازات وحقائب مقصورة ومنظمات حزم، تُوصَّل إلى الإمارات ودول الخليج.
          </p>
          <Link
            to="/ar"
            hash="collection-ar"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            تسوّق المجموعة
          </Link>
        </div>
      </section>
    </main>
  );
}
