import React from 'react';
import { useParams, Navigate, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatTitle, getSortedSlugs } from '../utils/docsRegistry';
import { ArrowLeft, ArrowRight } from 'lucide-react';

/* ── Custom link renderer: .md → /docs/slug ── */
const MarkdownLink = ({ href, children, ...props }) => {
  const navigate = useNavigate();

  if (href && href.endsWith('.md')) {
    const slug = href.replace(/^.*\//, '').replace(/\.md$/, '');
    return (
      <a
        href={`/docs/${slug}`}
        onClick={(e) => { e.preventDefault(); navigate(`/docs/${slug}`); }}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" {...props}>
      {children}
    </a>
  );
};

/* ── Main viewer ── */
const DocViewer = ({ docs }) => {
  const { slug } = useParams();

  if (!docs[slug]) {
    return <Navigate to="/docs/index" replace />;
  }

  const content = docs[slug];
  const slugs = getSortedSlugs(Object.keys(docs));
  const currentIndex = slugs.indexOf(slug);
  const prevSlug = currentIndex > 0 ? slugs[currentIndex - 1] : null;
  const nextSlug = currentIndex < slugs.length - 1 ? slugs[currentIndex + 1] : null;

  return (
    <div className="doc-viewer markdown-body">
      <div className="doc-header">
        <div className="doc-breadcrumb">
          Documentation <span className="separator">/</span> {formatTitle(slug)}
        </div>
      </div>

      <div className="doc-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{ a: MarkdownLink }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* ── Prev / Next navigation ── */}
      <div className="doc-pagination">
        {prevSlug ? (
          <Link to={`/docs/${prevSlug}`} className="page-nav-btn prev-btn">
            <ArrowLeft size={18} />
            <div className="page-nav-text">
              <span className="page-nav-label">Previous</span>
              <span className="page-nav-title">{formatTitle(prevSlug)}</span>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextSlug ? (
          <Link to={`/docs/${nextSlug}`} className="page-nav-btn next-btn">
            <div className="page-nav-text align-right">
              <span className="page-nav-label">Next</span>
              <span className="page-nav-title">{formatTitle(nextSlug)}</span>
            </div>
            <ArrowRight size={18} />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default DocViewer;
