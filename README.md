# My Movie Collection PWA

A Progressive Web App to browse your personal movie collection with mood-based recommendations!

## Features

✨ **Browse Collection** - View your movies in a beautiful grid layout  
🎯 **Mood Recommendations** - Get movie suggestions based on your current mood  
📱 **iPhone Compatible** - Add to home screen like a native app  
🔍 **Search & Filter** - Find movies by title, genre, or year  
➕ **Add New Movies** - Expand your collection easily  
🎬 **Movie Details** - View posters, descriptions, ratings  
❤️ **Favorites & Watch History** - Track what you've seen and loved  

## Quick Setup

### 1. Get TMDB API Key (Optional but Recommended)

1. Go to [themoviedb.org](https://www.themoviedb.org/)
2. Create a free account
3. Go to Settings → API → Create → Developer
4. Fill out the form (use "Personal" for usage)
5. Copy your API Key (v3 auth)
6. Edit `script.js` line 8: `this.tmdbApiKey = 'YOUR_API_KEY_HERE';`

### 2. Serve the App

**Option A: Simple HTTP Server**
```bash
# If you have Python installed
cd movie-browser
python -m http.server 8000

# Then visit: http://localhost:8000
```

**Option B: Live Server (VS Code)**
1. Install "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"

**Option C: GitHub Pages**
1. Create GitHub repository
2. Upload all files
3. Enable GitHub Pages in repository settings

### 3. Add to iPhone Home Screen

1. Open the app in Safari on your iPhone
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Name it "Movies" and tap "Add"
5. The app icon will appear on your home screen!

## How to Use

### Browse Movies
- Scroll through your collection
- Use search bar to find specific titles
- Filter by genre or year

### Get Recommendations
1. Tap "What Should I Watch?"
2. Choose your mood:
   - **Action & Adventure** - Exciting, fast-paced films
   - **Relaxing** - Comedy, romance, feel-good movies
   - **Thoughtful** - Drama, biography, meaningful stories
   - **Escapist** - Sci-fi, fantasy, other worlds
   - **Suspenseful** - Thriller, mystery, edge-of-seat
   - **Classic** - Timeless films from the past
   - **Quick Watch** - Movies under 2 hours
   - **Surprise Me!** - Random pick from your collection

### Add New Movies
1. Tap "+ Add Movie"
2. **Search & Add**: Enter title, search TMDB, select from results
3. **Add Manually**: Fill in details yourself

### Movie Details
- Tap any movie card to see full details
- Mark movies as watched or add to favorites
- View plot, cast, ratings, and runtime

## File Structure

```
movie-browser/
├── index.html              # Main app page
├── styles.css              # Styling and responsive design
├── script.js               # App logic and functionality
├── manifest.json           # PWA configuration
├── sw.js                   # Service worker for offline support
├── Movies_Complete_Expanded.csv  # Your movie data
└── README.md               # This file
```

## Customization

### Add Icons
Create PNG icons in these sizes and place in the folder:
- icon-72.png, icon-96.png, icon-128.png
- icon-144.png, icon-152.png, icon-192.png
- icon-384.png, icon-512.png

### Modify Moods
Edit the mood categories in `script.js` around line 200 in the `recommendByMood()` function.

### Change Colors
Modify the CSS variables in `styles.css` to match your preferred color scheme.

## Data Storage

- Your movie collection is stored in browser localStorage
- Watch history and favorites are preserved between sessions  
- Data persists even when offline
- Export functionality coming in future updates

## Troubleshooting

**Movies not loading?**
- Check that the CSV file is in the same folder
- Open browser console (F12) to see any error messages

**No movie posters?**
- Add your TMDB API key to `script.js`
- Check your internet connection

**Can't add to home screen?**
- Make sure you're using Safari on iPhone
- The app must be served over HTTPS (or localhost)

**App looks broken on iPhone?**
- Clear Safari cache and reload
- Make sure all files are in the same directory

## What's Next?

Future features to consider:
- Export/import functionality for backing up your collection
- Sharing recommendations with friends  
- Advanced filtering (by decade, runtime, rating)
- Dark/light theme toggle
- Watchlist functionality
- Movie trailers integration

## Credits

- Movie data from [The Movie Database (TMDB)](https://www.themoviedb.org/)
- Icons from system emojis
- Built with vanilla HTML, CSS, and JavaScript

Enjoy browsing your movie collection! 🍿