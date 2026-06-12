"use client";

import { useRef, useState, type InputHTMLAttributes, type ReactNode } from "react";

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-600">{message}</p>;
}

export function FieldLabel({
  htmlFor,
  children,
  optional,
}: {
  htmlFor?: string;
  children: ReactNode;
  optional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-900">
      {children}
      {optional && <span className="text-slate-400"> (optional)</span>}
    </label>
  );
}

const inputClasses =
  "mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClasses} ${props.className ?? ""}`} />;
}

export function TextAreaField({
  id,
  name,
  rows = 4,
  maxLength,
  defaultValue,
  placeholder,
}: {
  id: string;
  name: string;
  rows?: number;
  maxLength?: number;
  defaultValue?: string;
  placeholder?: string;
}) {
  const [length, setLength] = useState(defaultValue?.length ?? 0);

  return (
    <div>
      <textarea
        id={id}
        name={name}
        rows={rows}
        maxLength={maxLength}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={(e) => setLength(e.target.value.length)}
        className={inputClasses}
      />
      {maxLength && (
        <p className="mt-1 text-right text-xs text-slate-400">
          {length}/{maxLength}
        </p>
      )}
    </div>
  );
}

export function SelectInput({
  id,
  name,
  defaultValue,
  options,
  placeholder,
  onChange,
}: {
  id: string;
  name: string;
  defaultValue?: string;
  options: readonly string[];
  placeholder?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <select
      id={id}
      name={name}
      defaultValue={defaultValue ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      className={inputClasses}
    >
      <option value="" disabled>
        {placeholder ?? "Select…"}
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export function InfoBox({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
        />
      </svg>
      <p>{children}</p>
    </div>
  );
}

export function ChipRadio({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const checked = value === option;
        return (
          <label
            key={option}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm font-medium transition ${
              checked
                ? "border-brand bg-brand text-white"
                : "border-slate-300 bg-white text-slate-700 hover:border-brand"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={checked}
              onChange={() => onChange(option)}
              className="sr-only"
            />
            {option}
          </label>
        );
      })}
    </div>
  );
}

export function ChipCheckbox({
  name,
  option,
  checked,
  defaultChecked,
  onChange,
}: {
  name: string;
  option: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
  const isChecked = checked !== undefined ? checked : internalChecked;

  return (
    <label
      className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm font-medium transition ${
        isChecked
          ? "border-brand bg-brand text-white"
          : "border-slate-300 bg-white text-slate-700 hover:border-brand"
      }`}
    >
      <input
        type="checkbox"
        name={name}
        value={option}
        checked={checked !== undefined ? checked : undefined}
        defaultChecked={checked === undefined ? defaultChecked : undefined}
        onChange={(e) => {
          if (checked === undefined) setInternalChecked(e.target.checked);
          onChange?.(e.target.checked);
        }}
        className="sr-only"
      />
      {option}
    </label>
  );
}

export function CheckboxRow({
  name,
  value,
  label,
}: {
  name: string;
  value: string;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:border-brand">
      <input
        type="checkbox"
        name={name}
        value={value}
        className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
      />
      {label}
    </label>
  );
}

export function TagInput({
  name,
  placeholder,
}: {
  name: string;
  placeholder?: string;
}) {
  const [tags, setTags] = useState<string[]>([]);
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const value = draft.trim();
    if (value && !tags.includes(value)) {
      setTags([...tags, value]);
    }
    setDraft("");
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-brand-light px-3 py-1 text-sm font-medium text-brand"
          >
            {tag}
            <button
              type="button"
              onClick={() => setTags(tags.filter((t) => t !== tag))}
              className="text-brand hover:text-brand-dark"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder={placeholder}
          className={inputClasses}
        />
        <button
          type="button"
          onClick={addTag}
          className="mt-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand hover:text-brand"
        >
          Add
        </button>
      </div>
      <input type="hidden" name={name} value={tags.join(",")} />
    </div>
  );
}

export function PhotoUpload({
  name,
  label,
  helpText,
  error,
}: {
  name: string;
  label: string;
  helpText: string;
  error?: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        className={`flex aspect-[4/5] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed text-center transition hover:border-brand ${
          error ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
        }`}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={`${label} preview`} className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
            </svg>
            <span className="text-sm font-medium text-slate-900">{label}</span>
            <span className="text-xs">{helpText}</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/jpeg,image/png,.jpg,.jpeg,.png"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          setPreview(file ? URL.createObjectURL(file) : null);
        }}
      />
      <p className="mt-1 text-center text-xs text-slate-400">JPG or PNG, up to 5MB</p>
      <FieldError message={error} />
    </div>
  );
}
