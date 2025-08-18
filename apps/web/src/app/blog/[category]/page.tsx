import { notFound } from "next/navigation";

import { BlogCard } from "@/components/blog-card";
import { sanityFetch } from "@/lib/sanity/live";
import { queryBlogsByCategory } from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";
import { handleErrors } from "@/utils";
import CategoryList from "@/components/sections/category-list";

interface BlogCategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

async function fetchBlogPosts(category: string) {
  return await handleErrors(
    sanityFetch({
      query: queryBlogsByCategory,
      params: { category },
    })
  );
}

export async function generateMetadata(props: BlogCategoryPageProps) {
  const params = await props.params;

  return getSEOMetadata({
    title: `${params.category} Blog Posts  | Turbo Start Sanity`, 
    description: `Discover expert insights and tutorials about  ${params.category}. Browse our collection of in-depth articles and guides.`,
    slug: `/blog/${params.category}`,
  });
}

export default async function BlogCategoryPage(props: BlogCategoryPageProps) {
  const params = await props.params;

  const [res, err] = await fetchBlogPosts(params.category);
  if (err || !res?.data) notFound();

  const blogs = res.data;
 

  if (!blogs.length) {
    return (
      <main className="container my-16 mx-auto px-4 md:px-6">
        <h1 className="text-4xl font-medium mb-4 uppercase">Blog / {params.category}</h1>
        <div className="h-[1px] mb-2 w-1/6 dark:bg-gray-100/10 bg-gray-700/10 rounded-full "></div>
        <div className="text-lg font-geist mb-4 md:pr-96 md:mr-20 overflow-hidden"> 
          Discover expert insights and tutorials about {params.category}. Browse our collection of in-depth articles and guides.
          We share discourse on the latest tech. Keep up-to-date with content operating systems, workflows, scalability and sometimes, the odd CMS roast
        </div>
        <p className="text-muted-foreground">
          No blog posts found in this category.
        </p>
        <div className="my-8">
          <div className="w-full h-[1px] dark:bg-gray-100/10 bg-gray-400/20 rounded-full my-4"></div>
          <CategoryList currentCategory={params.category} />
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background">
      <div className="container my-16 mx-auto px-4 md:px-6">
        <h1 className="text-4xl font-medium mb-4 uppercase">Blog / {params.category} </h1>
        <div className="h-[1px] mb-2 w-1/6 dark:bg-gray-100/10 bg-gray-700/10 rounded-full "></div>
        <div className="text-lg font-geist mb-4 md:pr-96 md:mr-20 text-muted-foreground overflow-hidden"> 
          Discover expert insights and tutorials about {params.category}. Browse our collection of in-depth articles and guides.
          We share discourse on the latest tech. Keep up-to-date with content operating systems, workflows, scalability and sometimes, the odd CMS roast
        </div>
        <div className="my-8">
          <div className="w-full h-[1px] dark:bg-gray-100/10 bg-gray-400/20 rounded-full my-4"></div>
          <CategoryList currentCategory={params.category} />
        </div>
        <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      </div>
    </main>
  );
}
