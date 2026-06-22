import bg from "@/assets/images/Hero-Section-BG.png";

const PageHead = ({ title, description }) => {
  return (
    <article
      className="w-full py-8 px-4 min-h-72 flex flex-col items-center justify-center text-center gap-4 relative bg-cover bg-center bg-no-repeat bg-white"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {title && (
        <h3 className="text-3xl lg:text-5xl font-bold text-primary max-w-4xl">
          {title}
        </h3>
      )}

      {description && <p className="lg:text-2xl max-w-4xl">{description}</p>}
      {/* {description && (
        <div
          className="lg:text-2xl max-w-4xl rich_content"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )} */}
    </article>
  );
};

export default PageHead;
