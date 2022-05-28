import { useParams } from "react-router";

export default function Play() {
  const { bunnyId } = useParams();

  return <>Play with {bunnyId}!</>;
}
