import { notFound } from "next/navigation";
import { stegaClean } from "next-sanity";

import { ArticleJsonLd } from "@/components/json-ld";
import { RichText } from "@/components/richtext";
import { SanityImage } from "@/components/sanity-image";
import { TableOfContent } from "@/components/table-of-content";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import { queryBlogPaths, queryBlogSlugPageData } from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";

import { PokemonCard } from "@/components/sections/pokemon-card";

async function fetchBlogSlugPageData(category: string, slug: string, stega = true) {
  return await sanityFetch({
    query: queryBlogSlugPageData,
    params: { slug: `/blog/${category}/${slug}` },
    stega,
  });
}

async function fetchBlogPaths() {
  const slugs = await client.fetch(queryBlogPaths);
  const paths: { category: string; slug: string }[] = [];
  for (const slug of slugs) {
    if (!slug) continue;
    const [, category, path] = slug.split("/");
    if (category && path) paths.push({ category, slug: path });
  }
  return paths;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const { data } = await fetchBlogSlugPageData(category, slug);
  return getSEOMetadata(
    data
      ? {
        title: data?.title ?? data?.seoTitle ?? "",
        description: data?.description ?? data?.seoDescription ?? "",
        slug: data?.slug,
        contentId: data?._id,
        contentType: data?._type,
        pageType: "article",
      }
      : {},
  );
}

export async function generateStaticParams() {
  return await fetchBlogPaths();
}

export default async function BlogSlugPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const { data } = await fetchBlogSlugPageData(category, slug);
  if (!data) return notFound();
  const { title, description, image, richText, pokemon } = data ?? {};


  return (
    <div className="container my-16 mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <main>
          <ArticleJsonLd article={stegaClean(data)} />
          <header className="mb-8">
            {pokemon && <PokemonCard pokemon={pokemon} />}
            <h1 className="mt-2 text-4xl font-bold">{title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{description}</p>
          </header>
          {image && (
            <div className="mb-12">
              <SanityImage
                asset={image}
                alt={title}
                width={1600}
                loading="eager"
                priority
                height={900}
                className="rounded-lg h-auto w-full"
              />
            </div>
          )}
          <RichText richText={richText ?? []} />
        </main>

        <div className="hidden lg:block">
          <div className="sticky top-4 rounded-lg ">
            <TableOfContent richText={richText} />
          </div>
        </div>
      </div>
    </div>
  );
}
