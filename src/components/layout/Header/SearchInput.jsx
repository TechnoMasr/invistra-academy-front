import { useRef, useState } from "react";
import { IoSearchOutline, IoCloseCircle } from "react-icons/io5";

const SearchInput = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const list = [
    {
      id: 1,
      title: "المحاضرين",
      image:
        "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?w=80&q=80",
    },
    {
      id: 2,
      title: "الكورسات",
      image:
        "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=80&q=80",
    },
  ];

  const filtered = list.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSelect = (item) => {
    setQuery(item.title);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
  };

  // Close on outside click
  const handleBlur = (e) => {
    if (!wrapperRef.current?.contains(e.relatedTarget)) {
      setIsOpen(false);
    }
  };

  const highlightMatch = (text) => {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    return (
      <>
        {text.slice(0, index)}
        <span className="text-primary font-bold">
          {text.slice(index, index + query.length)}
        </span>
        {text.slice(index + query.length)}
      </>
    );
  };

  return (
    <div ref={wrapperRef} className="relative w-full" onBlur={handleBlur}>
      {/* Input */}
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => query && setIsOpen(true)}
        placeholder="ابحث فى المنصة"
        className="bg-secondary py-2 px-8 pe-8 rounded-full outline-0 border-none w-full"
      />

      {/* Search icon */}
      <IoSearchOutline className="absolute top-1/2 inset-s-2 -translate-y-1/2 text-xl pointer-events-none" />

      {/* Clear button */}
      {query && (
        <button
          onMouseDown={(e) => e.preventDefault()} // prevent blur before click
          onClick={handleClear}
          className="absolute top-1/2 inset-e-2 -translate-y-1/2"
        >
          <IoCloseCircle className="text-xl hover:text-primary transition-colors" />
        </button>
      )}

      {/* Dropdown */}
      {isOpen && query.trim() && (
        <div className="absolute top-[calc(100%+8px)] w-full bg-secondary rounded-2xl shadow-lg z-50 overflow-hidden">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <button
                key={item.id}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(item)}
                className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-gray-50 transition-colors border-b last:border-b-0 border-gray-100"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-10 h-10 rounded-xl object-cover shrink-0"
                />
                <span className="text-sm font-medium">
                  {highlightMatch(item.title)}
                </span>
              </button>
            ))
          ) : (
            // No results state
            <div className="py-6 flex flex-col items-center gap-2 text-sm">
              {/* <span className="text-2xl">🔍</span> */}
              <span>
                لا توجد نتائج لـ{" "}
                <span className="font-semibold">"{query}"</span>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
