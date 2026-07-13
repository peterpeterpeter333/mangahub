import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Header from './components/Header'
import { supabase } from './supabaseClient'

type Work = {
  id: number
  title: string
  genre: string
  user_id: string
}

type Episode = {
  id: number
  title: string
  body: string
}

function WorkManage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [work, setWork] = useState<Work | null>(null)
  const [episodes, setEpisodes] = useState<Episode[]>([])

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
      alert('この作品を管理する権限がありません')
      navigate('/dashboard')
      return
    }

    setWork(workData)

    const { data: episodeData } = await supabase
      .from('episodes')
      .select()
      .eq('work_id', Number(id))
      .order('id', { ascending: true })

    if (episodeData) setEpisodes(episodeData)
  }

  useEffect(() => {
    fetchData()
  }, [id])

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
        <div className="manage">
          <Link to="/dashboard" className="episode-back">
            ← ワークスペース
          </Link>

          <div className="manage-header">
            <div>
              <p className="detail-genre">{work.genre}</p>
              <h1 className="detail-title">{work.title}</h1>
            </div>
            <div className="manage-actions">
              <Link to={`/work/${id}`} className="edit-work-btn">
                公開ページを見る
              </Link>
              <Link to={`/work/${id}/edit`} className="edit-work-btn">
                作品情報を編集
              </Link>
            </div>
          </div>

          <div className="episode-list">
            <div className="episode-list-header">
              <h2 className="episode-list-title">章とエピソード</h2>
              <Link to={`/work/${id}/new-episode`} className="add-episode-btn">
                ＋ 次のエピソードを執筆
              </Link>
            </div>

            {episodes.length === 0 ? (
              <p className="empty-text">まだエピソードがありません</p>
            ) : (
              episodes.map((episode, index) => (
                <div key={episode.id} className="manage-episode-item">
                  <span className="episode-number">第{index + 1}話</span>
                  <span className="episode-title">{episode.title}</span>
                  <span className="episode-length">{episode.body.length} 文字</span>
                  <Link
                    to={`/work/${id}/episode/${episode.id}/edit`}
                    className="episode-edit-link"
                  >
                    編集
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default WorkManage