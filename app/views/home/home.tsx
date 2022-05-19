import {
  BunnySprite,
  links as bunnySpriteLinks,
} from "./components/bunnySprite";
import styles from "./home.styles.css";

export const links = () => [
  ...bunnySpriteLinks(),
  { rel: "stylesheet", href: styles },
];

export default function Home() {
  return (
    <main className="home__container">
      <h1 className="home__container__title">Snowball and Fluffy</h1>

      <div className="home__bunnies">
        <BunnySprite />
        <BunnySprite bunnyColour={"brown"} />
      </div>
    </main>
  );
}
