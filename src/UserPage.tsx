import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Header from './components/Header'
import WorkCard from './components/WorkCard'
import { supabase } from './supabaseClient'

type Profile = {
  id: string
  username: string
}

type Work = {
  id: number
  title: string
  author: string
  genre: string
}

function UserPage() {
  const { id } = useParams()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      // ① プロフィールを取得
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select()
        .eq('id', id)
        .single()

      if (profileError) {
        console.error(profileError)
        setLoading(false)
        return
      }
      setProfile(profileData)

      // ② そのユーザーの作品一覧を取得
      const { data: worksData } = await supabase
        .from('works')
        .select()
        .eq('user_id', id)
        .order('created_at', { ascending: false })

      if (worksData) setWorks(worksData)
      setLoading(false)
    }

    fetchData()
  }, [id])

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

  if (!profile) {
    return (
      <>
        <Header />
        <main className="main">
          <p>ユーザーが見つかりません</p>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="main">
        <div className="user-page">
          <div className="user-header">
            <div className="user-avatar">{profile.username.charAt(0)}</div>
            <h1 className="user-name">{profile.username}</h1>
          </div>

          <section className="section">
            <h2 className="section-title">作品一覧</h2>
            <div className="card-grid">
              {works.length === 0 ? (
                <p className="empty-text">まだ作品がありません</p>
              ) : (
                works.map((work) => (
                  <WorkCard
                    key={work.id}
                    index={work.id}
                    title={work.title}
                    author={work.author}
                    genre={work.genre}
                    emoji="📖"
                  />
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default UserPage