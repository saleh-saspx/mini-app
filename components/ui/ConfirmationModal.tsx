import Button from './Button';

export default function ConfirmationModal({
  open,
  title,
  description,
  confirmText,
  onCancel,
  onConfirm,
  loading
}: {
  open: boolean;
  title: string;
  description: string;
  confirmText: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl text-right">
        
        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          {description}
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-row-reverse gap-2">
          
          {/* Confirm (اول دیده میشه در RTL) */}
          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'در حال پردازش...' : confirmText}
          </Button>

          {/* Cancel */}
          <Button variant="secondary" onClick={onCancel}>
            انصراف
          </Button>
        </div>
      </div>
    </div>
  );
}