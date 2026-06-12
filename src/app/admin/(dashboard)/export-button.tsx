"use client";

import { useState } from "react";
import { exportCreatorsCsv } from "../actions";
import { DEFAULT_EXPORT_FIELDS, EXPORT_FIELDS } from "./export-fields";

export function ExportButton({ scope, filename }: { scope: "all" | "approved"; filename: string }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(DEFAULT_EXPORT_FIELDS);
  const [isExporting, setIsExporting] = useState(false);

  const toggleField = (key: string) => {
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const allSelected = selected.length === EXPORT_FIELDS.length;

  const handleExport = async () => {
    if (selected.length === 0) return;
    setIsExporting(true);
    try {
      const csv = await exportCreatorsCsv(scope, selected);
      const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setOpen(false);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        Export
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-slate-900">Export to CSV</h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose which fields to include in the exported file.
            </p>

            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelected(allSelected ? [] : EXPORT_FIELDS.map((f) => f.key))}
                className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
              >
                {allSelected ? "Clear all" : "Select all"}
              </button>
              <span className="text-xs text-slate-400">{selected.length} of {EXPORT_FIELDS.length} selected</span>
            </div>

            <div className="mt-3 grid max-h-80 grid-cols-1 gap-1.5 overflow-y-auto rounded-lg border border-slate-100 p-3 sm:grid-cols-2">
              {EXPORT_FIELDS.map((field) => (
                <label key={field.key} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={selected.includes(field.key)}
                    onChange={() => toggleField(field.key)}
                    className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                  />
                  {field.label}
                </label>
              ))}
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExport}
                disabled={selected.length === 0 || isExporting}
                className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isExporting ? "Exporting..." : "Export CSV"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
