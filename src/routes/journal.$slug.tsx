import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { enPosts, getPost } from "@/content/posts";

export const Route = createFileRoute("/journal/$slug")({
  loader: ({ params }) => {
    const post = getPost(enPosts, params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Unavailable | Backri Journal" }, { name: "robots", content: "noindex" }],
      };
    }
    const { post } = loaderData;
    const url = `/journal/${params.slug}`;
    return {
      meta: [
        { title: post.metaTitle },
        { name: "description", content: post.description },
        { property: "og:title", content: post.metaTitle },
        { property: "og:description", content: post.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:locale", content: "en_AE" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "en-AE", href: url },
        { rel: "alternate", hrefLang: "ar-AE", href: `/ar/journal/${params.slug}` },
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
            inLanguage: "en-AE",
            author: { "@type": "Organization", name: "Backri" },
            publisher: { "@type": "Organization", name: "Backri" },
          }),
        },
      ],
    };
  },
  component: JournalPost,
  notFoundComponent: PostNotFound,
});

function PostNotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-24 text-center">
      <h1 className="font-display text-3xl">We couldn't find that guide</h1>
      <Link
        to="/journal"
        className="mt-6 inline-block text-sm underline underline-offset-4 decoration-accent"
      >
        Back to the journal
      </Link>
    </main>
  );
}

function JournalPost() {
  const { post } = Route.useLoaderData();
  const others = enPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main>
      <article className="mx-auto max-w-2xl px-4 sm:px-6 pt-16 pb-12">
        <Link
          to="/journal"
          className="text-xs uppercase tracking-[0.2em] text-accent hover:opacity-80"
        >
          Backri Journal
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl mt-4 leading-tight">{post.title}</h1>
        <p className="mt-4 text-xs text-muted-foreground">
          {new Date(post.date).toLocaleDateString("en-AE", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}{" "}
          · {post.readMinutes} min read
        </p>
        <p className="mt-8 text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>

        {post.sections.map((section) => (
          <section key={section.heading} className="mt-10">
            <h2 className="font-display text-2xl leading-snug">{section.heading}</h2>
            {section.body.map((paragraph, i) => (
              <p key={i} className="mt-4 text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        <div className="mt-14 rounded-lg bg-secondary p-8">
          <h2 className="font-display text-2xl">Travel with less friction</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Leather passport wallets, cabin luggage and packing organisers. Free UAE delivery
            over AED 500, shipping across the GCC.
          </p>
          <Link
            to="/"
            hash="collection"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Shop the collection
          </Link>
        </div>
      </article>

      <section className="mx-auto max-w-2xl px-4 sm:px-6 pb-20">
        <h2 className="font-display text-xl">Keep reading</h2>
        <ul className="mt-4 space-y-4">
          {others.map((p) => (
            <li key={p.slug}>
              <Link
                to="/journal/$slug"
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
