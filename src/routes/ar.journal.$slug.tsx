import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { arPosts, getPost } from "@/content/posts";

export const Route = createFileRoute("/ar/journal/$slug")({
  loader: ({ params }) => {
    const post = getPost(arPosts, params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "غير متاح | مجلة باكري" }, { name: "robots", content: "noindex" }],
      };
    }
    const { post } = loaderData;
    const url = `/ar/journal/${params.slug}`;
    return {
      meta: [
        { title: post.metaTitle },
        { name: "description", content: post.description },
        { property: "og:title", content: post.metaTitle },
        { property: "og:description", content: post.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:locale", content: "ar_AE" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "ar-AE", href: url },
        { rel: "alternate", hrefLang: "en-AE", href: `/journal/${params.slug}` },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            inLanguage: "ar-AE",
            author: { "@type": "Organization", name: "Backri" },
            publisher: { "@type": "Organization", name: "Backri" },
          }),
        },
      ],
    };
  },
  component: ArJournalPost,
  notFoundComponent: ArPostNotFound,
});

function ArPostNotFound() {
  return (
    <main dir="rtl" lang="ar" className="font-arabic mx-auto max-w-3xl px-4 sm:px-6 py-24 text-center">
      <h1 className="text-2xl font-bold">لم نجد هذا المقال</h1>
      <Link
        to="/ar/journal"
        className="mt-6 inline-block text-sm underline underline-offset-4 decoration-accent"
      >
        العودة إلى المجلة
      </Link>
    </main>
  );
}

function ArJournalPost() {
  const { post } = Route.useLoaderData();
  const others = arPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main dir="rtl" lang="ar" className="font-arabic text-right">
      <article className="mx-auto max-w-2xl px-4 sm:px-6 pt-16 pb-12">
        <Link to="/ar/journal" className="text-xs tracking-widest text-accent hover:opacity-80">
          مجلة باكري
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold mt-4 leading-snug">{post.title}</h1>
        <p className="mt-4 text-xs text-muted-foreground">
          {new Date(post.date).toLocaleDateString("ar-AE", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}{" "}
          · قراءة {post.readMinutes} دقائق
        </p>
        <p className="mt-8 text-lg text-muted-foreground leading-loose">{post.excerpt}</p>

        {post.sections.map((section) => (
          <section key={section.heading} className="mt-10">
            <h2 className="text-xl font-bold leading-snug">{section.heading}</h2>
            {section.body.map((paragraph, i) => (
              <p key={i} className="mt-4 text-muted-foreground leading-loose">
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        <div className="mt-14 rounded-lg bg-secondary p-8">
          <h2 className="text-2xl font-bold">سافر براحة أكبر</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            محافظ جوازات جلدية وحقائب مقصورة ومنظمات حزم. توصيل مجاني داخل الإمارات
            للطلبات فوق 500 درهم، وشحن إلى دول الخليج.
          </p>
          <Link
            to="/ar"
            hash="collection-ar"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            تسوّق المجموعة
          </Link>
        </div>
      </article>

      <section className="mx-auto max-w-2xl px-4 sm:px-6 pb-20">
        <h2 className="text-lg font-bold">اقرأ أيضاً</h2>
        <ul className="mt-4 space-y-4">
          {others.map((p) => (
            <li key={p.slug}>
              <Link
                to="/ar/journal/$slug"
                params={{ slug: p.slug }}
                className="text-sm hover:text-accent transition-colors"
              >
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
