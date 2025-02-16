# <div align="center">Interactive Line Parametrisation</div>

This [interactive visualization](https://kevinconka.github.io/line-parametrization/) demonstrates different ways to parametrize lines in 2D space.

> [!NOTE]
> Most of the code is product of a conversation with [Claude](https://claude.ai).

## Motivation

Instead of defining a line by its two endpoints `(x_1, y_1)` and `(x_2, y_2), we can describe it using just two parameters:

- A **midpoint**, which is the point where the line crosses the **vertical center line** (y-axis). This point is mapped along an extended vertical range, meaning it can be **inside or outside the image**.
- An **angle θ** (theta) between **-90° and +90°**, which determines the line’s slope relative to the horizontal.

<p align="center">
  <img src="https://github.com/user-attachments/assets/686392be-8fe9-4e95-b054-6aedc26edf64" alt="line-parametrization">
</p>

This alternative parametrization is particularly useful for machine learning applications, as the normalized parameters provide a consistent input range for neural networks. The visualization allows you to explore how these parameters affect the line's position and orientation in real-time.

## Usage

```bash
npm install
npm run dev
```

## Static Build

```bash
npm run build
```

## Acknowledgments

Special thanks to [Claude-React-Jumpstart](https://github.com/Bklieger/Claude-React-Jumpstart) for providing guidance on setting up a React project with Claude-generated code.





