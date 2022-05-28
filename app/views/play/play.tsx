import { useParams } from "react-router";

import { Grass, links as grassLinks } from "~/components/grass/grass";

import styles from "./play.styles.css";

export const links = () => [
  ...grassLinks(),
  { rel: "stylesheet", href: styles },
];

export default function Play() {
  const { bunnyId } = useParams();

  return (
    <Grass className="play__container" speed={100}>
      Play with {bunnyId}!
    </Grass>
  );
}
