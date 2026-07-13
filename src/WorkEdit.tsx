import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Header from './components/Header'
import { supabase } from './supabaseClient'

function WorkEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [genre, setGenre] = useState('')
  const [desc, setDesc] = useState('')

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

      // 作者本人でなければ追い返す
      if (data.user_id !== userData.user.id) {
        alert('この作品を編集する権限がありません')
        navigate(`/work/${id}`)
        return
      }

      setTitle(data.title)
      setAuthor(data.author)
      setGenre(data.genre)
      setDesc(data.description)
      setLoading(false)
    }

    fetchWork()
  }, [id, navigate])

  const handleUpdate = async () => {
    if (title === '' || author === '') {
      alert('タイトルと作者名は必須です')
      return
    }

    const { error } = await supabase
      .from('works')
      .update({ title, author, genre, description: desc })
      .eq('id', Number(id))

    if (error) {
      alert('更新に失敗しました')
      console.error(error)
      return
    }

    alert('更新しました！')
    navigate(`/work/${id}`)
  }

  const handleDelete = async () => {
    const ok = window.confirm('この作品を削除しますか？エピソードもすべて削除されます。')
    if (!ok) return

    const { error } = await supabase
      .from('works')
      .delete()
      .eq('id', Number(id))

    if (error) {
      alert('削除に失敗しました')
      console.error(error)
      return
    }

    alert('削除しました')
    navigate('/dashboard')
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
          <Link to={`/work/${id}`} className="episode-back">
            ← 作品ページに戻る
          </Link>

          <h1 className="post-title">作品を編集</h1>

          <div className="form-group">
            <label className="form-label">作品タイトル</label>
            <input
              className="form-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">ジャンル</label>
            <select
              className="form-input"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option value="">選択してください</option>
              <option value="ファンタジー">ファンタジー</option>
              <option value="SF">SF</option>
              <option value="恋愛">恋愛</option>
              <option value="バトル">バトル</option>
              <option value="日常">日常</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">あらすじ</label>
            <textarea
              className="form-input form-textarea"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">作者名</label>
            <input
              className="form-input"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <button className="btn-submit" onClick={handleUpdate}>更新する</button>

          <button className="btn-delete" onClick={handleDelete}>この作品を削除する</button>
        </div>
      </main>
    </>
  )
}

export default WorkEdit