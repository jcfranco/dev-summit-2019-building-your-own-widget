import Graphic = __esri.Graphic;

export interface Choice {
  name: string;
  feature: Graphic;
}

interface Result {
  choice: Choice;
  done(): IPromise<void>;
}

interface GameData {
  generateChoices(): IPromise<[Choice, Choice]>;
}

type Choices = [Choice, Choice];
