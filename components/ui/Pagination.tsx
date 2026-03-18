import Button from './Button';

export default function Pagination({
  page,
  totalPages,
  onPageChange
}: {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
}) {
  return (
    <div className="mt-4 flex items-center justify-end gap-2 text-sm">
      <Button variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </Button>
      <span>
        Page {page} of {totalPages}
      </span>
      <Button
        variant="secondary"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
