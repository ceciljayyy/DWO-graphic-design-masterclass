"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { searchCitiesForCountry, type CityOption } from "@/lib/locations";
import { cn } from "@/lib/utils";

type CityComboboxProps = {
  id?: string;
  label: string;
  required?: boolean;
  countryCode: string;
  value: string;
  error?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  className?: string;
};

const controlClassName =
  "mt-2 w-full min-h-12 rounded-sm border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted/70 focus:border-accent focus:ring-1 focus:ring-accent";

export function CityCombobox({
  id,
  label,
  required = false,
  countryCode,
  value,
  error,
  placeholder = "Search city or town",
  onChange,
  onBlur,
  className,
}: CityComboboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listboxId = `${inputId}-cities`;
  const errorId = `${inputId}-error`;
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const query = draft ?? value;
  const options = useMemo(
    () => searchCitiesForCountry(countryCode, query, 80),
    [countryCode, query],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setDraft(null);
        onBlur?.();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [onBlur, open]);

  function selectCity(city: CityOption) {
    onChange(city.name);
    setDraft(null);
    setOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) =>
        options.length === 0 ? 0 : Math.min(current + 1, options.length - 1),
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === "Enter" && open) {
      event.preventDefault();
      const next = options[activeIndex];
      if (next) {
        selectCity(next);
      }
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
      setDraft(null);
    }
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <label htmlFor={inputId} className="text-sm font-medium text-foreground">
        {label} {required ? <span className="text-accent">*</span> : null}
      </label>

      <input
        id={inputId}
        name={inputId}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        autoComplete="address-level2"
        required={required}
        value={query}
        placeholder={placeholder}
        onFocus={() => {
          setOpen(true);
          setActiveIndex(0);
        }}
        onChange={(event) => {
          const next = event.target.value;
          setDraft(next);
          onChange("");
          setOpen(true);
          setActiveIndex(0);
        }}
        onBlur={() => {
          window.setTimeout(() => {
            if (!rootRef.current?.contains(document.activeElement)) {
              setOpen(false);
              setDraft(null);
              onBlur?.();
            }
          }, 120);
        }}
        onKeyDown={handleKeyDown}
        className={cn(controlClassName, error ? "border-red" : null)}
      />

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 z-30 mt-2 max-h-64 overflow-y-auto overscroll-contain border border-border bg-surface py-1 shadow-subtle"
        >
          {options.length === 0 ? (
            <li className="px-4 py-3 text-sm text-muted">
              No cities found for this country.
            </li>
          ) : (
            options.map((city, index) => (
              <li key={city.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={city.name === value}
                  className={cn(
                    "flex w-full px-4 py-2.5 text-left text-sm transition-colors",
                    index === activeIndex
                      ? "bg-background text-accent"
                      : "text-foreground hover:bg-background",
                  )}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectCity(city)}
                >
                  {city.label}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}

      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-sm text-red">
          {error}
        </p>
      ) : null}
    </div>
  );
}
