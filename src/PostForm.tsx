import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import { supabase } from './supabaseClient'

function PostForm() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('')
  const [desc, setDesc] = useState('')
  const [episodeTitle, setEpisodeTitle] = useState('')
  const [episodeBody, setEpisodeBody] = useState('')

  const handleSubmit = async () => {
    if (title === '') {
      alert('タイトルは必須です')
      return
    }

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
      alert('投稿するにはログインが必要です')
      navigate('/auth')
      return
    }

    // プロフィールからユーザー名を取得
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userData.user.id)
      .single()

    if (profileError || !profile) {
      alert('プロフィールが見つかりません')
      console.error(profileError)
      return
    }

    // ① 作品を保存（作者名はプロフィールのusername）
    const { data: workData, error: workError } = await supabase
      .from('works')
      .insert({
        title,
        author: profile.username,
        genre,
        description: desc,
        user_id: userData.user.id,
      })
      .select()
      .single()

    if (workError) {
      alert('作品の保存に失敗しました')
      console.error(workError)
      return
    }

    // ② 第1話を保存
    const { error: episodeError } = await supabase
      .from('episodes')
      .insert({
        work_id: workData.id,
        title: episodeTitle || '第1話',
        body: episodeBody,
      })

    if (episodeError) {
      alert('エピソードの保存に失敗しました')
      console.error(episodeError)
      return
    }

    alert('投稿しました！')
    navigate('/')
  }

  return (
    <>
      <Header />
      <main className="main">
        <div className="post-form">
          <h1 className="post-title">作品を投稿</h1>

          <div className="form-group">
            <label className="form-label">作品タイトル</label>
            <input
              className="form-input"
              type="text"
              placeholder="タイトルを入力..."
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
              placeholder="あらすじを入力..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">第1話のタイトル</label>
            <input
              className="form-input"
              type="text"
              placeholder="第1話 旅立ち..."
              value={episodeTitle}
              onChange={(e) => setEpisodeTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">第1話の本文</label>
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

export default PostForm