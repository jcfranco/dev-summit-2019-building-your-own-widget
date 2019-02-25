import Graphic = __esri.Graphic;

export interface Choice {
  name: string;
  feature: Graphic;
}

export interface Result {
  choice: Choice;
  done(): IPromise<void>;
}

export interface ChoiceEngine {
  randomize(): IPromise<void>;
  next(): IPromise<Choices>
}

export type Choices = [Choice, Choice];
