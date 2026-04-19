import type { ReactNode } from "react";

type AdmTableColumn = {
  key: string;
  label: string;
  className?: string;
};

type AdmTableRow = Record<string, ReactNode>;

type AdmTableProps = {
  columns: AdmTableColumn[];
  rows: AdmTableRow[];
};

export function AdmTable({ columns, rows }: AdmTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-separate border-spacing-y-2">
        <thead>
          <tr className="text-left text-xs uppercase tracking-[0.16em] text-slate-400">
            {columns.map((column) => (
              <th key={column.key} className={`px-3 py-2 ${column.className ?? ""}`}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="card text-sm text-slate-100">
              {columns.map((column, colIndex) => (
                <td
                  key={column.key}
                  className={`px-3 py-3 ${colIndex === 0 ? "rounded-l-xl" : ""} ${
                    colIndex === columns.length - 1 ? "rounded-r-xl" : ""
                  } ${column.className ?? ""}`}
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
