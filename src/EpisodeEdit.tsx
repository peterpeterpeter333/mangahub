import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Header from './components/Header'
import { supabase } from './supabaseClient'

function EpisodeEdit() {
  const { id, epId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [episodeTitle, setEpisodeTitle] = useState('')
  const [episodeBody, setEpisodeBody] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        navigate('/auth')
        return
      }

      const { data: workData, error: workError } = await supabase
        .from('works')
        .select()
        .eq('id', Number(id))
        .single()

      if (workError) {
        console.error(workError)
        return
      }

      if (workData.user_id !== userData.user.id) {
        alert('このエピソードを編集する権限がありません')
        navigate(`/work/${id}`)
        return
      }

      const { data: episodeData, error: episodeError } = await supabase
        .from('episodes')
        .select()
        .eq('id', Number(epId))
        .single()

      if (episodeError) {
        console.error(episodeError)
        return
      }

      setEpisodeTitle(episodeData.title)
      setEpisodeBody(episodeData.body)
      setLoading(false)
    }

    fetchData()
  }, [id, epId, navigate])

  const handleUpdate = async () => {
    if (episodeBody === '') {
      alert('本文を入力してください')
      return
    }

    const { error } = await supabase
      .from('episodes')
      .update({ title: episodeTitle, body: episodeBody })
      .eq('id', Number(epId))

    if (error) {
      alert('更新に失敗しました')
      console.error(error)
      return
    }

    alert('更新しました！')
    navigate(`/work/${id}/manage`)
  }

  const handleDelete = async () => {
    const ok = window.confirm('このエピソードを削除しますか？')
    if (!ok) return

    const { error } = await supabase
      .from('episodes')
      .delete()
      .eq('id', Number(epId))

    if (error) {
      alert('削除に失敗しました')
      console.error(error)
      return
    }

    alert('削除しました')
    navigate(`/work/${id}/manage`)
  }

  if (loading) {
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
        <div className="post-form">
          <Link to={`/work/${id}/manage`} className="episode-back">
            ← 作品管理に戻る
          </Link>

          <h1 className="post-title">エピソードを編集</h1>

          <div className="form-group">
            <label className="form-label">エピソードタイトル</label>
            <input
              className="form-input"
              type="text"
              value={episodeTitle}
              onChange={(e) => setEpisodeTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">本文</label>
            <textarea
              className="form-input form-textarea form-textarea-large"
              value={episodeBody}
              onChange={(e) => setEpisodeBody(e.target.value)}
            />
            <p className="char-count">{episodeBody.length} 文字</p>
          </div>

          <button className="btn-submit" onClick={handleUpdate}>更新する</button>

          <button className="btn-delete" onClick={handleDelete}>このエピソードを削除する</button>
        </div>
      </main>
    </>
  )
}

export default EpisodeEdit