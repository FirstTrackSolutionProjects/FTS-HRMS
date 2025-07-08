import React, { useState, useRef, useEffect } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClearFieldIcon from "@/icons/ClearFieldIcon";

export default function CustomAutocomplete({
  name = "", // 🔸 new prop
  options = [],
  renderOption,
  renderSelected,
  onChange,
  onSearchChange = () => {}, // 🔸 callback to expose search text
  value = null,
  className = "",
  disabled = false,
  readOnly = false,
  label = "Label",
  clearable = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState(value);
  const wrapperRef = useRef();

  useEffect(() => {
    setSelected(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(()=>{
    if (!isOpen){
      setSearchTerm("");
      onSearchChange("", name)
    }
  },[isOpen])

  const filteredOptions = options.filter((opt) =>
    (opt?.title || opt?.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleSelect = (opt, name) => {
    if (disabled || readOnly) return;
    setSelected(opt);
    const event = {
        target: {
          name: name,
          value: opt?.id || opt,
        }
      }
    onChange?.(event)
    setSearchTerm("");
    onSearchChange("", name); // 🔸 clear search externally
    setIsOpen(false);
  };

  const handleClear = (name) => {
    setSelected(null);
    const event = {
        target: {
          name: name,
          value: "",
        }
      }
    onChange?.(event);
    setSearchTerm("");
    onSearchChange("", name); // 🔸 clear search externally
  };

  const defaultRenderOption = (opt) => (
    <div className="text-black">{opt?.title || opt?.name}</div>
  );

  const defaultRenderSelected = (opt) => (
    <span className="truncate text-black">{opt?.title || opt?.name}</span>
  );

  return (
    <div
      ref={wrapperRef}
      className={`relative rounded-md ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`}
    >
      {/* Hidden Input to Trigger Focus */}
      <input
        type="text"
        tabIndex={0}
        onFocus={() => setIsOpen(true)}
        className="absolute w-0 h-0 opacity-0 pointer-events-none"
      />

      {/* Floating Label */}
      <label
        className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
          selected
            ? `text-xs -top-2 bg-white ${isOpen ? "text-blue-500" : "text-black"} px-1`
            : "top-2 text-base text-gray-600"
        }`}
      >
        {label}
      </label>

      {/* Select Box */}
      <div
        className={`min-h-10 px-3 bg-white flex items-center justify-between rounded-md cursor-pointer border-[1px] ${
          isOpen ? "border-blue-500" : "border-gray-400"
        }`}
        onClick={() => {
          if (!readOnly && !disabled) setIsOpen((prev) => !prev);
        }}
      >
        <div className="flex-1 truncate">
          {selected
            ? renderSelected?.(selected) || defaultRenderSelected(selected)
            : null}
        </div>

        {/* Clear Button */}
        {clearable && selected && !readOnly && !disabled && (
          <button
            onClick={()=>handleClear(name)}
            className="ml-2 text-black hover:text-red-500"
            type="button"
            aria-label="Clear"
          >
            <ClearFieldIcon />
          </button>
        )}

        {/* Dropdown Icon */}
        <span
          className={`ml-2 transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <ArrowDropDownIcon className="text-gray-600" />
        </span>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 bottom-0 w-full bg-white rounded-md mt-1 shadow-lg overflow-hidden">
          {/* Search Input */}
          <div className="bg-white border-[1px] border-gray-500 rounded-t-md px-3 py-2 font-semibold">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => {
                const text = e.target.value;
                setSearchTerm(text);
                onSearchChange(text, name); // 🔸 update parent
              }}
              className="w-full bg-transparent outline-none text-black"
            />
          </div>

          {/* Options */}
          <div
            className="max-h-60 overflow-y-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#aaa transparent",
            }}
          >
            {options.length > 0 ? (
              options.map((opt, i) => (
                <div
                  key={opt.id || i}
                  className="px-4 py-3 border-b border-black cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelect(opt, name)}
                >
                  {renderOption?.(opt) || defaultRenderOption(opt)}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
