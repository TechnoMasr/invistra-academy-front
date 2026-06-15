import { useSelector } from "react-redux";

const AuthContainer = ({ children, title, description, showTitle = true }) => {
  const { settings } = useSelector((state) => state.settings);

  return (
    <main className="grid grid-cols-1 md:grid-cols-2">
      <section className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {showTitle && (
            <hgroup className="text-center space-y-2 mb-4">
              <h3 className="text-2xl font-bold text-primary">{title}</h3>
              <p className="text-xs text-muted-foreground">{description}</p>
            </hgroup>
          )}

          <div className="flex flex-col gap-4">{children}</div>
        </div>
      </section>

      <article
        style={{
          backgroundImage: `url(${settings?.login_image || ""})`,
        }}
        className="hidden md:flex sticky top-14 h-[calc(100vh-56px)] bg-cover bg-center bg-primary"
      >
        {/* <div className="absolute inset-0 bg-black/40" /> */}
      </article>
    </main>
  );
};

export default AuthContainer;
