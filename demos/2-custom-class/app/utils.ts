import { clone } from "esri/core/lang";

export function pickChoices<T>(items: T[]): [T, T] {
  const cloned = clone(items) as T[];

  const a = randomPick(cloned);

  const aIndex = items.indexOf(a);

  const b = randomPick(cloned.splice(aIndex, 1));

  return [a, b];
}

function randomPick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * (items.length - 1))];
}
