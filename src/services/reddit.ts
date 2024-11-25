import Snoowrap from 'snoowrap';

const reddit = new Snoowrap({
  userAgent: 'crypto-news-hub/1.0.0',
  clientId: 'iXzXlktmB7IUTEQHIWwlGA',
  clientSecret: '1D2F6nIEQ0n-H_wXNUBJtFA-XfLeIA',
  username: 'MayaOfficial_'
});

export interface RedditMeme {
  id: string;
  title: string;
  url: string;
  permalink: string;
  author: string;
  score: number;
  created: number;
}

const MEME_SUBREDDITS = [
  'cryptocurrencymemes',
  'bitcoinmemes',
  'dogecoin'
];

export async function fetchCryptoMemes(limit = 10): Promise<RedditMeme[]> {
  try {
    const allMemes: RedditMeme[] = [];

    await Promise.all(
      MEME_SUBREDDITS.map(async (subreddit) => {
        const posts = await reddit.getSubreddit(subreddit).getHot({ limit: 5 });
        const memes = posts
          .filter(post => 
            post.post_hint === 'image' || 
            post.url.match(/\.(jpg|jpeg|png|gif)$/i)
          )
          .map(post => ({
            id: post.id,
            title: post.title,
            url: post.url,
            permalink: `https://reddit.com${post.permalink}`,
            author: post.author.name,
            score: post.score,
            created: post.created_utc * 1000
          }));
        allMemes.push(...memes);
      })
    );

    return allMemes
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching memes:', error);
    throw error;
  }
}