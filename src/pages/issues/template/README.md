# Article Template

Copy the article template files for any new articles. After copying, customize the individual article (JSX and CSS) to match that article’s content and styling.

## How to create a new article (e.g. Article2)

1. Copy `ArticleTemplate.jsx` → `ArticleN.jsx` (e.g. `Article2.jsx`)
2. Copy `ArticleTemplate.css` → `ArticleN.css` (e.g. `Article2.css`)
3. In `ArticleN.jsx` (customize the individual article):
   - Change `ARTICLE_ID` to your article's database id (e.g. `'1'`, `'2'`)
   - Edit `PARAGRAPHS` with your content
   - Edit `EXTRA_CREDITS` (Photography, etc.)
   - Rename the component to `ArticleN`
   - Update the CSS import to `import './ArticleN.css'`
4. In `ArticleN.css`, add or override styles as needed for that article.
5. In `App.jsx`: add  
   `<Route path="/issues/N" element={<ArticleN />} />`

## Template article

The template pulls from article id `0` in the database (title, description, author, date). It is displayed at `/issues/0`.

## Database

- **DB stores:** title, date, author, description  
- **Article file stores:** paragraphs, extra credits (Photography, etc.)
