# Deploying to milkaserver.com with Cloudflare

## Method 1: Cloudflare Pages (Recommended)

### Prerequisites
- GitHub account
- Cloudflare account with milkaserver.com domain

### Steps

#### 1. Upload to GitHub
```bash
# Create new repository on GitHub named "movie-browser"
# Then in your movie-browser folder:

git init
git add .
git commit -m "Initial movie browser PWA"
git branch -M main
git remote add origin https://github.com/YOURUSERNAME/movie-browser.git
git push -u origin main
```

#### 2. Connect to Cloudflare Pages
1. Log into Cloudflare Dashboard
2. Go to **Pages** → **Create a project**
3. Choose **Connect to Git**
4. Select your `movie-browser` repository
5. Configure build settings:
   - **Project name**: `movies` (or whatever you prefer)
   - **Production branch**: `main`
   - **Build command**: Leave empty
   - **Build output directory**: `/`
6. Click **Save and Deploy**

#### 3. Set Custom Domain
1. In Cloudflare Pages, go to your project
2. Click **Custom domains** tab
3. Click **Set up a custom domain**
4. Enter: `movies.milkaserver.com` (or just `milkaserver.com`)
5. Cloudflare will automatically configure DNS

### Result
Your app will be available at: `https://movies.milkaserver.com`

---

## Method 2: Traditional Hosting (FTP/cPanel)

If you have traditional web hosting on milkaserver.com:

#### 1. Compress Files
```bash
# Zip all files in movie-browser folder
zip -r movie-browser.zip movie-browser/
```

#### 2. Upload via cPanel/FTP
1. Log into your hosting control panel
2. Navigate to File Manager or use FTP client
3. Upload all files to your domain's public folder:
   - `/public_html/` for main domain
   - `/public_html/movies/` for subdirectory
4. Extract the zip file

#### 3. Set Permissions
- Make sure all files have proper read permissions (644)
- Directories should have 755 permissions

---

## Method 3: Cloudflare Workers (Advanced)

For serverless deployment with edge computing:

#### 1. Install Wrangler CLI
```bash
npm install -g wrangler
wrangler login
```

#### 2. Create Worker
```bash
wrangler generate movie-browser
cd movie-browser
# Copy your files here
wrangler publish
```

---

## Post-Deployment Setup

### 1. Get TMDB API Key
1. Visit [themoviedb.org](https://www.themoviedb.org/)
2. Create free account
3. Go to Settings → API → Create → Developer
4. Get your API Key (v3)
5. Edit `script.js` line 8:
   ```javascript
   this.tmdbApiKey = 'YOUR_API_KEY_HERE';
   ```
6. Redeploy/reupload the updated file

### 2. Test PWA Features
1. Visit your site on iPhone Safari
2. Check that "Add to Home Screen" option appears
3. Test offline functionality
4. Verify movie loading and mood recommendations

### 3. Cloudflare Optimizations
In your Cloudflare dashboard:

#### Page Rules (Optional)
1. Go to **Page Rules**
2. Create rule for `movies.milkaserver.com/*`
3. Settings:
   - **Browser Cache TTL**: 1 month
   - **Cache Level**: Cache Everything
   - **Edge Cache TTL**: 1 month

#### Speed Settings
1. Go to **Speed** → **Optimization**
2. Enable:
   - **Auto Minify** (CSS, JavaScript, HTML)
   - **Brotli compression**
   - **Early Hints**

### 4. Security Settings
1. Go to **SSL/TLS** → **Edge Certificates**
2. Enable **Always Use HTTPS**
3. Set **Minimum TLS Version** to 1.2

## Updating Your App

### For Cloudflare Pages:
1. Make changes to your local files
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Updated movie collection"
   git push
   ```
3. Cloudflare Pages will auto-deploy

### For Traditional Hosting:
1. Upload modified files via FTP/cPanel
2. Clear Cloudflare cache if needed

## Troubleshooting

**App won't load?**
- Check Cloudflare DNS settings
- Verify SSL certificate is active
- Clear browser cache

**PWA features not working?**
- Ensure HTTPS is enabled
- Check service worker in browser dev tools
- Verify manifest.json is accessible

**Movies not loading?**
- Check CSV file uploaded correctly
- Verify TMDB API key is set
- Check browser console for errors

## Domain Suggestions

You could host the app at:
- `https://movies.milkaserver.com` (subdomain)
- `https://milkaserver.com/movies` (subdirectory)
- `https://milkaserver.com` (main domain)

Choose based on your preference and existing site structure.