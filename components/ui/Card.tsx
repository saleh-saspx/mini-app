export default function Card({
  title,
  children,
  action
}: {
  title?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition text-right">
      
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-2">
          
          {/* Title */}
          {title && (
            <h2 className="text-base font-bold text-slate-800">
              {title}
            </h2>
          )}

          {/* Action (دکمه / لینک) */}
          {action && (
            <div className="shrink-0">
              {action}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="text-sm text-slate-700">
        {children}
      </div>
    </div>
  );
}