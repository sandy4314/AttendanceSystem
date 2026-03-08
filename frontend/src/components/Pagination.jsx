'use client';

export default function Pagination({ page, totalPages, setPage }) {

  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];

    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex items-center justify-between mt-6">

      <p className="text-sm text-gray-600">
        Page <span className="font-semibold">{page}</span> of{" "}
        <span className="font-semibold">{totalPages}</span>
      </p>

      <div className="flex gap-1">

        {/* Previous */}
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className={`px-3 py-1 rounded-md border text-sm transition
        ${page === 1
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-white hover:bg-gray-100 text-gray-700"
        }`}

        >
          Previous
        </button>

        {pages.map((p, i) => {

  if (p === "...") {
    return (
      <span key={`ellipsis-${i}`} className="px-2 py-1 text-gray-500">
        ...
      </span>
    );
  }

  return (
    <button
      key={`page-${p}-${i}`}
      onClick={() => setPage(p)}
      className={`px-3 py-1 border rounded-md text-sm transition
        ${page === p
          ? "bg-amber-500 text-white border-amber-500"
          : "bg-white text-gray-700 hover:bg-gray-100"}
      `}
    >
      {p}
    </button>
  );
})}

        {/* Next */}
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          
          className={`px-3 py-1 rounded-md border text-sm transition
                  ${page === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100 text-gray-700"
                  }`}


          >
          Next
        </button>

      </div>
    </div>
  );
}