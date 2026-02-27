const ActiveFooter = () => {
  return (
    <footer className="border-t border-border py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:gap-6">
        <div className="flex items-center">
          <img
            src="/LogoJPEG/logo-transparent.png"
            alt="Projeto Active"
            className="h-10 sm:h-14 object-contain"
          />
        </div>
        <p className="text-muted-foreground text-xs sm:text-sm text-center">
          © {new Date().getFullYear()} Projeto Active. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default ActiveFooter;
