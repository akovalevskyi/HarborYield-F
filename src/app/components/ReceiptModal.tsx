"use client";

export default function ReceiptModal({
  open,
  href,
  label,
  title,
  subtitle,
  onClose,
}: {
  open: boolean;
  href: string | null;
  label?: string;
  title?: string;
  subtitle?: string;
  onClose: () => void;
}) {
  if (!open || !href) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div>
          <p className="modal-title">{title ?? "Receipt Ready"}</p>
          <p className="modal-text">{subtitle ?? "Your Oasis receipt is recorded."}</p>
          <a className="link-button" href={href} target="_blank" rel="noreferrer">
            {label ?? "View receipt in Oasis"}
          </a>
        </div>
        <button className="button ghost tiny" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
