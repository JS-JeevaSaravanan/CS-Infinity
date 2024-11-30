import { getAllContentPaths, getContentData } from '../utils/markdown';
import Link from 'next/link';

export default async function Home() {
  const paths = getAllContentPaths();
  const contents = await Promise.all(
    paths.slice(0, 10).map(async (path) => await getContentData(path))
  );

  // Group contents by directory
  const groupedContents = contents.reduce((acc, content) => {
    const pathParts = content.filePath.split('/');
    const directory = pathParts[pathParts.length - 2] || 'Other';
    
    if (!acc[directory]) {
      acc[directory] = [];
    }
    acc[directory].push(content);
    return acc;
  }, {} as Record<string, typeof contents>);

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4"> 
          <div className="flex h-16 shrink-0 items-center">
            <span className="text-lg font-semibold">Categories</span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              {Object.keys(groupedContents).map((directory) => (
                <li key={directory}>
                  <div className="text-xs font-semibold leading-6 text-gray-400">
                    {directory}
                  </div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {groupedContents[directory].map((content) => (
                      <li key={content.filePath}>
                        <Link
                          href={`#${content.filePath}`}
                          className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                        >
                          {content.filePath.split('/').pop()?.replace('.md', '')}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <main className="py-10 lg:pl-72">
        <div className="px-4 sm:px-6 lg:px-8">
          {Object.entries(groupedContents).map(([directory, contents]) => (
            <div key={directory} className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{directory}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contents.map((content) => (
                  <article
                    key={content.filePath}
                    id={content.filePath}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
                  >
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                      {content.filePath.split('/').pop()?.replace('.md', '')}
                    </h3>
                    <div 
                      className="prose dark:prose-invert prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: content.contentHtml }} 
                    />
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
