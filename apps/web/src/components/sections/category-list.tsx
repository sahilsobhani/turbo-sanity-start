import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { Cross  } from "lucide-react"; 

const query = `*[_type == "category"]{
  title,
  "slug": slug.current
} | order(title asc)`;

interface CategoryListProps {
  currentCategory?: string;
}

export default async function CategoryList({ currentCategory }: CategoryListProps) {
  const categories: { title: string; slug: string }[] = await client.fetch(query);

  return (
    <div className="flex gap-2 overflow-x-auto py-2">
      {categories.map((category) => {
        const isActive = category.slug === currentCategory;
        return (
          <Link
            key={category.slug}
            href={`/blog/${category.slug}`}
            className={`flex items-center gap-1 px-3 py-1 mb-2 rounded-full border text-sm whitespace-nowrap ${
              isActive 
                ? "bg-gray-100 font-semibold hover:bg-gray-100 border-0 dark:bg-gray-900 dark:hover:bg-gray-900"
                : "border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-900"
            }`}
          >
            {category.title}
            {isActive && <Cross className="w-4 h-4" aria-hidden="true" />}
          </Link>
        );
      })}
    </div>
  );
}
