import { useSelector } from "react-redux";

const TopHeader = () => {
  const { settings } = useSelector((state) => state.settings);

  return (
    <div>
      <div className="bg-[#A4996C] text-white text-center py-1 px-4 whitespace-nowrap overflow-x-auto">
        {settings?.top_bar_content}
      </div>

      {/* <div
        className="rich_content"
        dangerouslySetInnerHTML={{ __html: settings?.top_bar_content }}
      /> */}
    </div>
  );
};

export default TopHeader;
