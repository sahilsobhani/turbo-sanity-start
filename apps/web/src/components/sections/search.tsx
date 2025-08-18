'use client';

import Link from "next/link";
import {
  InstantSearch,
  SearchBox,
  InfiniteHits as  Hits,
  useSearchBox,
  Configure,
  Highlight,
} from 'react-instantsearch';
import { searchClient as client } from '@/lib/search/algoliaConfig';


const Hit = ({ hit }: { hit: any }) => {

  // what: Ensure slug is always a valid URL: if it was starting with a slash, remove it
  // why: This is to prevent issues with Next.js routing when the slug is empty or malformed
  const slug = hit.slug ? `/${hit.slug.replace(/^\/+/, '')}` : "#";

  return (
    <Link href={slug} className="block">
      <div className="px-4 py-3 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/50 transition">
        <h2 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">
          <Highlight classNames={
            { highlighted: "dark:bg-slate-50/80 dark:text-black bg-slate-700 text-white" } //doesn't work for some reason, but added for clarity
          } attribute="title" hit={hit} />
        </h2>

        <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
          <Highlight classNames={
            { highlighted: "dark:bg-slate-50/80 dark:text-black bg-slate-700 text-white" } //doesn't work for some reason, but added for clarity
          } attribute="description" hit={hit} />
        </p>

        {hit.authors && hit.authors.length > 0 && (
          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            by {hit.authors.join(", ")}
          </p>
        )}
      </div>
    </Link>

  );
};

//what: Conditional rendering of hits based on search query\
//why: To avoid showing hits when there is no search query, improving UX: otherwise all blogs are returned as hits
function ConditionalHits() {
  const { query } = useSearchBox();
  if (!query) return null;

  return (
    <div
      className="
        absolute left-1/2 -translate-x-1/2 mt-2
        w-full max-w-xl z-50
      "
    >
      <div
        className="
          rounded-md border border-zinc-200 dark:border-zinc-700
          bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg
          shadow-xl overflow-hidden
          max-h-96 overflow-y-auto
        "
      >
        <Hits
          hitComponent={Hit}
          classNames={{
            list: 'divide-y divide-zinc-200 dark:divide-zinc-700',
            loadPrevious: 'px-4 hidden py-2 text-center text-sm text-zinc-500 dark:text-zinc-400',
            loadMore: 'px-4 py-2 text-center text-sm text-zinc-500 dark:text-zinc-400',
          }}
        />
      </div>
    </div>
  );
}

export function SearchSection() {
  return (
    <InstantSearch searchClient={client} indexName="blogs">
      <Configure hitsPerPage={6} />
      <div className="relative max-w-xl mx-auto mb-12">
        <SearchBox
          placeholder="Start typing to search for blogs..."
          classNames={{
            root: 'w-full',
            form: 'relative flex items-center',
            input:
              'w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm',
          }}
        />
        <ConditionalHits />
      </div>
    </InstantSearch>
  );
}
