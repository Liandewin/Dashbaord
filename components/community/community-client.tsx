'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

type Post = {
    id: string
    user_id: string
    content: string
    is_anonymous: boolean
    created_at: string
    like_count: number
    comment_count: number
    liked_by_me: boolean
    author_name: string | null
}

type Comment = {
    id: string
    post_id: string
    user_id: string
    content: string
    is_anonymous: boolean
    created_at: string
    author_name: string | null
}

export default function CommunityClient() {
    const supabase = createSupabaseBrowserClient()
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [userId, setUserId] = useState<string | null>(null)
    const [newContent, setNewContent] = useState('')
    const [newAnonymous, setNewAnonymous] = useState(false)
    const [posting, setPosting] = useState(false)
    const [expandedPost, setExpandedPost] = useState<string | null>(null)
    const [comments, setComments] = useState<Record<string, Comment[]>>({})
    const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})
    const [commentAnonymous, setCommentAnonymous] = useState<Record<string, boolean>>({})
    const [submittingComment, setSubmittingComment] = useState<string | null>(null)
    const [showComposer, setShowComposer] = useState(false)

    useEffect(() => {
        async function init() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) setUserId(user.id)
            await loadPosts(user?.id ?? null)
        }
        init()
    }, [])

    async function loadPosts(uid: string | null) {
        setLoading(true)

        const { data: postsData } = await supabase
            .from('community_posts')
            .select('*')
            .order('created_at', { ascending: false })

        if (!postsData) { setLoading(false); return }

        const postIds = postsData.map(p => p.id)

        const [{ data: likes }, { data: allComments }, { data: profiles }] = await Promise.all([
            supabase.from('community_likes').select('post_id, user_id').in('post_id', postIds),
            supabase.from('community_comments').select('post_id').in('post_id', postIds),
            supabase.from('profiles').select('id, first_name, last_name').in('id', postsData.map(p => p.user_id)),
        ])

        const profileMap: Record<string, string> = {}
        profiles?.forEach(p => { profileMap[p.id] = [p.first_name, p.last_name].filter(Boolean).join(' ') })

        const likeCounts: Record<string, number> = {}
        const likedByMe: Record<string, boolean> = {}
        likes?.forEach(l => {
            likeCounts[l.post_id] = (likeCounts[l.post_id] ?? 0) + 1
            if (l.user_id === uid) likedByMe[l.post_id] = true
        })

        const commentCounts: Record<string, number> = {}
        allComments?.forEach(c => {
            commentCounts[c.post_id] = (commentCounts[c.post_id] ?? 0) + 1
        })

        setPosts(postsData.map(p => ({
            ...p,
            like_count: likeCounts[p.id] ?? 0,
            comment_count: commentCounts[p.id] ?? 0,
            liked_by_me: likedByMe[p.id] ?? false,
            author_name: p.is_anonymous ? null : (profileMap[p.user_id] ?? null),
        })))

        setLoading(false)
    }

    async function handlePost() {
        if (!newContent.trim() || !userId) return
        setPosting(true)

        const { data, error } = await supabase
            .from('community_posts')
            .insert({ user_id: userId, content: newContent.trim(), is_anonymous: newAnonymous })
            .select()
            .single()

        if (!error && data) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('first_name, last_name')
                .eq('id', userId)
                .single()

            setPosts(prev => [{
                ...data,
                like_count: 0,
                comment_count: 0,
                liked_by_me: false,
                author_name: newAnonymous ? null : ([profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || null),
            }, ...prev])
            setNewContent('')
            setNewAnonymous(false)
            setShowComposer(false)
        }
        setPosting(false)
    }

    async function handleLike(post: Post) {
        if (!userId) return

        if (post.liked_by_me) {
            await supabase.from('community_likes').delete().match({ post_id: post.id, user_id: userId })
            setPosts(prev => prev.map(p => p.id === post.id
                ? { ...p, liked_by_me: false, like_count: p.like_count - 1 }
                : p
            ))
        } else {
            await supabase.from('community_likes').insert({ post_id: post.id, user_id: userId })
            setPosts(prev => prev.map(p => p.id === post.id
                ? { ...p, liked_by_me: true, like_count: p.like_count + 1 }
                : p
            ))
        }
    }

    async function handleDeletePost(id: string) {
        await supabase.from('community_posts').delete().eq('id', id)
        setPosts(prev => prev.filter(p => p.id !== id))
        if (expandedPost === id) setExpandedPost(null)
    }

    async function loadComments(postId: string) {
        const { data } = await supabase
            .from('community_comments')
            .select('*')
            .eq('post_id', postId)
            .order('created_at', { ascending: true })

        if (!data) return

        const authorIds = [...new Set(data.map(c => c.user_id))]
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .in('id', authorIds)

        const profileMap: Record<string, string> = {}
        profiles?.forEach(p => { profileMap[p.id] = [p.first_name, p.last_name].filter(Boolean).join(' ') })

        setComments(prev => ({
            ...prev,
            [postId]: data.map(c => ({
                ...c,
                author_name: c.is_anonymous ? null : (profileMap[c.user_id] ?? null),
            })),
        }))
    }

    async function toggleComments(postId: string) {
        if (expandedPost === postId) {
            setExpandedPost(null)
        } else {
            setExpandedPost(postId)
            if (!comments[postId]) await loadComments(postId)
        }
    }

    async function handleAddComment(postId: string) {
        const content = commentInputs[postId]?.trim()
        if (!content || !userId) return
        setSubmittingComment(postId)

        const { data, error } = await supabase
            .from('community_comments')
            .insert({ post_id: postId, user_id: userId, content, is_anonymous: commentAnonymous[postId] ?? false })
            .select()
            .single()

        if (!error && data) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('first_name, last_name')
                .eq('id', userId)
                .single()

            const newComment: Comment = {
                ...data,
                author_name: data.is_anonymous ? null : ([profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || null),
            }
            setComments(prev => ({ ...prev, [postId]: [...(prev[postId] ?? []), newComment] }))
            setCommentInputs(prev => ({ ...prev, [postId]: '' }))
            setPosts(prev => prev.map(p => p.id === postId ? { ...p, comment_count: p.comment_count + 1 } : p))
        }
        setSubmittingComment(null)
    }

    async function handleDeleteComment(postId: string, commentId: string) {
        await supabase.from('community_comments').delete().eq('id', commentId)
        setComments(prev => ({ ...prev, [postId]: prev[postId].filter(c => c.id !== commentId) }))
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, comment_count: p.comment_count - 1 } : p))
    }

    function formatTime(ts: string) {
        const d = new Date(ts)
        const now = new Date()
        const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
        if (diff < 60) return 'just now'
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0f',
            fontFamily: "'DM Sans', sans-serif",
            color: 'white',
        }}>
            <style>{`
                .post-card:hover { background: rgba(255,255,255,0.04) !important; }
                .like-btn:hover { color: #d4af37 !important; border-color: rgba(212,175,55,0.3) !important; }
                .like-btn.liked { color: #d4af37 !important; border-color: rgba(212,175,55,0.3) !important; background: rgba(212,175,55,0.08) !important; }
                .comment-btn:hover { color: rgba(255,255,255,0.7) !important; border-color: rgba(255,255,255,0.15) !important; }
                .delete-btn:hover { color: #ef4444 !important; }
                .send-btn:hover:not(:disabled) { background: rgba(212,175,55,0.25) !important; }
                .toggle-anon:hover { border-color: rgba(212,175,55,0.4) !important; }
            `}</style>

            {/* Header */}
            <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 700, margin: 0, lineHeight: 1.1 }}>
                        Community <span style={{ color: '#d4af37' }}>Feed</span>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 4, fontSize: 13 }}>
                        Share encouragement, reflections, and prayers
                    </p>
                </div>
                <button
                    onClick={() => setShowComposer(v => !v)}
                    style={{
                        background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)',
                        color: '#d4af37', padding: '10px 20px', borderRadius: 10,
                        fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    }}
                >
                    + New Post
                </button>
            </div>

            <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px' }}>

                {/* Composer */}
                {showComposer && (
                    <div style={{
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 16, padding: 24, marginBottom: 32,
                    }}>
                        <textarea
                            autoFocus
                            placeholder="Share something with the community..."
                            value={newContent}
                            onChange={e => setNewContent(e.target.value)}
                            rows={4}
                            style={{
                                width: '100%', background: 'transparent', border: 'none',
                                color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 1.7,
                                outline: 'none', resize: 'none', boxSizing: 'border-box',
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                        />
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 16, paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button
                                className="toggle-anon"
                                onClick={() => setNewAnonymous(v => !v)}
                                style={{
                                    background: newAnonymous ? 'rgba(212,175,55,0.08)' : 'transparent',
                                    border: `1px solid ${newAnonymous ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.1)'}`,
                                    color: newAnonymous ? '#d4af37' : 'rgba(255,255,255,0.4)',
                                    padding: '6px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {newAnonymous ? '🎭 Anonymous' : '👤 Post as me'}
                            </button>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button
                                    onClick={() => { setShowComposer(false); setNewContent(''); setNewAnonymous(false) }}
                                    style={{
                                        padding: '8px 16px', borderRadius: 10, fontSize: 14, cursor: 'pointer',
                                        background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'rgba(255,255,255,0.4)',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="send-btn"
                                    onClick={handlePost}
                                    disabled={posting || !newContent.trim()}
                                    style={{
                                        padding: '8px 18px', borderRadius: 10, fontSize: 14, cursor: 'pointer',
                                        background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)',
                                        color: '#d4af37', fontWeight: 600,
                                        opacity: posting || !newContent.trim() ? 0.5 : 1,
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {posting ? 'Posting...' : 'Post'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Feed */}
                {loading ? (
                    <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', paddingTop: 60, fontSize: 15 }}>Loading...</p>
                ) : posts.length === 0 ? (
                    <div style={{ textAlign: 'center', paddingTop: 80 }}>
                        <p style={{ fontSize: 40, marginBottom: 12 }}>🌿</p>
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>No posts yet. Be the first to share.</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <div
                            key={post.id}
                            className="post-card"
                            style={{
                                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: 16, padding: 24, marginBottom: 16, transition: 'background 0.2s',
                            }}
                        >
                            {/* Post header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: '50%',
                                        background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 14, color: '#d4af37', fontWeight: 600,
                                    }}>
                                        {post.is_anonymous ? '?' : (post.author_name?.[0]?.toUpperCase() ?? '?')}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                                            {post.is_anonymous ? 'Anonymous' : (post.author_name ?? 'Unknown')}
                                        </div>
                                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                                            {formatTime(post.created_at)}
                                        </div>
                                    </div>
                                </div>
                                {post.user_id === userId && (
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeletePost(post.id)}
                                        style={{
                                            background: 'transparent', border: 'none',
                                            color: 'rgba(255,255,255,0.2)', fontSize: 13, cursor: 'pointer',
                                            transition: 'color 0.2s', padding: '4px 8px',
                                        }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>

                            {/* Post content */}
                            <p style={{ fontSize: 15, lineHeight: 1.75, color: 'rgba(255,255,255,0.78)', margin: 0, whiteSpace: 'pre-wrap' }}>
                                {post.content}
                            </p>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                                <button
                                    className={`like-btn ${post.liked_by_me ? 'liked' : ''}`}
                                    onClick={() => handleLike(post)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 6,
                                        background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'rgba(255,255,255,0.4)', padding: '6px 14px',
                                        borderRadius: 8, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
                                    }}
                                >
                                    ♥ {post.like_count > 0 ? post.like_count : ''}
                                </button>
                                <button
                                    className="comment-btn"
                                    onClick={() => toggleComments(post.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 6,
                                        background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'rgba(255,255,255,0.4)', padding: '6px 14px',
                                        borderRadius: 8, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
                                    }}
                                >
                                    💬 {post.comment_count > 0 ? post.comment_count : ''}
                                </button>
                            </div>

                            {/* Comments section */}
                            {expandedPost === post.id && (
                                <div style={{ marginTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20 }}>
                                    {(comments[post.id] ?? []).length === 0 ? (
                                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', marginBottom: 16 }}>No comments yet.</p>
                                    ) : (
                                        (comments[post.id] ?? []).map(c => (
                                            <div key={c.id} style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                                                <div style={{
                                                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600,
                                                }}>
                                                    {c.is_anonymous ? '?' : (c.author_name?.[0]?.toUpperCase() ?? '?')}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                                                        <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>
                                                            {c.is_anonymous ? 'Anonymous' : (c.author_name ?? 'Unknown')}
                                                            <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.25)', marginLeft: 8, fontSize: 12 }}>
                                                                {formatTime(c.created_at)}
                                                            </span>
                                                        </span>
                                                        {c.user_id === userId && (
                                                            <button
                                                                className="delete-btn"
                                                                onClick={() => handleDeleteComment(post.id, c.id)}
                                                                style={{
                                                                    background: 'transparent', border: 'none',
                                                                    color: 'rgba(255,255,255,0.2)', fontSize: 12,
                                                                    cursor: 'pointer', transition: 'color 0.2s',
                                                                }}
                                                            >
                                                                Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.65)', whiteSpace: 'pre-wrap' }}>
                                                        {c.content}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}

                                    {/* Comment input */}
                                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', marginTop: 8 }}>
                                        <div style={{ flex: 1 }}>
                                            <textarea
                                                placeholder="Write a comment..."
                                                value={commentInputs[post.id] ?? ''}
                                                onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                rows={2}
                                                style={{
                                                    width: '100%', background: 'rgba(255,255,255,0.04)',
                                                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10,
                                                    color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.6,
                                                    padding: '10px 14px', outline: 'none', resize: 'none',
                                                    boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif",
                                                }}
                                            />
                                            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <button
                                                    className="toggle-anon"
                                                    onClick={() => setCommentAnonymous(prev => ({ ...prev, [post.id]: !(prev[post.id] ?? false) }))}
                                                    style={{
                                                        background: (commentAnonymous[post.id]) ? 'rgba(212,175,55,0.08)' : 'transparent',
                                                        border: `1px solid ${commentAnonymous[post.id] ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.1)'}`,
                                                        color: commentAnonymous[post.id] ? '#d4af37' : 'rgba(255,255,255,0.35)',
                                                        padding: '5px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                    }}
                                                >
                                                    {commentAnonymous[post.id] ? '🎭 Anonymous' : '👤 As me'}
                                                </button>
                                                <button
                                                    className="send-btn"
                                                    onClick={() => handleAddComment(post.id)}
                                                    disabled={submittingComment === post.id || !(commentInputs[post.id]?.trim())}
                                                    style={{
                                                        background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)',
                                                        color: '#d4af37', padding: '6px 16px', borderRadius: 8,
                                                        fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                                        opacity: submittingComment === post.id || !(commentInputs[post.id]?.trim()) ? 0.5 : 1,
                                                        transition: 'all 0.2s',
                                                    }}
                                                >
                                                    {submittingComment === post.id ? 'Sending...' : 'Send'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
