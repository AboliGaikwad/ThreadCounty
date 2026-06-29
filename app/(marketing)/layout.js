import Navbar from "@/components/Navbar";

// The layout acts as a frame around your pages.
// It receives the current viewable page via the 'children' prop.
export default function MarketingLayout({ children }) {
  return (
    <>
      {/* The Navbar stays fixed at the top of all public marketing pages */}
      <Navbar /> 
      
      {/* Next.js injects your page.js content directly inside this main container */}
      <main>
        {children} 
      </main>
    </>
  );
}