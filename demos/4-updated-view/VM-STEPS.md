# Updated View Steps

## Background

Lets create our game widget by first creating the ViewModel.

## Rename class

```ts
@subclass("esri.demo.GuessWhereViewModel")
class GuessWhereViewModel extends declared(Accessor) {
```

## Add state property

```ts
//----------------------------------
//  state
//----------------------------------

@property({
  readOnly: true
})
get state(): State {
  return !this._active ? "splash" : "playing";
}
```

## Create State type

```ts
type State = "splash" | "playing" | "game-over";
```

## Create private variable `_active`

```ts
private _active: boolean = false;
```

## Compile: View `vm-test.html`

Compile and view the [vm-test.html](vm-test.html) page

## Modify `start()` method to update `_active`

```ts
start(): void {
  this._setNextChoices();
  this._set("points", 0);
  this._active = true;
  this.notifyChange("state");
}
```

## Modify `end` public method to update state

```ts
end() {
  this._active = false;
  this.notifyChange("state");
  this.view.graphics.removeAll();
}
```

## Compile:

Compile and view the `vm` global variable in the console.

Try the following commands in the console.

- `vm.start();`
- `vm.choose(vm.choices[0]);`
- `vm.end();`

## Back to the slides to recap!
