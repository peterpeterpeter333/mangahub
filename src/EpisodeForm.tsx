import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Header from './components/Header'
import { supabase } from './supabaseClient'

type Work = {
  id: number
  title: string
  user_id: string
}

function EpisodeForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [work, setWork] = useState<Work | null>(null)
  const [episodeTitle, setEpisodeTitle] = useState('')
  const [episodeBody, setEpisodeBody] = useState('')

  useEffect(() => {
    const fetchWork = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        navigate('/auth')
        return
      }

      const { data, error } = await supabase
        .from('works')
        .select()
        .eq('id', Number(id))
        .single()

      if (error) {
        console.error(error)
        return
      }

      if (data.user_id !== userData.user.id) {
        alert('この作品にエピソードを追加する権限がありません')
        navigate(`/work/${id}`)
        return
      }

      setWork(data)
    }
    fetchWork()
  }, [id, navigate])

  if (!work) {
    return (
      <>
        <Header />
        <main className="main">
          <p>作品が見つかりません</p>
        </main>
      </>
    )
  }

  const handleSubmit = async () => {
    if (episodeBody === '') {
      alert('本文を入力してください')
      return
    }

    const { error } = await supabase
      .from('episodes')
      .insert({
        work_id: Number(id),
        title: episodeTitle || '新しいエピソード',
        body: episodeBody,
      })

    if (error) {
      alert('保存に失敗しました')
      console.error(error)
      return
    }

    alert('エピソードを追加しました！')
    navigate(`/work/${id}`)
  }

  return (
    <>
      <Header />
      <main className="main">
        <div className="post-form">
          <Link to={`/work/${id}`} className="episode-back">
            ← {work.title}
          </Link>

          <h1 className="post-title">新しいエピソード</h1>

          <div className="form-group">
            <label className="form-label">エピソードタイトル</label>
            <input
              className="form-input"
              type="text"
              placeholder="エピソードタイトル..."
              value={episodeTitle}
              onChange={(e) => setEpisodeTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">本文</label>
            <textarea
              className="form-input form-textarea form-textarea-large"
              placeholder="本文を入力..."
              value={episodeBody}
              onChange={(e) => setEpisodeBody(e.target.value)}
            />
            <p className="char-count">{episodeBody.length} 文字</p>
          </div>

          <button className="btn-submit" onClick={handleSubmit}>投稿する</button>
        </div>
      </main>
    </>
  )
}

export default EpisodeForm