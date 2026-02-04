"use client";

export default function BlockingModal({ open, message }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="status" aria-live="polite">
      <div className="modal modal-processing">
        <div className="spinner" aria-hidden="true" />
        <p className="modal-title">Processing</p>
        <p className="modal-text">{message ?? "Please wait..."}</p>
        <p className="modal-note">
          Testnet transactions can take up to 2 minutes. Thanks for your patience.
        </p>
      </div>
    </div>
  );
}
