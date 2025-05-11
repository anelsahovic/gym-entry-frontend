import React from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';

interface PaginationProps {
  pageCount: number;
  perPage: string;
}

interface PaginationArrowProps {
  direction: 'left' | 'right';
  href: string;
  isDisabled: boolean;
}

const PaginationArrow: React.FC<PaginationArrowProps> = ({
  direction,
  href,
  isDisabled,
}) => {
  const navigate = useNavigate();
  const isLeft = direction === 'left';
  const disabledClassName = isDisabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <Button
      onClick={() => !isDisabled && navigate(href)}
      className={`bg-gray-100 text-gray-500 hover:bg-gray-200 ${disabledClassName}`}
      aria-disabled={isDisabled}
      disabled={isDisabled}
    >
      {isLeft ? <FaCaretLeft /> : <FaCaretRight />}
    </Button>
  );
};

const PaginationComponent: React.FC<PaginationProps> = ({
  pageCount,
  perPage,
}) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    params.set('per_page', perPage);
    return `${location.pathname}?${params.toString()}`;
  };

  const getVisiblePages = () => {
    const maxVisible = 3;
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(pageCount, startPage + maxVisible - 1);
    const adjustedStart = Math.max(1, endPage - maxVisible + 1);

    return Array.from(
      { length: endPage - adjustedStart + 1 },
      (_, i) => adjustedStart + i
    );
  };

  const visiblePages = getVisiblePages();

  return (
    <Pagination>
      <PaginationContent className="flex gap-2 items-center">
        {/* Left Arrow */}
        <PaginationItem>
          <PaginationArrow
            direction="left"
            href={createPageURL(currentPage - 1)}
            isDisabled={currentPage <= 1}
          />
        </PaginationItem>

        {/* Page Numbers */}
        {visiblePages.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <Button
              onClick={() => navigate(createPageURL(pageNumber))}
              className={`${
                currentPage === pageNumber
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-white text-gray-800 hover:bg-secondary'
              } `}
            >
              {pageNumber}
            </Button>
          </PaginationItem>
        ))}

        {/* Right Arrow */}
        <PaginationItem>
          <PaginationArrow
            direction="right"
            href={createPageURL(currentPage + 1)}
            isDisabled={currentPage >= pageCount}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export { PaginationComponent };
