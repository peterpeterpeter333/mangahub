import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import { supabase } from './supabaseClient'

type Work = {
  id: number
  title: string
  genre: string
  created_at: string
}

function Dashboard() {
  const navigate = useNavigate()
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMyWorks = async () => {
      const { data: userData } = await supabase.auth.getUser()

      if (!userData.user) {
        navigate('/auth')
        return
      }

      const { data, error } = await supabase
        .from('works')
        .select()
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error(error)
        return
      }

      setWorks(data)
      setLoading(false)
    }

    fetchMyWorks()
  }, [navigate])

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
        <div className="dashboard">
          <h1 className="post-title">ワークスペース</h1>

          <Link to="/post" className="add-episode-btn">
            ＋ 新しい作品を作る
          </Link>

          <div className="my-works">
            <h2 className="episode-list-title">わたしの小説</h2>

            {works.length === 0 ? (
              <p className="empty-text">まだ作品がありません</p>
            ) : (
              works.map((work) => (
                <Link key={work.id} to={`/work/${work.id}/manage`} className="my-work-item">
                  <span className="my-work-title">{work.title}</span>
                  <span className="my-work-genre">{work.genre}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default Dashboard