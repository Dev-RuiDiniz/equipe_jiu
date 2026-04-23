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
      <table className="adm-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.className ?? ""}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="text-sm text-slate-100">
              {columns.map((column, colIndex) => (
                <td
                  key={column.key}
                  className={`${colIndex === 0 ? "rounded-l-xl" : ""} ${
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
