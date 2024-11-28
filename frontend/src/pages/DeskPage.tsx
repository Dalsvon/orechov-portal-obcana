import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axiosInstance from '../services/axiosInstance';
import { FileText, Calendar, Tag, ExternalLink, ChevronDown } from 'lucide-react';

interface RSSItem {
  guid: string;
  link: string;
  category: string;
  title: string;
  description?: string;
  pubDate: string;
}

const ITEMS_PER_PAGE = 20;

const DeskPage = () => {
  const [items, setItems] = useState<RSSItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  const fetchRSSFeed = useCallback(async () => {
    try {
      const response = await axiosInstance.get<RSSItem[]>('/api/rss');
      setItems(response.data);
      
      const uniqueCategories = Array.from(
        new Set(response.data.map(item => item.category))
      ).sort() as string[];
      
      setCategories(uniqueCategories);
    } catch (err) {
      setError('Nepodařilo se načíst oznámení z úřední desky');
      console.error('Error fetching RSS feed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRSSFeed();
  }, [fetchRSSFeed]);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('cs-CZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, []);

  const filteredItems = useMemo(() => {
    return selectedCategory === 'all' 
      ? items 
      : items.filter(item => item.category === selectedCategory);
  }, [items, selectedCategory]);

  const displayedItems = useMemo(() => {
    return showAll ? filteredItems : filteredItems.slice(0, ITEMS_PER_PAGE);
  }, [filteredItems, showAll]);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setShowAll(false);
  }, []);

  const handleShowMore = useCallback(() => {
    setShowAll(true);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Úřední deska
        </h2>
        <a
          href="https://orechov2.imunis.cz/edeska/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors duration-200"
        >
          Zobrazit web úřední desky
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filtrovat podle kategorie:
        </label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
        >
          <option value="all">Všechny kategorie</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-6">
        {displayedItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {selectedCategory === 'all' 
              ? 'Momentálně nejsou k dispozici žádná oznámení.'
              : 'Pro vybranou kategorii nejsou k dispozici žádná oznámení.'}
          </div>
        ) : (
          <>
            {displayedItems.map((item) => (
              <article
                key={item.guid}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex flex-col space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex-grow">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-green-700 transition-colors duration-150 flex items-center gap-2"
                      >
                        <FileText className="w-5 h-5 flex-shrink-0" />
                        <span>{item.title}</span>
                        <ExternalLink className="w-4 h-4 flex-shrink-0 ml-1" />
                      </a>
                    </h3>
                  </div>

                  {item.description && item.description !== item.title && (
                    <p className="text-gray-600">{item.description}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <time className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(item.pubDate)}</span>
                    </time>
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      <span>{item.category}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {!showAll && filteredItems.length > ITEMS_PER_PAGE && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleShowMore}
                  className="flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors duration-200"
                >
                  Zobrazit všechna oznámení
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DeskPage;