interface ConfirmDeleteModalProps {
  isOpen: boolean;
  fileName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({
  isOpen,
  fileName,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm Delete</h3>
        <p className="py-4">
          Are you sure you want to permanently delete{" "}
          <strong>"{fileName}"</strong>? This action cannot be undone.
        </p>
        <div className="modal-action">
          <button className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={onConfirm}>
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
