import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { ITEMS_PER_PAGE } from '../../app/constants';

function getPagination(current, total) {
  const pages = [];

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  pages.push(1);
  pages.push(2);

  if (current > 4) pages.push("...");

  const start = Math.max(3, current - 1);
  const end = Math.min(total - 2, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 3) pages.push("...");

  pages.push(total - 1);
  pages.push(total);

  return pages;
}

export default function Pagination({ handlePage, page, totalItems }) {
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const pagination = getPagination(page, totalPages);

  return (
    <>
      {/* Mobile Prev / Next */}
      <div className="flex flex-1 justify-between sm:hidden">
        <div
          onClick={() => handlePage(page > 1 ? page - 1 : page)}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
<ChevronLeftIcon className="size-5" />
        </div>
        <div
          onClick={() => handlePage(page < totalPages ? page + 1 : page)}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <ChevronRightIcon className="size-5" />
        </div>
      </div>

      {/* Desktop Pagination */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{(page - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(page * ITEMS_PER_PAGE, totalItems)}
            </span>{' '}
            of <span className="font-medium">{totalItems}</span> results
          </p>
        </div>

        <div>
          <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-xs">

            {/* Prev */}
            <div
              onClick={() => handlePage(page > 1 ? page - 1 : page)}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 hover:bg-gray-50 cursor-pointer"
            >
              <ChevronLeftIcon className="size-5" />
            </div>

            {/* Page Numbers */}
            {pagination.map((p, i) =>
              p === "..." ? (
                <div
                  key={i}
                  className="relative inline-flex items-center px-4 py-2 text-gray-400 text-sm font-semibold"
                >
                  ...
                </div>
              ) : (
                <div
                  key={i}
                  onClick={() => handlePage(p)}
                  className={`relative cursor-pointer inline-flex items-center px-4 py-2 text-sm font-semibold
                    ${p === page ? "bg-indigo-600 text-white" : "text-gray-600 ring-1 ring-gray-300 hover:bg-gray-50"}
                  `}
                >
                  {p}
                </div>
              )
            )}

            {/* Next */}
            <div
              onClick={() => handlePage(page < totalPages ? page + 1 : page)}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 hover:bg-gray-50 cursor-pointer"
            >
              <ChevronRightIcon className="size-5" />
            </div>

          </nav>
        </div>
      </div>
    </>
  );
}
