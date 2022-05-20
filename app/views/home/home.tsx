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
      <div className="home__bunnies">
        <div className="home__bunnies__bunny">
          <BunnySprite />
          <h2 className="home__bunnies__name">Snowball</h2>
        </div>
        <h2 className="home__bunnies__vs">vs</h2>
        <div className="home__bunnies__bunny">
          <BunnySprite bunnyColour={"brown"} />
          <h2 className="home__bunnies__name">Fluffy</h2>
        </div>
      </div>
    </main>
  );
}
