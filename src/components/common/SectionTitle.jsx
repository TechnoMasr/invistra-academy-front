const SectionTitle = ({ title, description }) => {
  return (
    <hgroup
      className={`flex flex-col items-center text-center gap-4 mb-6 max-w-4xl mx-auto`}
    >
      {title && (
        <h2 className="text-3xl lg:text-[40px] capitalize font-bold">
          {title}
        </h2>
      )}

      {description && <p className="lg:text-2xl">{description}</p>}
    </hgroup>
  );
};

export default SectionTitle;
