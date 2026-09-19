import { createFileRoute, Link } from "@tanstack/react-router";
import { enPosts } from "@/content/posts";

export const Route = createFileRoute("/journal/")({
  staticData: { sitemap: true },
  component: JournalIndex,
  head: () => ({
    meta: [
      { title: "Travel Tips for UAE & GCC Travellers | Backri Journal" },
      {
        name: "description",
        content:
          "Practical travel tips for UAE and GCC travellers: cabin baggage rules from Dubai and Abu Dhabi, document checklists, summer packing lists and carry-on only guides.",
      },
      {
        name: "keywords",
        content:
          "travel tips UAE, packing tips Dubai, cabin baggage Dubai, travel checklist GCC, carry on packing UAE",
      },
      { property: "og:title", content: "Travel Tips for UAE & GCC Travellers | Backri Journal" },
      {
        property: "og:description",
        content:
          "Cabin baggage, documents and packing guides written for travellers flying out of the UAE and the Gulf.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/journal" },
      { property: "og:locale", content: "en_AE" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "/journal" },
      { rel: "alternate", hrefLang: "en-AE", href: "/journal" },
      { rel: "alternate", hrefLang: "ar-AE", href: "/ar/journal" },
      { rel: "alternate", hrefLang: "x-default", href: "/journal" },
    ],
  }),
});

function JournalIndex() {
  return (
    <main>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pt-16 pb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Backri Journal</p>
        <h1 className="font-display text-4xl sm:text-5xl mt-3 leading-tight">
          Travel tips for UAE &amp; GCC travellers
        </h1>
        <p className="mt-5 text-muted-foreground leading-relaxed">
          Short, practical guides from the people who make our passport wallets, cabin
          luggage and packing organisers — written for departures from Dubai, Abu Dhabi
          and across the Gulf.
        </p>
        <Link
          to="/ar/journal"
          lang="ar"
          className="mt-4 inline-block text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          اقرأ بالعربية
        </Link>
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-20">
        <ul className="divide-y border-t">
          {enPosts.map((post) => (
            <li key={post.slug} className="py-8">
              <p className="text-xs text-muted-foreground">
                {new Date(post.date).toLocaleDateString("en-AE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                · {post.readMinutes} min read
              </p>
              <h2 className="font-display text-2xl sm:text-3xl mt-2 leading-snug">
                <Link
                  to="/journal/$slug"
                  params={{ slug: post.slug }}
                  className="hover:text-accent transition-colors"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{post.excerpt}</p>
              <Link
                to="/journal/$slug"
                params={{ slug: post.slug }}
                className="mt-4 inline-block text-sm font-medium text-foreground underline underline-offset-4 decoration-accent"
              >
                Read the guide
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-lg bg-secondary p-8 text-center">
          <h2 className="font-display text-2xl">Pack it properly</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Passport wallets, cabin luggage and packing organisers, delivered across the UAE and GCC.
          </p>
          <Link
            to="/"
            hash="collection"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Shop the collection
          </Link>
        </div>
      </section>
    </main>
  );
}
