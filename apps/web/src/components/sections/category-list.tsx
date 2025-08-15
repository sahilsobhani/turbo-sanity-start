import Link from "next/link";
import { client } from "@/lib/sanity/client";

const query = `*[_type == "category"]{
  title,
  "slug": slug.current
} | order(title asc)`;

export default async function CategoryList() {
  const categories: { title: string; slug: string }[] = await client.fetch(query);

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/blog/${category.slug}`}
          className="px-3 py-1 rounded-full border border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-900 text-sm"
        >
          {category.title}
        </Link>
      ))}
    </div>
  );
}
