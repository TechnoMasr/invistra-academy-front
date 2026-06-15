import { useRef, useState } from "react";
import { IoSearchOutline, IoCloseCircle } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { sendSearch } from "@/api/mainServices";
import { useNavigate } from "react-router";

const SearchInput = () => {
  const navigate = useNavigate();
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

  // التحقق مما إذا كانت هناك أي نتائج على الإطلاق
  const hasResults =
    searchResults &&
    ((searchResults.courses && searchResults.courses.length > 0) ||
      (searchResults.instructors && searchResults.instructors.length > 0) ||
      (searchResults.categories && searchResults.categories.length > 0));

  const handleSelect = (item, type) => {
    setQuery(item.name);
    setIsOpen(false);

    // هنا يمكنك التوجيه بناءً على النوع:
    if (type === "course") navigate(`/courses/${item.slug}`);
    if (type === "instructor") navigate(`/instructors/${item.slug}`);
    if (type === "category") navigate(`/courses?category_id=${item.id}`);
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

  // كامبوننت فرعي لزر النتيجة لعدم تكرار الكود
  const ResultItem = ({ item, type }) => (
    <button
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => handleSelect(item, type)}
      className="flex items-center justify-between w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-right"
    >
      <div className="flex items-center gap-3">
        {type !== "category" && (
          <div className="w-9 h-9 rounded-xl bg-gray-100 shrink-0 overflow-hidden flex items-center justify-center">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        )}

        <div className="flex flex-col global-text-align">
          <span className="text-sm font-medium text-gray-700">
            {highlightMatch(item.name)}
          </span>
          {type === "course" && item.instructor && (
            <span className="text-xs text-gray-400">
              المحاضر: {item.instructor.name}
            </span>
          )}
        </div>
      </div>
    </button>
  );

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
        <div className="absolute top-[calc(100%+8px)] w-full bg-white rounded-2xl shadow-lg z-50 overflow-hidden min-h-[50px] max-h-[400px] overflow-y-auto border border-gray-100">
          {isLoading ? (
            <div className="py-6 flex justify-center text-sm text-gray-500">
              جاري البحث...
            </div>
          ) : hasResults ? (
            <div className="py-2 divide-y divide-gray-100">
              {/* قسم الكورسات */}
              {searchResults.courses && searchResults.courses.length > 0 && (
                <div className="py-1">
                  <div className="px-4 py-1 text-xs font-bold text-gray-400 bg-gray-50/50 select-none text-right">
                    الكورسات
                  </div>
                  {searchResults.courses.map((course) => (
                    <ResultItem
                      key={`course-${course.id}`}
                      item={course}
                      type="course"
                    />
                  ))}
                </div>
              )}

              {/* قسم المحاضرين */}
              {searchResults.instructors &&
                searchResults.instructors.length > 0 && (
                  <div className="py-1">
                    <div className="px-4 py-1 text-xs font-bold text-gray-400 bg-gray-50/50 select-none text-right">
                      المحاضرين
                    </div>
                    {searchResults.instructors.map((instructor) => (
                      <ResultItem
                        key={`instructor-${instructor.id}`}
                        item={instructor}
                        type="instructor"
                      />
                    ))}
                  </div>
                )}

              {/* قسم الأقسام / التصنيفات */}
              {searchResults.categories &&
                searchResults.categories.length > 0 && (
                  <div className="py-1">
                    <div className="px-4 py-1 text-xs font-bold text-gray-400 bg-gray-50/50 select-none text-right">
                      الأقسام
                    </div>
                    {searchResults.categories.map((category) => (
                      <ResultItem
                        key={`category-${category.id}`}
                        item={category}
                        type="category"
                      />
                    ))}
                  </div>
                )}
            </div>
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
