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
    <div className="mt-4 flex items-center justify-start gap-2 text-sm">
      {/* Next (سمت راست در RTL) */}
      <Button
        variant="secondary"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        بعدی
      </Button>

      {/* Info */}
      <span className="text-slate-600">
        صفحه {page} از {totalPages}
      </span>

      {/* Previous */}
      <Button
        variant="secondary"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        قبلی
      </Button>
    </div>
  );
}