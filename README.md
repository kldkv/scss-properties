# scss-properties

```scss
$brand: hsl(200, 56%, 33%);

:root {
  @include define\hsl((
    --brand: $brand
  ));
}
```
compile to
```css
:root {
  --brand: hsl(var(--brand-h), var(--brand-s), var(--brand-l));
  --brand-h: 200deg;
  --brand-s: 56%;
  --brand-l: 33%;
}
```

You can use nested define var

```scss
$brand: hsl(200, 56%, 33%);
$brand-green: green;

:root {
  @include define\hsl((
    --brand: (
      color: $brand,
      --green: $brand-green
    ),
  ));
}
```
compile to
```css
:root {
  --brand: hsl(var(--brand-h), var(--brand-s), var(--brand-l));
  --brand-h: 200deg;
  --brand-s: 56%;
  --brand-l: 33%;
  
  --brand--green: hsl(var(--brand--green-h), var(--brand--green-s), var(--brand--green-l));
  --brand--green-h: 120deg;
  --brand--green-s: 100%;
  --brand--green-l: 25.09804%;
}
```

You can use some function
```scss
$brand: hsl(200, 56%, 33%);

:root {
  @include define\hsl((
    --brand: $brand,
  ));

  --brand-dark: #{color\adjust(--brand, $brand, $saturation: -20)};
  --brand-funny: #{color\adjust(--brand, $brand, $hue: 50, $saturation: 16, $lightness: 4, $alpha: -10%)};

  --brand-new: #{color\change(--brand, $brand, $hue: 50)};
  --brand-new-08: #{color\change(--brand, $brand, $hue: 50, $alpha: 0.8)};
}
```
compile to
```css
:root {
  // define\hsl
  --brand: hsl(var(--brand-h), var(--brand-s), var(--brand-l));
  --brand-h: 200deg;
  --brand-s: 56%;
  --brand-l: 33%;

  // color\adust
  --brand-dark: hsl(var(--brand-h), calc(var(--brand-s) + -20%), var(--brand-l));
  --brand-funny: hsla(calc(var(--brand-h) + 50deg), calc(var(--brand-s) + 16%), calc(var(--brand-l) + 4%), calc(var(--brand-a) * 0.9));

  // color\change
  --brand-new: hsl(50deg, var(--brand-s), var(--brand-l));
  --brand-new-08: hsla(50deg, var(--brand-s), var(--brand-l), 0.8);
}
```

And mix its
```scss
$brand: hsl(200, 56%, 33%);

:root {
  @include define\hsl((
    --brand: (
      color: $brand,
      --dark: #{color\adjust(--brand, $brand, $saturation: -20)}
    ),
  ));
}
```
compile to
```css
:root {
  --brand: hsl(var(--brand-h), var(--brand-s), var(--brand-l));
  --brand-h: 200deg;
  --brand-s: 56%;
  --brand-l: 33%;
  --brand--dark: hsl(var(--brand-h), calc(var(--brand-s) + -20%), var(--brand-l));
}
```
