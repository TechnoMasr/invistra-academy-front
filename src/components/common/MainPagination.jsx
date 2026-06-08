import { TfiArrowCircleLeft, TfiArrowCircleRight } from "react-icons/tfi";

const MainPagination = ({ totalPages, currentPage, onPageChange }) => {
  if (!totalPages || totalPages === 0 || totalPages === 1) return null;

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const getVisiblePages = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (totalPages <= 5) {
      start = 1;
      end = totalPages;
    } else {
      if (currentPage <= 3) {
        start = 1;
        end = 5;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 4;
        end = totalPages;
      }
    }

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="pagination mt-4">
      <button
        aria-label="previous"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className={`pagination-btn ${
          currentPage === 1
            ? "pagination-btn--disabled"
            : "pagination-btn--normal"
        }`}
      >
        <TfiArrowCircleLeft className="text-lg rtl:rotate-180" />
      </button>

      {visiblePages.map((page) => (
        <button
          key={page}
          aria-label={`go to page ${page}`}
          onClick={() => handlePageClick(page)}
          className={`pagination-btn ${
            currentPage === page
              ? "pagination-btn--active"
              : "pagination-btn--normal"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        aria-label="next"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`pagination-btn ${
          currentPage === totalPages
            ? "pagination-btn--disabled"
            : "pagination-btn--normal"
        }`}
      >
        <TfiArrowCircleRight className="text-lg rtl:rotate-180" />
      </button>
    </div>
  );
};

export default MainPagination;
