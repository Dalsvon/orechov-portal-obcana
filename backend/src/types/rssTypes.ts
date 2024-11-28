 export interface RSSItem {
    //guid: [string];
    guid: [{ _: string; $: { isPermaLink: string } }] | [string];
    link: [string];
    category: [string];
    title: [string];
    description?: [string];
    pubDate: [string];
  }
  
  export interface RSSChannel {
    item: RSSItem[];
  }
  
  export interface RSSFeed {
    rss: {
      channel: [RSSChannel];
    };
  }
  