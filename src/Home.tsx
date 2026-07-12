import { useState, useEffect } from 'react'
import WorkCard from './WorkCard'
import Header from './Header'
import { supabase } from './supabaseClient'

type Work = {
  id: number
  title: string
  author: string
  genre: string
  description: string
}

const genres = ['すべて', 'ファンタジー', 'SF', '恋愛', 'バトル', '日常']

function Home() {
  const [works, setWorks] = useState<Work[]>([])
  const [keyword, setKeyword] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('すべて')

  useEffect(() => {
    const fetchWorks = async () => {
      let query = supabase.from('works').select()

      // ジャンルで絞り込み
      if (selectedGenre !== 'すべて') {
        query = query.eq('genre', selectedGenre)
      }

      // キーワードで絞り込み（タイトルに含まれる）
      if (keyword !== '') {
        query = query.ilike('title', `%${keyword}%`)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error(error)
        return
      }
      setWorks(data)
    }

    fetchWorks()
  }, [keyword, selectedGenre])

  return (
    <>
      <Header />
      <main className="main">
        <div className="search-box">
          <input
            className="search-input"
            type="text"
            placeholder="作品を検索..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="genre-filter">
          {genres.map((genre) => (
            <button
              key={genre}
              className={`genre-btn ${selectedGenre === genre ? 'active' : ''}`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>

        <section className="section">
          <h2 className="section-title">新着作品</h2>
          <div className="card-grid">
            {works.length === 0 ? (
              <p className="empty-text">作品が見つかりません</p>
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
      </main>
    </>
  )
}

export default Home