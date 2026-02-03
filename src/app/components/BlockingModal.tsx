"use client";

export default function BlockingModal({ open, message }: { open: boolean; message?: string }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="status" aria-live="polite">
      <div className="modal">
        <div className="spinner" aria-hidden="true" />
        <div>
          <p className="modal-title">Processing</p>
          <p className="modal-text">{message ?? "Please wait..."}</p>
        </div>
      </div>
    </div>
  );
}
