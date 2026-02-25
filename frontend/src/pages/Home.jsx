import Navbar from "../components/HomePage/navbar";
import Hero from "../components/HomePage/hero";
import HowItWorks from "../components/HomePage/howItWorks";
import IngredientsSection from "../components/HomePage/ingredientsSection";
import CommunityRecipes from "../components/HomePage/communityRecipes";
import Footer from "../components/HomePage/footer";



export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <IngredientsSection />
      <CommunityRecipes />
      <Footer />
    </>
  );
}
