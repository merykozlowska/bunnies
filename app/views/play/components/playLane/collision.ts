import type { PlayLaneItem } from "~/views/play/components/playLane/playLaneItem";

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export const isColliding = (
  bunnyBoundingRect: Rect,
  item: PlayLaneItem,
  laneBoundingRect: Rect
) => {
  const itemRect = itemToRect(item, laneBoundingRect);

  return (
    itemRect.left < bunnyBoundingRect.left + bunnyBoundingRect.width &&
    itemRect.left + itemRect.width > bunnyBoundingRect.left &&
    itemRect.top < bunnyBoundingRect.top + bunnyBoundingRect.height &&
    itemRect.height + itemRect.top > bunnyBoundingRect.top
  );
};

const itemToRect = (item: PlayLaneItem, laneBoundingRect: Rect): Rect => {
  const itemXCenter =
    (laneBoundingRect.width / 4) * (item.lane === 0 ? 1 : 3) +
    laneBoundingRect.left;
  const itemYTop = item.top;
  const itemWidth = 48;
  const itemHeight = 48;

  return {
    left: itemXCenter - itemWidth / 2,
    top: itemYTop,
    width: itemWidth,
    height: itemHeight,
  };
};
