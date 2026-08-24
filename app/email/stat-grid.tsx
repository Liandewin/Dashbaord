import * as React from 'react'

/**
 * Email-safe replacement for `display: grid`.
 *
 * Gmail strips `display: grid`/`flex` and Outlook's Word rendering engine never
 * supported them, so a grid of stat cards collapses into one full-width stacked
 * column in most inboxes. Tables are the only layout primitive that renders
 * consistently across clients. `gap` is unsupported for the same reason, so the
 * gutter is produced with per-cell padding instead.
 *
 * Each child is placed in its own cell and wrapped to a new row every
 * `columns` cards.
 */
export function StatGrid({
    columns,
    gutter = 16,
    children,
    style,
}: {
    columns: number
    gutter?: number
    children: React.ReactNode
    style?: React.CSSProperties
}) {
    const cards = React.Children.toArray(children)

    const rows: React.ReactNode[][] = []
    for (let i = 0; i < cards.length; i += columns) {
        rows.push(cards.slice(i, i + columns))
    }

    // Unary + trims trailing zeros: 50% rather than 50.0000%, 33.3333% for thirds.
    const cellWidth = `${+(100 / columns).toFixed(4)}%`

    return (
        <table
            role="presentation"
            cellPadding={0}
            cellSpacing={0}
            border={0}
            width="100%"
            style={{ width: '100%', borderCollapse: 'collapse', ...style }}
        >
            <tbody>
                {rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((card, colIndex) => (
                            <td
                                key={colIndex}
                                valign="top"
                                width={cellWidth}
                                style={{
                                    width: cellWidth,
                                    verticalAlign: 'top',
                                    paddingLeft: colIndex === 0 ? 0 : gutter / 2,
                                    paddingRight: colIndex === columns - 1 ? 0 : gutter / 2,
                                    paddingBottom: rowIndex === rows.length - 1 ? 0 : gutter,
                                }}
                            >
                                {card}
                            </td>
                        ))}

                        {/* Keep the final row's columns aligned with the rows above it. */}
                        {Array.from({ length: columns - row.length }).map((_, i) => (
                            <td key={`filler-${i}`} width={cellWidth} style={{ width: cellWidth }} />
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

/**
 * Email-safe replacement for `display: flex; justify-content: space-between`.
 * A two-cell table with the right-hand cell right-aligned.
 */
export function SplitRow({
    left,
    right,
    style,
}: {
    left: React.ReactNode
    right: React.ReactNode
    style?: React.CSSProperties
}) {
    return (
        <table
            role="presentation"
            cellPadding={0}
            cellSpacing={0}
            border={0}
            width="100%"
            style={{ width: '100%', borderCollapse: 'collapse', ...style }}
        >
            <tbody>
                <tr>
                    <td valign="middle" style={{ verticalAlign: 'middle', textAlign: 'left' }}>
                        {left}
                    </td>
                    <td valign="middle" style={{ verticalAlign: 'middle', textAlign: 'right' }}>
                        {right}
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
