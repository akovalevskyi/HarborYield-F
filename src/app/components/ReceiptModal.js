"use client";

export default function ReceiptModal({ open, href, label, title, subtitle, onClose }) {
  if (!open || !href) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal modal-receipt">
        <p className="modal-title">{title ?? "Receipt Ready"}</p>
        <p className="modal-text">{subtitle ?? "Your Oasis receipt is recorded."}</p>
        <a className="receipt-link" href={href} target="_blank" rel="noreferrer">
          {label ?? "View receipt in Oasis"}
        </a>
        <button className="receipt-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
