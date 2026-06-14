import { useRef, useState } from "react";
import { IoSearchOutline, IoCloseCircle } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { sendSearch } from "@/api/mainServices";

const SearchInput = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const debouncedQuery = useDebounce(query, 500);

  // جلب البيانات من الـ API
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => sendSearch(debouncedQuery),
    enabled: !!debouncedQuery.trim(),
  });

  // معالجة البيانات القادمة وتجميعها في مصفوفة واحدة مع تحديد نوع كل عنصر
  const getCombinedResults = () => {
    if (!searchResults) return [];

    const categories = (searchResults.categories || []).map((item) => ({
      ...item,
      type: "category",
      displayType: "قسم",
    }));

    const instructors = (searchResults.instructors || []).map((item) => ({
      ...item,
      type: "instructor",
      displayType: "محاضر",
    }));

    const courses = (searchResults.courses || []).map((item) => ({
      ...item,
      type: "course",
      displayType: "كورس",
    }));

    // دمجهم كلهم في قائمة واحدة ليتم رندرتهم معاً
    return [...courses, ...instructors, ...categories];
  };

  const filteredResults = getCombinedResults();

  const handleSelect = (item) => {
    setQuery(item.name); // الـ API بترجع الحقل باسم name وليس title
    setIsOpen(false);

    // هنا تقدر تعمل توجيه (Navigate) بناءً على النوع لو حابب، مثلاً:
    // if (item.type === 'course') navigate(`/courses/${item.slug}`)
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
  };

  const handleBlur = (e) => {
    if (!wrapperRef.current?.contains(e.relatedTarget)) {
      setIsOpen(false);
    }
  };

  const highlightMatch = (text) => {
    if (!text) return "";
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
        className="bg-white py-2 px-8 pe-8 rounded-full outline-0 border w-full"
      />

      {/* Search icon */}
      <IoSearchOutline className="absolute top-1/2 inset-s-2 -translate-y-1/2 text-xl pointer-events-none" />

      {/* Clear button */}
      {query && (
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleClear}
          className="absolute top-1/2 inset-e-2 -translate-y-1/2"
        >
          <IoCloseCircle className="text-xl hover:text-primary transition-colors" />
        </button>
      )}

      {/* Dropdown */}
      {isOpen && query.trim() && (
        <div className="absolute top-[calc(100%+8px)] w-full bg-secondary rounded-2xl shadow-lg z-50 overflow-hidden min-h-[50px] max-h-[350px] overflow-y-auto">
          {isLoading ? (
            <div className="py-6 flex justify-center text-sm text-gray-500">
              جاري البحث...
            </div>
          ) : filteredResults.length > 0 ? (
            filteredResults.map((item, index) => (
              <button
                key={`${item.type}-${item.id}-${index}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(item)}
                className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 transition-colors border-b last:border-b-0 border-gray-100 text-right"
              >
                <div className="flex items-center gap-3">
                  {/* عرض الصورة إذا كانت موجودة، وإلا عرض ديف بديل */}
                  {item.type !== "category" && (
                    <div className="w-10 h-10 rounded-xl bg-gray-200 shrink-0 overflow-hidden flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">📷</span>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col global-text-align">
                    <span className="text-sm font-medium">
                      {highlightMatch(item.name)}
                    </span>
                    {/* لو كورس، يعرض اسم المحاضر تحته بشكل فرعي */}
                    {item.type === "course" && item.instructor && (
                      <span className="text-xs text-gray-400">
                        المحاضر: {item.instructor.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* شارة جانبية (Badge) توضح هل النتيجة كورس أو محاضر أو قسم */}
                <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full shrink-0">
                  {item.displayType}
                </span>
              </button>
            ))
          ) : (
            <div className="py-6 flex flex-col items-center gap-2 text-sm text-gray-500">
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
