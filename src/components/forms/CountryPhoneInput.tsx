"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import {
  getDefaultPhoneCountry,
  getPhoneCountries,
  getPhoneCountryOption,
  type PhoneCountryOption,
} from "@/lib/phone";
import { cn } from "@/lib/utils";
import type { CountryCode } from "libphonenumber-js";

type CountryPhoneInputProps = {
  id?: string;
  label: string;
  required?: boolean;
  optionalHint?: boolean;
  countryCode: string;
  value: string;
  error?: string;
  placeholder?: string;
  onCountryChange: (countryCode: CountryCode) => void;
  onChange: (value: string) => void;
  onBlur?: () => void;
  className?: string;
};

const controlClassName =
  "min-h-12 rounded-sm border border-border bg-background px-3 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted/70 focus:border-accent focus:ring-1 focus:ring-accent";

export function CountryPhoneInput({
  id,
  label,
  required = false,
  optionalHint = false,
  countryCode,
  value,
  error,
  placeholder = "24 123 4567",
  onCountryChange,
  onChange,
  onBlur,
  className,
}: CountryPhoneInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const listboxId = `${inputId}-countries`;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const countries = useMemo(() => getPhoneCountries(), []);
  const selected =
    getPhoneCountryOption(countryCode as CountryCode) ??
    getPhoneCountryOption(getDefaultPhoneCountry())!;

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return countries;
    }

    return countries.filter((country) => {
      const haystack = `${country.name} ${country.iso2} ${country.dialCode}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [countries, query]);

  useEffect(() => {
    if (!open) {
      return;
    }

    window.setTimeout(() => searchRef.current?.focus(), 0);

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  function openPicker() {
    setActiveIndex(0);
    setOpen(true);
  }

  function selectCountry(country: PhoneCountryOption) {
    onCountryChange(country.iso2);
    setOpen(false);
    setQuery("");
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPicker();
    }
  }

  function handleListKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      setQuery("");
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) =>
        filtered.length === 0 ? 0 : Math.min(current + 1, filtered.length - 1),
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const next = filtered[activeIndex];
      if (next) {
        selectCountry(next);
      }
    }
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <label htmlFor={inputId} className="text-sm font-medium text-foreground">
        {label}{" "}
        {required ? <span className="text-accent">*</span> : null}
        {optionalHint ? (
          <span className="text-muted">(optional)</span>
        ) : null}
      </label>

      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <div className="relative sm:w-[min(100%,16.5rem)] sm:shrink-0">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
            onClick={() => {
              if (open) {
                setOpen(false);
                setQuery("");
              } else {
                openPicker();
              }
            }}
            onKeyDown={handleTriggerKeyDown}
            className={cn(
              controlClassName,
              "flex w-full items-center justify-between gap-2 text-left",
              error ? "border-red" : null,
            )}
          >
            <span className="truncate">
              {selected.flag} {selected.name} ({selected.dialCode})
            </span>
            <span aria-hidden className="text-muted">
              ▼
            </span>
          </button>

          {open ? (
            <div
              id={listboxId}
              role="listbox"
              tabIndex={-1}
              onKeyDown={handleListKeyDown}
              className="absolute left-0 right-0 z-30 mt-2 max-h-72 overflow-hidden border border-border bg-surface shadow-subtle sm:min-w-[18rem]"
            >
              <div className="border-b border-border p-2">
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActiveIndex(0);
                  }}
                  placeholder="Search country"
                  className="w-full min-h-11 rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
                  aria-label="Search country"
                />
              </div>
              <ul className="max-h-56 overflow-y-auto overscroll-contain py-1">
                {filtered.length === 0 ? (
                  <li className="px-3 py-3 text-sm text-muted">No countries found.</li>
                ) : (
                  filtered.map((country, index) => (
                    <li key={country.iso2}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={country.iso2 === selected.iso2}
                        className={cn(
                          "flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition-colors",
                          index === activeIndex
                            ? "bg-background text-accent"
                            : "text-foreground hover:bg-background",
                        )}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => selectCountry(country)}
                      >
                        <span className="truncate">
                          {country.flag} {country.name}
                        </span>
                        <span className="shrink-0 text-muted">{country.dialCode}</span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          ) : null}
        </div>

        <input
          id={inputId}
          name={inputId}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={cn(controlClassName, "w-full", error ? "border-red" : null)}
        />
      </div>

      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-sm text-red">
          {error}
        </p>
      ) : null}
    </div>
  );
}
