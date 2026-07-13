import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-logo">📖 MangaHub</p>
        <nav className="footer-nav">
          <Link to="/terms" className="footer-link">利用規約</Link>
          <Link to="/privacy" className="footer-link">プライバシーポリシー</Link>
        </nav>
        <p className="footer-copy">© 2026 MangaHub</p>
      </div>
    </footer>
  )
}

export default Footer