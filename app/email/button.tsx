import * as React from 'react'

const GOLD = '#d4af37'

// VML has no rgba support, so the translucent gold fill and border are
// pre-blended against the #0a0a0f page background for the Outlook branch.
const MSO_FILL = '#282315'   // rgba(212,175,55,0.15) over #0a0a0f
const MSO_STROKE = '#473c1b' // rgba(212,175,55,0.30) over #0a0a0f

const RADIUS = 10

function escapeHtml(value: string) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

/**
 * Call-to-action button that survives Outlook.
 *
 * Outlook on Windows renders through Word, which ignores padding on inline
 * elements and drops border-radius — so a styled <a> collapses to bare
 * underlined text with no button shape at all. The fix is the standard
 * "bulletproof button": VML draws a real rounded rectangle for Outlook, and
 * every other client gets the plain anchor via a downlevel-revealed comment.
 *
 * The whole thing goes through dangerouslySetInnerHTML because JSX cannot emit
 * conditional comments — `{/* ... *\/}` is stripped at compile time.
 *
 * `width` is the fixed pixel width VML needs; size it to the label.
 */
export function EmailButton({
    href,
    label,
    width = 224,
    height = 44,
}: {
    href: string
    label: string
    width?: number
    height?: number
}) {
    const safeHref = escapeHtml(href)
    const safeLabel = escapeHtml(label)
    const arcsize = `${Math.round((RADIUS / height) * 100)}%`

    const html = [
        '<!--[if mso]>',
        `<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${safeHref}" style="height:${height}px;v-text-anchor:middle;width:${width}px;" arcsize="${arcsize}" strokecolor="${MSO_STROKE}" fillcolor="${MSO_FILL}">`,
        '<w:anchorlock/>',
        `<center style="color:${GOLD};font-family:Georgia,serif;font-size:14px;font-weight:600;">${safeLabel}</center>`,
        '</v:roundrect>',
        '<![endif]-->',
        '<!--[if !mso]><!-->',
        `<a href="${safeHref}" style="background:rgba(212,175,55,0.15);border:1px solid rgba(212,175,55,0.3);color:${GOLD};padding:12px 24px;border-radius:${RADIUS}px;text-decoration:none;font-weight:600;font-size:14px;font-family:Georgia,serif;display:inline-block;">${safeLabel}</a>`,
        '<!--<![endif]-->',
    ].join('')

    return <div dangerouslySetInnerHTML={{ __html: html }} />
}
