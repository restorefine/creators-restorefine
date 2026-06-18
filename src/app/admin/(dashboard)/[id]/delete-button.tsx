"use client";

import { deleteCreator } from "../../actions";

export function DeleteButton({ creatorId, fullName, className }: { creatorId: string; fullName: string; className: string }) {
  return (
    <form
      action={deleteCreator.bind(null, creatorId)}
      onSubmit={(e) => {
        if (!confirm(`Delete ${fullName}'s application? This permanently removes their record and photos.`)) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className={className}>
        Delete applicant
      </button>
    </form>
  );
}
