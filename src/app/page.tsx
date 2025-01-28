import { CardsCarousel } from "./(pages)/home/CardCarousel";
import { FaqWithImage } from "./(pages)/home/FaqWithImage";
import Section1 from "./(pages)/home/section1";
import Section2 from "./(pages)/home/section2";
export default function Home() {
  return (
    <div>
      <Section1 />
      <Section2 />
      <CardsCarousel />
      <FaqWithImage />
    </div>
  );
}
