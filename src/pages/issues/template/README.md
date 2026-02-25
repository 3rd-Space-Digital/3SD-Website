# Article Template

Copy the article template files for any new articles. After copying, customize the individual article (JSX and CSS) to match your vision for that article's content and styling.

## How to create a new article (e.g. Article2)

1. Copy `ArticleTemplate.jsx` → `ArticleN.jsx` (e.g. `Article2.jsx`)
2. Copy `ArticleTemplate.css` → `ArticleN.css` (e.g. `Article2.css`)
3. In `ArticleN.jsx` (customize the individual article):
   - Change `ARTICLE_ID` to your article's database id (e.g. `'1'`, `'2'`)
   - Change `IMAGE_PATH_PREFIX` to match your article folder (e.g. `issue/article1`, `issue/article2`)
   - Edit the content inline: paragraphs, captions, image paths, credits
   - Rename the component to `ArticleN`
   - Update the CSS import to `import './ArticleN.css'`
4. In `ArticleN.css`, add or override styles as needed for that article.
5. In `App.jsx`: add  
   `<Route path="/issues/N" element={<ArticleN />} />`

## Structure

The template uses inline JSX: paragraphs, images, and captions are structured directly in the markup. Edit the JSX when copying to customize structure (add/remove paragraphs, change image layouts, etc.).

## Template article

The template pulls from article id `0` in the database (title, description, author, date). Images are loaded from `issue/article0/` in the images bucket. Displayed at `/issues/0`.

## Database

- **DB stores:** title, date, author, description  
- **Article file stores:** paragraphs, image paths, captions, credits
