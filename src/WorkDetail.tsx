import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from './components/Header'
import { supabase } from './supabaseClient'

type Work = {
  id: number
  title: string
  author: string
  genre: string
  description: string
  user_id: string
}

type Episode = {
  id: number
  title: string
  body: string
}

type Comment = {
  id: number
  user_id: string
  username: string
  body: string
  created_at: string
}

const MONTHLY_LIMIT = 10

function WorkDetail() {
  const { id } = useParams()
  const [work, setWork] = useState<Work | null>(null)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [likeCount, setLikeCount] = useState(0)
  const [monthlyUsed, setMonthlyUsed] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentBody, setCommentBody] = useState('')

  const fetchLikeData = async (currentUserId: string | null) => {
    const { count } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('work_id', Number(id))

    setLikeCount(count ?? 0)

    if (currentUserId) {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { count: usedCount } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', currentUserId)
        .gte('created_at', startOfMonth.toISOString())

      setMonthlyUsed(usedCount ?? 0)
    }
  }

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select()
      .eq('work_id', Number(id))
      .order('created_at', { ascending: false })

    if (data) setComments(data)
  }

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const currentUserId = userData.user?.id ?? null
      setUserId(currentUserId)

      const { data: workData, error: workError } = await supabase
        .from('works')
        .select()
        .eq('id', Number(id))
        .single()

      if (workError) {
        console.error(workError)
        return
      }
      setWork(workData)

      const { data: episodeData } = await supabase
        .from('episodes')
        .select()
        .eq('work_id', Number(id))
        .order('id', { ascending: true })

      if (episodeData) setEpisodes(episodeData)

      await fetchLikeData(currentUserId)
      await fetchComments()
    }

    fetchData()
  }, [id])

  const handleLike = async () => {
    if (!userId) {
      alert('いいねするにはログインが必要です')
      return
    }

    if (monthlyUsed >= MONTHLY_LIMIT) {
      alert(`今月のいいねは上限（${MONTHLY_LIMIT}個）に達しました`)
      return
    }

    const { error } = await supabase
      .from('likes')
      .insert({ user_id: userId, work_id: Number(id) })

    if (error) {
      alert('いいねに失敗しました')
      console.error(error)
      return
    }

    setLikeCount(likeCount + 1)
    setMonthlyUsed(monthlyUsed + 1)
  }

  const handleComment = async () => {
    if (!userId) {
      alert('コメントするにはログインが必要です')
      return
    }
    if (commentBody === '') {
      alert('コメントを入力してください')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single()

    const { error } = await supabase
      .from('comments')
      .insert({
        work_id: Number(id),
        user_id: userId,
        username: profile?.username ?? '名無し',
        body: commentBody,
      })

    if (error) {
      alert('コメントに失敗しました')
      console.error(error)
      return
    }

    setCommentBody('')
    await fetchComments()
  }

  const handleDeleteComment = async (commentId: number) => {
    const ok = window.confirm('このコメントを削除しますか？')
    if (!ok) return

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)

    if (error) {
      alert('削除に失敗しました')
      console.error(error)
      return
    }

    await fetchComments()
  }

  if (!work) {
    return (
      <>
        <Header />
        <main className="main">
          <p>読み込み中...</p>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="main">
        <div className="detail">
          <p className="detail-genre">{work.genre}</p>
          <h1 className="detail-title">{work.title}</h1>
          <p className="detail-author">
            作者：
            <Link to={`/user/${work.user_id}`} className="author-link">
              {work.author}
            </Link>
          </p>
          <p className="detail-desc">{work.description}</p>

          <div className="like-section">
            <button className="like-btn" onClick={handleLike}>
              ♥ いいね {likeCount}
            </button>
            {userId && (
              <span className="like-remaining">
                今月あと {MONTHLY_LIMIT - monthlyUsed} 回
              </span>
            )}
          </div>

          <div className="episode-list">
            <h2 className="episode-list-title">エピソード</h2>

            {episodes.map((episode, index) => (
              <Link
                key={episode.id}
                className="episode-item"
                to={`/work/${id}/episode/${episode.id}`}
              >
                <span className="episode-number">第{index + 1}話</span>
                <span className="episode-title">{episode.title}</span>
              </Link>
            ))}
          </div>

          <div className="comment-section">
            <h2 className="episode-list-title">応援コメント</h2>

            {userId ? (
              <div className="comment-form">
                <textarea
                  className="form-input comment-input"
                  placeholder="コメントを入力..."
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                />
                <button className="btn-submit comment-submit" onClick={handleComment}>
                  コメントする
                </button>
              </div>
            ) : (
              <p className="empty-text">コメントするにはログインしてください</p>
            )}

            <div className="comment-list">
              {comments.length === 0 ? (
                <p className="empty-text">まだコメントがありません</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <Link to={`/user/${comment.user_id}`} className="comment-username">
                        {comment.username}
                      </Link>
                      {comment.user_id === userId && (
                        <button
                          className="comment-delete"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          削除
                        </button>
                      )}
                    </div>
                    <p className="comment-body">{comment.body}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default WorkDetail