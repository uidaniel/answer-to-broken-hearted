"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";
import { countries, findCountry, type Country } from "@/lib/countries";

/**
 * Searchable country dropdown (ARIA combobox). Typing filters the list; names that
 * start with the typed text come first. The chosen country's name is submitted as `name`.
 */
export default function CountrySelect({ id, name }: { id: string; name: string }) {
  const listId = useId();
  const [all, setAll] = useState<Country[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Names come from the browser's Intl data, so build the list on the client only.
  useEffect(() => setAll(countries()), []);

  const selected = findCountry(query);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || selected) return all;
    const starts = all.filter((c) => c.name.toLowerCase().startsWith(q));
    const contains = all.filter((c) => !c.name.toLowerCase().startsWith(q) && c.name.toLowerCase().includes(q));
    return [...starts, ...contains];
  }, [all, query, selected]);

  // Keep the highlighted option in view while using the arrow keys.
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function choose(country: Country) {
    setQuery(country.name);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      else setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && open && results[active]) {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const activeId = open && results[active] ? `${listId}-${results[active].code}` : undefined;

  return (
    <div className="combo">
      <div className="combo-input">
        {selected && <span className="combo-flag" aria-hidden="true">{selected.flag}</span>}
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={activeId}
          autoComplete="off"
          placeholder="Start typing, e.g. Nigeria"
          value={query}
          className={selected ? "has-flag" : undefined}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onBlur={() => {
            setOpen(false);
            // Tidy up capitalisation if they typed a full country name by hand.
            const match = findCountry(query);
            if (match) setQuery(match.name);
          }}
          onKeyDown={onKeyDown}
          required
        />
        <button
          type="button"
          className="combo-toggle"
          tabIndex={-1}
          aria-label={open ? "Close country list" : "Show all countries"}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setOpen((o) => !o);
            inputRef.current?.focus();
          }}
        >
          <CaretDownIcon size={18} weight="bold" />
        </button>
      </div>

      {open && (
        <ul className="combo-list" id={listId} role="listbox" ref={listRef}>
          {results.length === 0 ? (
            <li className="combo-empty">No country matches &ldquo;{query}&rdquo;</li>
          ) : (
            results.map((c, i) => (
              <li
                key={c.code}
                id={`${listId}-${c.code}`}
                role="option"
                aria-selected={i === active}
                data-index={i}
                className={`${i === active ? "active" : ""}${selected?.code === c.code ? " chosen" : ""}`}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(c)}
              >
                <span aria-hidden="true">{c.flag}</span>
                {c.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
