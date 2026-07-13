import { Link } from 'react-router-dom'

type WorkCardProps = {
  index: number
  title: string
  author: string
  genre: string
  emoji: string
}

function WorkCard({ index, title, author, genre, emoji }: WorkCardProps) {
  return (
    <Link className="card" to={`/work/${index}`}>
      <div className="card-thumbnail">{emoji}</div>
      <div className="card-info">
        <p className="card-title">{title}</p>
        <p className="card-author">作者：{author}</p>
        <p className="card-genre">{genre}</p>
      </div>
    </Link>
  )
}

export default WorkCard