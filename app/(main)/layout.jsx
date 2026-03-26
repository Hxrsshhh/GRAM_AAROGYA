import NavbarWrapper from "@/components/layouts/NavbarWrapper";

export default function MainLayout({ children }) {
  return (
    <>
      <NavbarWrapper />
      <main>
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>
        {children}</main>
    </>
  );
}
