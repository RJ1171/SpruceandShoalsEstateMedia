@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
  --font-display: "Cormorant Garamond";
  --font-sans: "Inter";
  --background: #fbf8f1;
  --foreground: #1f2933;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), Arial, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
textarea,
select {
  font: inherit;
}

.gold-rule {
  background: linear-gradient(90deg, transparent, #c8a45d, transparent);
  height: 1px;
}

.section-frame {
  border-top: 1px solid rgba(23, 63, 53, 0.18);
  border-bottom: 1px solid rgba(23, 63, 53, 0.18);
  background:
    linear-gradient(90deg, rgba(198, 161, 91, 0.12) 0, transparent 22%, transparent 78%, rgba(23, 63, 53, 0.08) 100%),
    #f7f3ea;
}

.corner-frame {
  position: relative;
}

.corner-frame::before,
.corner-frame::after {
  content: "";
  position: absolute;
  pointer-events: none;
  width: 74px;
  height: 74px;
  border-color: #c6a15b;
}

.corner-frame::before {
  left: 14px;
  top: 14px;
  border-left: 1px solid;
  border-top: 1px solid;
}

.corner-frame::after {
  right: 14px;
  bottom: 14px;
  border-right: 1px solid;
  border-bottom: 1px solid;
}

.editorial-rule {
  height: 1px;
  background: linear-gradient(90deg, #c6a15b, rgba(23, 63, 53, 0.24), transparent);
}

.outline-tile {
  border: 1px solid rgba(23, 63, 53, 0.18);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(247, 243, 234, 0.8));
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.72);
}
