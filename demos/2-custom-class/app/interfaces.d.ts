import Graphic = __esri.Graphic;

export interface Choice {
  name: string;
  feature: Graphic;
}

export type Choices = [Choice, Choice];
