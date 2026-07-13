import { useState, useEffect } from 'react'
import WorkCard from './components/WorkCard'
import Header from './components/Header'
import Footer from './components/Footer'
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
  const [trending, setTrending] = useState<Work[]>([])
  const [keyword, setKeyword] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('すべて')

  // 話題の作品（直近7日のいいね数順）を取得
  useEffect(() => {
    const fetchTrending = async () => {
      // 7日前の日時を計算
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      // 直近7日のいいねを全部取得
      const { data: likes } = await supabase
        .from('likes')
        .select('work_id')
        .gte('created_at', sevenDaysAgo.toISOString())

      if (!likes || likes.length === 0) {
        setTrending([])
        return
      }

      // 作品ごとにいいね数を数える
      const countMap: { [key: number]: number } = {}
      likes.forEach((like) => {
        countMap[like.work_id] = (countMap[like.work_id] || 0) + 1
      })

      // いいねが多い順に作品idを並べる（上位4件）
      const topIds = Object.keys(countMap)
        .map(Number)
        .sort((a, b) => countMap[b] - countMap[a])
        .slice(0, 4)

      if (topIds.length === 0) {
        setTrending([])
        return
      }

      // その作品の情報を取得
      const { data: worksData } = await supabase
        .from('works')
        .select()
        .in('id', topIds)

      if (worksData) {
        // topIdsの順番（いいね数順）に並べ替える
        const sorted = topIds
          .map((id) => worksData.find((w) => w.id === id))
          .filter((w): w is Work => w !== undefined)
        setTrending(sorted)
      }
    }

    fetchTrending()
  }, [])

  // 新着作品（検索・ジャンル絞り込み）を取得
  useEffect(() => {
    const fetchWorks = async () => {
      let query = supabase.from('works').select()

      if (selectedGenre !== 'すべて') {
        query = query.eq('genre', selectedGenre)
      }
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
        {trending.length > 0 && (
          <section className="section">
            <h2 className="section-title">🔥 話題の作品</h2>
            <div className="card-grid">
              {trending.map((work) => (
                <WorkCard
                  key={work.id}
                  index={work.id}
                  title={work.title}
                  author={work.author}
                  genre={work.genre}
                  emoji="📖"
                />
              ))}
            </div>
          </section>
        )}

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
      <Footer />
    </>
  )
}

export default Home