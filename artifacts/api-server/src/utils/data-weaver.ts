export interface DataPackage {
  raw: number[][];
  formatted: string[][];
  sums: {
    rows: number[];
    cols: number[];
    grandTotal: number;
  };
  ratios: Record<string, string>;
}

export type GrowthTrend =
  | "up"
  | "down"
  | "volatile";

export type DataWeaverFormatOptions = {
  currency?: "INR";
  unit?: string;
  decimals?: number;
};

export type CaseletPackage =
  DataPackage & {
    clues: string[];
    hiddenTable: number[][];
  };

function randomInt(
  min: number,
  max: number,
) {
  return Math.floor(
    Math.random() * (max - min + 1),
  ) + min;
}

function roundTo(
  value: number,
  decimals = 2,
) {
  return Number(value.toFixed(decimals));
}

function gcd(a: number, b: number): number {
  const x = Math.abs(Math.round(a));
  const y = Math.abs(Math.round(b));

  if (y === 0) {
    return x || 1;
  }

  return gcd(y, x % y);
}

function formatNumberWithCommas(
  value: number,
  decimals?: number,
) {
  const fixed =
    decimals === undefined
      ? Number.isInteger(value)
        ? String(value)
        : value.toFixed(2)
      : value.toFixed(decimals);

  const [whole, fraction] =
    fixed.split(".");

  const formattedWhole =
    Number(whole).toLocaleString("en-IN");

  return fraction === undefined
    ? formattedWhole
    : `${formattedWhole}.${fraction}`;
}

function formatMathValue(
  value: number,
  options: DataWeaverFormatOptions = {},
) {
  const decimals =
    options.decimals ??
    (Number.isInteger(value) ? 0 : 2);
  const number = formatNumberWithCommas(
    value,
    decimals,
  );
  const unit = options.unit
    ? ` \\text{ ${options.unit}}`
    : "";

  if (options.currency === "INR") {
    return `₹$${number}$${unit}`;
  }

  return `$${number}${unit}$`;
}

function computeSums(raw: number[][]) {
  const rows = raw.map((row) =>
    row.reduce(
      (sum, value) => sum + value,
      0,
    ),
  );
  const colCount =
    raw[0]?.length ?? 0;
  const cols = Array.from(
    { length: colCount },
    (_unused, colIndex) =>
      raw.reduce(
        (sum, row) =>
          sum + (row[colIndex] ?? 0),
        0,
      ),
  );
  const grandTotal = rows.reduce(
    (sum, value) => sum + value,
    0,
  );

  return {
    rows,
    cols,
    grandTotal,
  };
}

function buildRatios(
  raw: number[][],
  sums: DataPackage["sums"],
) {
  const ratios: Record<string, string> = {};

  raw.forEach((row, rowIndex) => {
    for (
      let colIndex = 0;
      colIndex < row.length - 1;
      colIndex += 1
    ) {
      const a = row[colIndex] ?? 0;
      const b = row[colIndex + 1] ?? 0;
      const divisor = gcd(a, b);
      ratios[
        `r${rowIndex}c${colIndex}:r${rowIndex}c${colIndex + 1}`
      ] = `${a / divisor}:${b / divisor}`;
    }
  });

  sums.rows.forEach((rowSum, rowIndex) => {
    if (sums.grandTotal > 0) {
      ratios[`row${rowIndex}:total`] =
        `${rowSum}:${sums.grandTotal}`;
    }
  });

  sums.cols.forEach((colSum, colIndex) => {
    if (sums.grandTotal > 0) {
      ratios[`col${colIndex}:total`] =
        `${colSum}:${sums.grandTotal}`;
    }
  });

  return ratios;
}

function createPackage(
  raw: number[][],
  formatOptions?: DataWeaverFormatOptions,
): DataPackage {
  const sums = computeSums(raw);

  return {
    raw,
    formatted: raw.map((row) =>
      row.map((value) =>
        formatMathValue(
          value,
          formatOptions,
        ),
      ),
    ),
    sums,
    ratios: buildRatios(raw, sums),
  };
}

export class DataWeaver {
  static formatValue(
    value: number,
    options?: DataWeaverFormatOptions,
  ) {
    return formatMathValue(value, options);
  }

  static weaveTable(
    rows: number,
    cols: number,
    totalConstraint: number,
    formatOptions?: DataWeaverFormatOptions,
  ): DataPackage {
    if (rows <= 0 || cols <= 0) {
      throw new Error(
        "weaveTable requires positive row and column counts.",
      );
    }

    if (totalConstraint <= 0) {
      throw new Error(
        "weaveTable requires a positive total constraint.",
      );
    }

    const raw = Array.from(
      { length: rows },
      () => Array.from({ length: cols }, () => 0),
    );
    let remaining = totalConstraint;
    const cellCount = rows * cols;

    for (
      let index = 0;
      index < cellCount - 1;
      index += 1
    ) {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const cellsLeft =
        cellCount - index;
      const max = Math.max(
        1,
        remaining -
          (cellsLeft - 1),
      );
      const value =
        cellsLeft <= 2
          ? Math.max(
              1,
              Math.floor(max / 2),
            )
          : randomInt(
              1,
              Math.max(
                1,
                Math.floor(
                  max / cellsLeft,
                ) * 2,
              ),
            );
      raw[row]![col] = value;
      remaining -= value;
    }

    raw[rows - 1]![cols - 1] =
      remaining;

    return createPackage(
      raw,
      formatOptions,
    );
  }

  static weavePie(
    slices: number,
    precision: number,
    total: 100 | 360 = 100,
    formatOptions?: DataWeaverFormatOptions,
  ): DataPackage {
    if (slices <= 1) {
      throw new Error(
        "weavePie requires at least two slices.",
      );
    }

    const scale = 10 ** precision;
    const scaledTotal = total * scale;
    const values: number[] = [];
    let remaining = scaledTotal;

    for (
      let index = 0;
      index < slices - 1;
      index += 1
    ) {
      const slicesLeft =
        slices - index;
      const minForRest =
        slicesLeft - 1;
      const max = Math.max(
        1,
        remaining - minForRest,
      );
      const value = randomInt(
        1,
        Math.max(
          1,
          Math.floor(max / slicesLeft) * 2,
        ),
      );
      values.push(value);
      remaining -= value;
    }

    values.push(remaining);

    const raw = [
      values.map((value) =>
        roundTo(value / scale, precision),
      ),
    ];

    return createPackage(raw, {
      ...formatOptions,
      decimals: precision,
      unit:
        formatOptions?.unit ??
        (total === 360 ? "^\\circ" : "%"),
    });
  }

  static weaveGrowthSeries(
    initialValue: number,
    steps: number,
    trend: GrowthTrend,
    formatOptions?: DataWeaverFormatOptions,
  ): DataPackage {
    if (steps <= 0) {
      throw new Error(
        "weaveGrowthSeries requires at least one step.",
      );
    }

    const values = [initialValue];

    for (
      let index = 1;
      index < steps;
      index += 1
    ) {
      const previous =
        values[index - 1]!;
      const percent =
        trend === "up"
          ? randomInt(5, 18)
          : trend === "down"
            ? -randomInt(5, 18)
            : randomInt(-15, 20);
      const next = Math.max(
        0,
        Math.round(
          previous *
            (1 + percent / 100),
        ),
      );
      values.push(next);
    }

    return createPackage(
      [values],
      formatOptions,
    );
  }

  static weaveCaselet(
    rows = 3,
    cols = 3,
    totalConstraint = 900,
    formatOptions?: DataWeaverFormatOptions,
  ): CaseletPackage {
    const dataPackage =
      DataWeaver.weaveTable(
        rows,
        cols,
        totalConstraint,
        formatOptions,
      );
    const [firstRow] =
      dataPackage.raw;
    const a = firstRow?.[0] ?? 0;
    const b = firstRow?.[1] ?? 0;
    const divisor = gcd(a, b);
    const ratio = `${a / divisor}:${b / divisor}`;

    return {
      ...dataPackage,
      hiddenTable: dataPackage.raw,
      clues: [
        `In the first interval, the ratio of $A:B$ is $${ratio}$.`,
        `The first interval total is ${formatMathValue(
          dataPackage.sums.rows[0] ?? 0,
          formatOptions,
        )}.`,
        `The grand total across all intervals is ${formatMathValue(
          dataPackage.sums.grandTotal,
          formatOptions,
        )}.`,
      ],
    };
  }
}
