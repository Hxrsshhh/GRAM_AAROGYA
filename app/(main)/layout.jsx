import NavbarWrapper from "@/components/layouts/NavbarWrapper";

export default function MainLayout({ children }) {
  return (
    <>
      <NavbarWrapper />
      <main>{children}</main>
    </>
  );
}