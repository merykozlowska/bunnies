import { useParams } from "react-router";

import { Grass, links as grassLinks } from "~/components/grass/grass";
import type { BunnyId } from "~/model/bunnies";
import { bunnyColourForId } from "~/model/bunnies";
import {
  BunnySprite,
  links as bunnySpriteLinks,
} from "~/views/home/components/bunnySprite";

import styles from "./play.styles.css";

export const links = () => [
  ...grassLinks(),
  ...bunnySpriteLinks(),
  { rel: "stylesheet", href: styles },
];

export default function Play() {
  const { bunnyId } = useParams<{ bunnyId: BunnyId }>();

  return (
    <Grass className="play__container" speed={100}>
      <div>
        <BunnySprite
          bunnyColour={bunnyColourForId(bunnyId as BunnyId)}
          bunnySize="lg"
        />
      </div>
      <div></div>
    </Grass>
  );
}
