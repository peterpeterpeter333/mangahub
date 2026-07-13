import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from './components/Header'
import { supabase } from './supabaseClient'

type Episode = {
  id: number
  work_id: number
  title: string
  body: string
}

function EpisodeView() {
  const { id, epId } = useParams()
  const [episode, setEpisode] = useState<Episode | null>(null)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [workTitle, setWorkTitle] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      // ① 今見ているエピソードを取得
      const { data: episodeData, error: episodeError } = await supabase
        .from('episodes')
        .select()
        .eq('id', Number(epId))
        .single()

      if (episodeError) {
        console.error(episodeError)
        return
      }
      setEpisode(episodeData)

      // ② 前後の話を判定するため、同じ作品の全エピソードを取得
      const { data: listData } = await supabase
        .from('episodes')
        .select()
        .eq('work_id', Number(id))
        .order('id', { ascending: true })

      if (listData) setEpisodes(listData)

      // ③ 作品タイトルを取得
      const { data: workData } = await supabase
        .from('works')
        .select('title')
        .eq('id', Number(id))
        .single()

      if (workData) setWorkTitle(workData.title)
    }

    fetchData()
  }, [id, epId])

  if (!episode) {
    return (
      <>
        <Header />
        <main className="main">
          <p>読み込み中...</p>
        </main>
      </>
    )
  }

  // 今のエピソードが一覧の何番目かを探す
  const currentIndex = episodes.findIndex((ep) => ep.id === episode.id)
  const prevEpisode = episodes[currentIndex - 1]
  const nextEpisode = episodes[currentIndex + 1]

  return (
    <>
      <Header />
      <main className="main">
        <div className="episode-view">
          <Link to={`/work/${id}`} className="episode-back">
            ← {workTitle}
          </Link>

          <h1 className="episode-view-title">{episode.title}</h1>
          <div className="episode-body">{episode.body}</div>

          <div className="episode-nav">
            {prevEpisode ? (
              <Link to={`/work/${id}/episode/${prevEpisode.id}`} className="episode-nav-btn">
                ← 前の話
              </Link>
            ) : (
              <span className="episode-nav-btn disabled">← 前の話</span>
            )}

            {nextEpisode ? (
              <Link to={`/work/${id}/episode/${nextEpisode.id}`} className="episode-nav-btn">
                次の話 →
              </Link>
            ) : (
              <span className="episode-nav-btn disabled">次の話 →</span>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default EpisodeView