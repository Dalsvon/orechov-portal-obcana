import { RequestHandler } from 'express';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { RSSFeed } from '../types/rssTypes';

const RSS_FEED_URL = 'https://orechov2.imunis.cz/edeska/feed/rss';

// Gets documents from RSS feed of imunis 
const getRSSFeed: RequestHandler = async (req, res) => {
  try {
    const response = await axios.get(RSS_FEED_URL);
    const feed: RSSFeed = await parseStringPromise(response.data);
    
    if (!feed.rss?.channel?.[0]?.item) {
      throw new Error('Invalid RSS feed structure');
    }

    const items = feed.rss.channel[0].item.map(item => ({
      guid: typeof item.guid[0] === 'string' ? item.guid[0] : item.guid[0]._,
      link: item.link[0],
      category: item.category[0],
      title: item.title[0],
      description: item.description?.[0],
      pubDate: item.pubDate[0]
    }));

    // Sort items by publication date (newest first)
    items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    res.json(items);
  } catch (error) {
    res.status(500).json({ 
      error: 'Nepodařilo se načíst domumenty z úřední desky. Zkuste to prosím později.' 
    });
  }
};

export default getRSSFeed;