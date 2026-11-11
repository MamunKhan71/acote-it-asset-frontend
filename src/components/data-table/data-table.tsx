import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { Inbox } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

declare module "@tanstack/react-table" {
    interface ColumnMeta<TData, TValue> {
        className?: string;
        headerClassName?: string;
        _types?: [TData, TValue];
    }
}

type DataTableProps<TData> = {
    columns: ColumnDef<TData, never>[];
    data: TData[];
    getRowId: (row: TData) => string;
    loading?: boolean;
    skeletonRows?: number;
    emptyTitle: string;
    emptyDescription?: string;
    onRowClick?: (row: TData) => void;
    activeRowId?: string;
};

export function DataTable<TData>({
    columns,
    data,
    getRowId,
    loading,
    skeletonRows = 8,
    emptyTitle,
    emptyDescription,
    onRowClick,
    activeRowId,
}: DataTableProps<TData>) {
    const table = useReactTable({
        data,
        columns,
        getRowId,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualFiltering: true,
        manualSorting: true,
    });

    const columnCount = table.getVisibleLeafColumns().length;

    return (
        <div className="overflow-hidden rounded-xl border bg-card">
            <Table>
                <TableHeader className="bg-muted/50">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="hover:bg-transparent">
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className={cn("h-11 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground", header.column.columnDef.meta?.headerClassName)}
                                >
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {loading &&
                        Array.from({ length: skeletonRows }, (_, index) => (
                            <TableRow key={index} className="hover:bg-transparent">
                                {Array.from({ length: columnCount }, (_, cell) => (
                                    <TableCell key={cell} className="px-4 py-3.5">
                                        <Skeleton className="h-4 w-full max-w-48" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}

                    {!loading && data.length === 0 && (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={columnCount} className="py-16">
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Inbox className="size-5" />
                                    </span>
                                    <p className="font-medium">{emptyTitle}</p>
                                    {emptyDescription && <p className="max-w-sm text-sm text-muted-foreground">{emptyDescription}</p>}
                                </div>
                            </TableCell>
                        </TableRow>
                    )}

                    {!loading &&
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.id === activeRowId ? "selected" : undefined}
                                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                                className={cn(onRowClick && "cursor-pointer")}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className={cn("px-4 py-3", cell.column.columnDef.meta?.className)}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
    );
}
