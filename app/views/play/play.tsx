import { useParams } from "react-router";

import { Grass, links as grassLinks } from "~/components/grass/grass";
import type { BunnyId } from "~/model/bunnies";

import {
  links as playLaneLinks,
  PlayLane,
} from "./components/playLane/playLane";
import styles from "./play.styles.css";

export const links = () => [
  ...grassLinks(),
  ...playLaneLinks(),
  { rel: "stylesheet", href: styles },
];

export default function Play() {
  const { bunnyId } = useParams<{ bunnyId: BunnyId }>();

  return (
    <Grass className="play__container" speed={100}>
      <PlayLane bunnyId={bunnyId as BunnyId} className="play__playLane" />
      <PlayLane bunnyId={bunnyId as BunnyId} className="play__playLane" />
    </Grass>
  );
}
