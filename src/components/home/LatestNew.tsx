import Image from "next/image";
import Link from "next/link";

interface Blog {
  id: number;
  image: string;
  author: string;
  date: string;
  title: string;
}

const blogs: Blog[] = [
  {
    id: 1,
    image: "https://i.ibb.co.com/67vFXvdx/blog-1-1.jpg",
    author: "Michel Smith",
    date: "24 Feb , 2025",
    title: "Top 20 Smartwatches Rated Rollable Just Tipped",
  },
  {
    id: 2,
    image: "https://i.ibb.co.com/zTy7fTBY/blog-1-2.jpg",
    author: "Michel Smith",
    date: "24 Feb , 2025",
    title: "The Ultimate Guide To Marketing Strategies to Improve Sales",
  },
  {
    id: 3,
    image: "https://i.ibb.co.com/6JJdBgvj/blog-1-3.jpg",
    author: "Michel Smith",
    date: "24 Feb , 2025",
    title: "50 Sales Questions to Determine Your Customer’s Needs",
  },
  {
    id: 4,
    image: "https://i.ibb.co.com/YFysBnJr/blog-1-4.jpg",
    author: "Michel Smith",
    date: "24 Feb , 2025",
    title: "10 Content Marketing Trends and Ideas to Increase Traffic",
  },
];

export default function LatestNews() {
  return (
    <section
      id="blog-sec"
      className="overflow-hidden bg-[#FAF5FF] dark:bg-[#0b1325] py-16 lg:py-20"
    >
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col items-center justify-between gap-4 lg:flex-row">
          {/* Title */}
          <div className="w-full lg:w-auto">
            <h2 className="text-center text-2xl font-bold leading-tight text-purple-950 dark:text-white sm:text-3xl lg:text-left">
              Latest News & Updates
            </h2>
          </div>

          {/* Explore All */}
          <div className="w-full text-center lg:w-auto lg:text-right">
            <Link
              href="/blog"
              className="inline-block border-b-2 border-purple-700 pb-1 text-sm font-semibold text-[#7E22CE] transition-all duration-300 hover:border-purple-950 hover:text-purple-950"
            >
              Explore All
            </Link>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mb-8 h-px w-full bg-purple-200/80" />

        {/* Blog Grid */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-purple-100 bg-white dark:bg-[#0b1325] p-4 shadow-md shadow-purple-900/5 transition-shadow duration-300 hover:shadow-lg hover:shadow-purple-900/10"
            >
              {/* Image */}
              <Link
                href={`/blog/${blog.id}`}
                className="relative block overflow-hidden rounded-lg bg-[#FAF5FF]"
              >
                <Image
                  src={blog.image}
                  alt={blog.title}
                  width={400}
                  height={400}
                  className="h-[250px] w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-[280px] xl:h-[210px]"
                />
              </Link>

              {/* Content */}
              <div className="flex flex-1 flex-col pt-5">
                {/* Meta */}
                <div className="mb-3 flex items-center gap-3 text-xs font-medium text-purple-600">
                  <Link
                    href="/blog"
                    className="transition-colors hover:text-purple-950"
                  >
                    By {blog.author}
                  </Link>

                  <span className="h-1.5 w-1.5 rounded-full bg-purple-300" />

                  <span className="text-purple-400">{blog.date}</span>
                </div>

                {/* Title */}
                <h3 className="mb-4 min-h-[56px] text-base font-semibold leading-snug text-purple-950">
                  <Link
                    href={`/blog/${blog.id}`}
                    className="transition-colors duration-300 hover:text-[#7E22CE]"
                  >
                    {blog.title}
                  </Link>
                </h3>

                {/* Read More */}
                <div className="mt-auto pt-2">
                  <Link
                    href={`/blog/${blog.id}`}
                    className="inline-block border-b border-purple-300 pb-0.5 text-xs font-bold uppercase tracking-wider text-[#7E22CE] transition-all duration-300 hover:border-[#7E22CE] hover:text-purple-950"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
