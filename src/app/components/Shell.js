import Banner from "./Banner";
import Header from "./Header";
import Footer from "./Footer";

export default function Shell({ children }) {
  return (
    <div className="page">
      <Banner />
      <Header />
      <main className="main">{children}</main>
      <Footer />
    </div>
  );
}
